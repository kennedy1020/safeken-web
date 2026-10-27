import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { packageJsonText } = await req.json();
    let parsed: Record<string, unknown>;

    try {
      parsed = JSON.parse(packageJsonText);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
    }

    const dependencies: Record<string, string> = {
      ...(typeof parsed.dependencies === 'object' && parsed.dependencies !== null
        ? (parsed.dependencies as Record<string, string>)
        : {}),
      ...(typeof parsed.devDependencies === 'object' && parsed.devDependencies !== null
        ? (parsed.devDependencies as Record<string, string>)
        : {}),
    };

    const packageNames = Object.keys(dependencies);

    if (packageNames.length === 0) {
      return NextResponse.json({ flagged: [], scanned: 0 });
    }

    // Concurrent HEAD requests to npm registry (2.5s timeout per request)
    const checkResults = await Promise.all(
      packageNames.map(async (name) => {
        try {
          const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`, {
            method: 'HEAD',
            signal: AbortSignal.timeout(2500),
          });

          if (res.status === 404) {
            return {
              name,
              version: dependencies[name],
              status: 'MISSING_404',
              issue: 'Package does not exist on npm registry. High risk of slopsquatting!',
            };
          }
          return null;
        } catch {
          return null;
        }
      })
    );

    const flagged = checkResults.filter(Boolean);

    return NextResponse.json({
      flagged,
      scanned: packageNames.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
