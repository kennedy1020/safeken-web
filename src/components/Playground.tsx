'use client';

import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Terminal } from 'lucide-react';

const SAMPLES = {
  npm: JSON.stringify(
    {
      name: 'ai-nextjs-app',
      version: '0.1.0',
      dependencies: {
        next: '^14.2.0',
        react: '^18.3.0',
        'supabase-realtime-quickconnect-ai': '^1.0.0', // Hallucinated
        'paystack-inline-v3-helper': '^0.0.1',        // Hallucinated
        '@types/node': '^20.0.0',
      },
    },
    null,
    2
  ),
  pypi: `# Python dependencies
fastapi>=0.110.0
uvicorn[standard]==0.29.0
langchain-groq-security-agent==0.1.0  # Hallucinated
supabase-py-admin-bypass==0.0.4       # Hallucinated
pydantic>=2.0.0
requests>=2.31.0`,
};

const CODE_PRESETS = {
  paystack: {
    title: 'Paystack Unverified Webhook',
    code: `export async function POST(req: Request) {
  const event = await req.json();
  if (event.event === 'charge.success') {
    await fulfillOrder(event.data.reference);
  }
  return new Response('OK');
}`,
    flaw: 'nextjs-paystack-unsigned-webhook: Webhook payload processed without x-paystack-signature HMAC SHA-512 validation.',
    remediation: `import crypto from 'node:crypto';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-paystack-signature');
  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
                     .update(body).digest('hex');

  if (hash !== signature) return new Response('Unauthorized', { status: 401 });
  const event = JSON.parse(body);
  // Safe fulfillment...
}`,
  },
  supabase: {
    title: 'Supabase Service Key in Client Component',
    code: `'use client';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);`,
    flaw: 'nextjs-supabase-service-role-client: Supabase admin service-role key instantiated in a client component.',
    remediation: `'use client';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);`,
  },
  secret: {
    title: 'Client Secret Bleed',
    code: `export const config = {
  apiKey: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY,
};`,
    flaw: 'nextjs-public-secret-bleed: Private backend secret exposed via NEXT_PUBLIC_ variable prefix.',
    remediation: `export const config = {
  apiKey: process.env.STRIPE_SECRET_KEY,
};`,
  },
};

interface FlaggedPackage {
  name: string;
  ecosystem?: string;
  status: string;
  issue: string;
}

interface ProbeResult {
  error?: string;
  flagged?: FlaggedPackage[];
  scanned?: number;
  ecosystem?: string;
}

export default function Playground() {
  const [activeTab, setActiveTab] = useState<'deps' | 'code'>('deps');
  const [ecosystem, setEcosystem] = useState<'npm' | 'pypi'>('npm');
  const [manifestInput, setManifestInput] = useState(SAMPLES.npm);
  const [probing, setProbing] = useState(false);
  const [probeResult, setProbeResult] = useState<ProbeResult | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof CODE_PRESETS>('paystack');

  const handleEcosystemChange = (newEco: 'npm' | 'pypi') => {
    setEcosystem(newEco);
    setManifestInput(SAMPLES[newEco]);
    setProbeResult(null);
  };

  const handleRunProbe = async () => {
    setProbing(true);
    setProbeResult(null);
    try {
      const res = await fetch('/api/probe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: manifestInput, ecosystem }),
      });
      const data = await res.json();
      setProbeResult(data);
    } catch {
      setProbeResult({ error: 'Network request failed' });
    } finally {
      setProbing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-xl border border-zinc-800 bg-zinc-950/80 backdrop-blur overflow-hidden shadow-2xl">
      <div className="flex border-b border-zinc-800 bg-zinc-900/50">
        <button
          onClick={() => setActiveTab('deps')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition ${
            activeTab === 'deps'
              ? 'text-white border-b-2 border-emerald-500 bg-zinc-900'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          Slopsquatting Detector (npm / PyPI)
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition ${
            activeTab === 'code'
              ? 'text-white border-b-2 border-emerald-500 bg-zinc-900'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Terminal className="w-4 h-4 text-cyan-400" />
          AST Code Auditor (Next.js / Paystack / Supabase)
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'deps' ? (
          <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEcosystemChange('npm')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition ${
                    ecosystem === 'npm'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                  }`}
                >
                  npm (package.json)
                </button>
                <button
                  onClick={() => handleEcosystemChange('pypi')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition ${
                    ecosystem === 'pypi'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                  }`}
                >
                  PyPI (requirements.txt)
                </button>
              </div>

              <button
                onClick={handleRunProbe}
                disabled={probing}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                {probing ? 'Probing Registry...' : `Audit ${ecosystem.toUpperCase()} Packages`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <textarea
              value={manifestInput}
              onChange={(e) => setManifestInput(e.target.value)}
              rows={8}
              className="w-full font-mono text-xs bg-zinc-900/90 text-zinc-200 p-4 rounded-lg border border-zinc-800 focus:outline-none focus:border-emerald-500 resize-none"
            />

            {probeResult && (
              <div className="mt-4 p-4 rounded-lg border border-zinc-800 bg-zinc-900">
                {probeResult.error ? (
                  <p className="text-red-400 text-sm">{probeResult.error}</p>
                ) : probeResult.flagged && probeResult.flagged.length > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span>{probeResult.flagged.length} Hallucinated Package(s) Detected (HTTP 404):</span>
                    </div>
                    <ul className="space-y-2 mt-2">
                      {probeResult.flagged.map((pkg: FlaggedPackage) => (
                        <li key={pkg.name} className="p-3 bg-red-950/30 border border-red-900/50 rounded text-xs font-mono">
                          <span className="text-red-300 font-bold">{pkg.name}</span>: {pkg.issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>All {probeResult.scanned} packages verified on {ecosystem === 'npm' ? 'npm' : 'PyPI'}!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex gap-2 mb-4">
              {(Object.keys(CODE_PRESETS) as Array<keyof typeof CODE_PRESETS>).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedPreset(key)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                    selectedPreset === key
                      ? 'bg-zinc-800 text-white border border-zinc-700'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {CODE_PRESETS[key].title}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-red-900/40 bg-zinc-900/80 p-4">
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase mb-2">
                  <AlertTriangle className="w-4 h-4" /> Flagged by vibe-shield
                </div>
                <pre className="font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap">
                  {CODE_PRESETS[selectedPreset].code}
                </pre>
                <div className="mt-4 pt-3 border-t border-red-950 text-xs text-red-300">
                  {CODE_PRESETS[selectedPreset].flaw}
                </div>
              </div>

              <div className="rounded-lg border border-emerald-900/40 bg-zinc-900/80 p-4">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase mb-2">
                  <CheckCircle2 className="w-4 h-4" /> Clean Remediation
                </div>
                <pre className="font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap">
                  {CODE_PRESETS[selectedPreset].remediation}
                </pre>
                <div className="mt-4 pt-3 border-t border-emerald-950 text-xs text-emerald-300">
                  AST checks pass with 0 warnings.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
