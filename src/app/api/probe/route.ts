import { NextRequest, NextResponse } from 'next/server';

// Regex to extract Python package names, stripping version specs, extras, and environment markers
const PYPI_PKG_REGEX = /^([a-zA-Z0-9_.\-]+)(?:\[[^\]]+\])?(?:\s*[=><~!].*)?$/;

function parseRequirementsTxt(content: string): string[] {
  const lines = content.split('\n');
  const packages = new Set<string>();

  for (let line of lines) {
    line = line.trim();
    // Skip empty lines, comments, and pip option flags (-r, -i, etc.)
    if (!line || line.startsWith('#') || line.startsWith('-')) continue;

    // Remove inline comments
    const [cleanLine] = line.split('#');
    const match = cleanLine.trim().match(PYPI_PKG_REGEX);
    if (match && match[1]) {
      packages.add(match[1].toLowerCase());
    }
  }

  return Array.from(packages);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const content = body.content ?? body.packageJsonText;
    const ecosystem = body.ecosystem || 'npm';

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Manifest content is required' }, { status: 400 });
    }

    let packageNames: string[] = [];

    if (ecosystem === 'npm') {
      try {
        const parsed = JSON.parse(content) as Record<string, unknown>;
        const deps = {
          ...((parsed.dependencies as Record<string, string>) || {}),
          ...((parsed.devDependencies as Record<string, string>) || {}),
        };
        packageNames = Object.keys(deps);
      } catch {
        return NextResponse.json({ error: 'Invalid JSON format for package.json' }, { status: 400 });
      }
    } else if (ecosystem === 'pypi') {
      packageNames = parseRequirementsTxt(content);
    } else {
      return NextResponse.json({ error: 'Unsupported ecosystem' }, { status: 400 });
    }

    if (packageNames.length === 0) {
      return NextResponse.json({ flagged: [], scanned: 0, ecosystem });
    }

    // Probe the matching registry concurrently with a 2500ms timeout
    const results = await Promise.all(
      packageNames.map(async (name) => {
        const targetUrl =
          ecosystem === 'npm'
            ? `https://registry.npmjs.org/${encodeURIComponent(name)}`
            : `https://pypi.org/pypi/${encodeURIComponent(name)}/json`;

        try {
          const res = await fetch(targetUrl, {
            method: 'HEAD',
            signal: AbortSignal.timeout(2500),
          });

          if (res.status === 404) {
            return {
              name,
              ecosystem,
              status: 'MISSING_404',
              issue: `Package not found on ${ecosystem === 'npm' ? 'npm' : 'PyPI'}. Potential AI hallucination or slopsquatting risk!`,
            };
          }
          return null;
        } catch {
          return null;
        }
      })
    );

    const flagged = results.filter(Boolean);

    return NextResponse.json({
      flagged,
      scanned: packageNames.length,
      ecosystem,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
