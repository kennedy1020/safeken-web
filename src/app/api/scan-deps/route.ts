import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { scannerRateLimiter } from '@/lib/ratelimit';

type Ecosystem = 'npm' | 'pypi';

interface CachedPackageRecord {
  exists: boolean;
  statusCode: number;
}

interface ScanTarget {
  name: string;
  spec: string;
  ecosystem: Ecosystem;
}

interface ScanResult {
  packageName: string;
  versionSpecifier: string;
  ecosystem: Ecosystem;
  exists: boolean;
  statusCode?: number;
  fromCache?: boolean;
  error?: string;
}

const EXCLUDED_PROTOCOLS = /^(workspace|file|git|link|http|https):/;

function normalizeNpmTarget(name: string, specifier: string = '*'): { cleanName: string; cleanSpec: string; skip: boolean } {
  if (EXCLUDED_PROTOCOLS.test(specifier)) return { cleanName: name, cleanSpec: specifier, skip: true };
  if (specifier.startsWith('npm:')) {
    const aliasTarget = specifier.slice(4);
    const lastAt = aliasTarget.lastIndexOf('@');
    if (lastAt > 0) {
      return { cleanName: aliasTarget.substring(0, lastAt), cleanSpec: aliasTarget.substring(lastAt + 1), skip: false };
    }
    return { cleanName: aliasTarget, cleanSpec: '*', skip: false };
  }
  return { cleanName: name, cleanSpec: specifier, skip: false };
}

function normalizePyPiTarget(line: string): { cleanName: string; cleanSpec: string; skip: boolean } {
  let cleaned = line.trim();
  if (!cleaned || cleaned.startsWith('#') || cleaned.startsWith('-')) return { cleanName: '', cleanSpec: '', skip: true };
  cleaned = cleaned.split(';')[0].trim();
  if (cleaned.startsWith('git+') || cleaned.includes('://')) return { cleanName: cleaned, cleanSpec: 'url', skip: true };

  const specMatch = cleaned.match(/^([a-zA-Z0-9_\-.]+(?:\[[^\]]+\])?)(.*)$/);
  if (!specMatch) return { cleanName: cleaned, cleanSpec: '*', skip: false };

  let rawName = specMatch[1];
  const specifier = specMatch[2]?.trim() || '*';
  if (rawName.includes('[')) rawName = rawName.split('[')[0];

  const canonicalName = rawName.toLowerCase().replace(/[-_.]+/g, '-');
  return { cleanName: canonicalName, cleanSpec: specifier, skip: false };
}

function buildRegistryUrl(packageName: string, ecosystem: Ecosystem): string {
  if (ecosystem === 'npm') {
    if (packageName.startsWith('@')) {
      const [scope, name] = packageName.split('/');
      return `https://registry.npmjs.org/${scope}%2F${name}`;
    }
    return `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;
  }
  return `https://pypi.org/pypi/${encodeURIComponent(packageName)}/json`;
}

async function probeRegistry(target: ScanTarget): Promise<ScanResult> {
  const url = buildRegistryUrl(target.name, target.ecosystem);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'SafeKen-VibeShield/1.1.3',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    return {
      packageName: target.name,
      versionSpecifier: target.spec,
      ecosystem: target.ecosystem,
      exists: response.ok,
      statusCode: response.status,
      fromCache: false,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      packageName: target.name,
      versionSpecifier: target.spec,
      ecosystem: target.ecosystem,
      exists: false,
      fromCache: false,
      error: error.name === 'AbortError' ? 'Registry timeout (>4000ms)' : error.message,
    };
  }
}

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  return forwardedFor ? forwardedFor.split(',')[0].trim() : req.headers.get('x-real-ip') || '127.0.0.1';
}

export async function POST(req: NextRequest) {
  // 1. IP Rate Limiting Guard
  let limit = 10;
  let remaining = 10;
  let reset = Date.now() + 60000;

  try {
    const ip = getClientIp(req);
    const rateCheck = await scannerRateLimiter.limit(ip);
    limit = rateCheck.limit;
    remaining = rateCheck.remaining;
    reset = rateCheck.reset;

    if (!rateCheck.success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.', retryAfterSeconds: retryAfter },
        { status: 429, headers: { 'Retry-After': retryAfter.toString() } }
      );
    }
  } catch {
    // If Redis is unreachable or credentials are placeholder, bypass rate limiting
  }

  const startTime = performance.now();

  try {
    const body = await req.json();
    const parsedTargets: ScanTarget[] = [];
    const isPyPi = body.ecosystem === 'pypi' || Boolean(body.requirements);

    if (isPyPi) {
      const rawLines = Array.isArray(body.requirements)
        ? body.requirements
        : typeof body.requirements === 'string'
        ? body.requirements.split('\n')
        : body.packages || [];

      for (const line of rawLines) {
        const target = normalizePyPiTarget(line);
        if (!target.skip && target.cleanName) {
          parsedTargets.push({ name: target.cleanName, spec: target.cleanSpec, ecosystem: 'pypi' });
        }
      }
    } else {
      const deps = { ...body.dependencies, ...body.devDependencies };
      for (const [name, spec] of Object.entries(deps)) {
        const target = normalizeNpmTarget(name, String(spec));
        if (!target.skip) {
          parsedTargets.push({ name: target.cleanName, spec: target.cleanSpec, ecosystem: 'npm' });
        }
      }
    }

    if (parsedTargets.length === 0) {
      return NextResponse.json({ totalChecked: 0, hallucinations: [], scanDurationMs: 0 });
    }

    // 2. Batch Check Redis Cache via mget
    let cachedEntries: Array<CachedPackageRecord | null> = [];
    try {
      const cacheKeys = parsedTargets.map((t) => `pkg-cache:${t.ecosystem}:${t.name}`);
      cachedEntries = await redis.mget<Array<CachedPackageRecord | null>>(...cacheKeys);
    } catch {
      cachedEntries = new Array(parsedTargets.length).fill(null);
    }

    const hits: ScanResult[] = [];
    const missesToProbe: ScanTarget[] = [];

    parsedTargets.forEach((target, index) => {
      const entry = cachedEntries?.[index];
      if (entry) {
        hits.push({
          packageName: target.name,
          versionSpecifier: target.spec,
          ecosystem: target.ecosystem,
          exists: entry.exists,
          statusCode: entry.statusCode,
          fromCache: true,
        });
      } else {
        missesToProbe.push(target);
      }
    });

    // 3. Probe Public Registries Only for Misses
    const probedResults = await Promise.all(missesToProbe.map((target) => probeRegistry(target)));

    // 4. Batch Store Probed Results in Redis
    if (probedResults.length > 0) {
      try {
        const pipeline = redis.pipeline();

        for (const result of probedResults) {
          // Do not cache transient network failures or timeouts
          if (result.error) continue;

          const key = `pkg-cache:${result.ecosystem}:${result.packageName}`;
          // 24 hours for verified existing packages, 1 hour for 404s
          const ttl = result.exists ? 86400 : 3600;

          pipeline.set(key, { exists: result.exists, statusCode: result.statusCode }, { ex: ttl });
        }

        await pipeline.exec();
      } catch {
        // Ignore cache storage failure if Redis credentials are placeholder
      }
    }

    // 5. Merge Cached Hits and Fresh Probes
    const combinedResults = [...hits, ...probedResults];
    const hallucinations = combinedResults.filter((r) => !r.exists && r.statusCode === 404);
    const networkFailures = combinedResults.filter((r) => r.error);

    return NextResponse.json(
      {
        ecosystem: isPyPi ? 'pypi' : 'npm',
        totalChecked: combinedResults.length,
        cacheHits: hits.length,
        registryFetches: probedResults.length,
        hallucinations: hallucinations.map((h) => ({
          packageName: h.packageName,
          versionSpecifier: h.versionSpecifier,
          ecosystem: h.ecosystem,
          cached: h.fromCache ?? false,
          hazard: 'Slopsquatting (AI Package Hallucination)',
          registryChecked: h.ecosystem === 'npm' ? 'registry.npmjs.org' : 'pypi.org',
          remediation: `Package not found on official ${h.ecosystem.toUpperCase()} index. Remove or replace before bad actors claim it.`,
        })),
        networkFailures,
        cleanPass: hallucinations.length === 0 && networkFailures.length === 0,
        scanDurationMs: Math.round(performance.now() - startTime),
      },
      {
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    );
  } catch {
    return NextResponse.json({ error: 'Malformed or invalid JSON payload.' }, { status: 400 });
  }
}
