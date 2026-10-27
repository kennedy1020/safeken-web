'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Terminal,
  Copy,
  Check,
  RotateCcw,
  Download,
} from 'lucide-react';
import { exportToMarkdown, exportToSarif, downloadFile } from '@/lib/exportReports';

const SAMPLES = {
  npm: JSON.stringify(
    {
      name: 'my-ai-app',
      dependencies: {
        next: '^14.2.0',
        react: '^18.3.0',
        'supabase-realtime-quickconnect-ai': '^1.0.0', // Hallucinated
        'paystack-inline-v3-helper': '^0.0.1',        // Hallucinated
      },
    },
    null,
    2
  ),
  pypi: `# Python dependencies
fastapi>=0.110.0
langchain-groq-security-agent==0.1.0  # Hallucinated
pydantic>=2.0.0`,
  code: `'use client';
import { createClient } from '@supabase/supabase-js';

// Leaking service_role key to client bundle!
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);`,
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

interface AuditFinding {
  ruleId: string;
  severity: 'CRITICAL' | 'HIGH' | 'WARN';
  title: string;
  description: string;
  suggestedFix: string;
}

interface CodeAuditResult {
  error?: string;
  findings?: AuditFinding[];
  scannedLines?: number;
}

export default function Playground() {
  const [activeTab, setActiveTab] = useState<'deps' | 'code'>('deps');

  // Manifest Probe State
  const [ecosystem, setEcosystem] = useState<'npm' | 'pypi'>('npm');
  const [manifestInput, setManifestInput] = useState(SAMPLES.npm);
  const [probing, setProbing] = useState(false);
  const [probeResult, setProbeResult] = useState<ProbeResult | null>(null);

  // Custom Code Auditor State
  const [codeInput, setCodeInput] = useState(SAMPLES.code);
  const [auditingCode, setAuditingCode] = useState(false);
  const [codeResult, setCodeResult] = useState<CodeAuditResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleRunManifestProbe = async () => {
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
      setProbeResult({ error: 'Failed to connect to audit server' });
    } finally {
      setProbing(false);
    }
  };

  const handleRunCodeAudit = async () => {
    setAuditingCode(true);
    setCodeResult(null);
    try {
      const res = await fetch('/api/audit-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeInput }),
      });
      const data = await res.json();
      setCodeResult(data);
    } catch {
      setCodeResult({ error: 'Failed to analyze code snippet' });
    } finally {
      setAuditingCode(false);
    }
  };

  const handleExportManifestReport = (format: 'md' | 'sarif') => {
    if (!probeResult) return;
    const findings = probeResult.flagged || [];
    if (format === 'md') {
      const md = exportToMarkdown({
        type: 'manifest',
        ecosystem,
        findings,
        scannedCount: probeResult.scanned,
      });
      downloadFile(md, `vibeshield-${ecosystem}-audit.md`, 'text/markdown');
    } else {
      const sarif = exportToSarif({
        type: 'manifest',
        ecosystem,
        findings,
      });
      downloadFile(sarif, `vibeshield-${ecosystem}-audit.sarif`, 'application/json');
    }
  };

  const handleExportCodeReport = (format: 'md' | 'sarif') => {
    if (!codeResult) return;
    const findings = codeResult.findings || [];
    if (format === 'md') {
      const md = exportToMarkdown({
        type: 'code',
        findings,
        scannedCount: codeResult.scannedLines,
      });
      downloadFile(md, 'vibeshield-code-audit.md', 'text/markdown');
    } else {
      const sarif = exportToSarif({
        type: 'code',
        findings,
      });
      downloadFile(sarif, 'vibeshield-code-audit.sarif', 'application/json');
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-xl border border-zinc-800 bg-zinc-950/80 backdrop-blur overflow-hidden shadow-2xl">
      {/* Top Tab Bar */}
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
          1. Slopsquatting Auditor (Paste Manifest)
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
          2. Code Vulnerability Scanner (Paste Code)
        </button>
      </div>

      <div className="p-6">
        {/* TAB 1: MANIFEST SCANNER */}
        {activeTab === 'deps' ? (
          <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEcosystem('npm');
                    setManifestInput(SAMPLES.npm);
                    setProbeResult(null);
                  }}
                  className={`px-3 py-1 rounded text-xs font-semibold transition ${
                    ecosystem === 'npm'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                  }`}
                >
                  npm (package.json)
                </button>
                <button
                  onClick={() => {
                    setEcosystem('pypi');
                    setManifestInput(SAMPLES.pypi);
                    setProbeResult(null);
                  }}
                  className={`px-3 py-1 rounded text-xs font-semibold transition ${
                    ecosystem === 'pypi'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                  }`}
                >
                  PyPI (requirements.txt)
                </button>
                <button
                  onClick={() => setManifestInput('')}
                  className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 ml-2"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </div>

              <button
                onClick={handleRunManifestProbe}
                disabled={probing || !manifestInput.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                {probing ? 'Probing Registry...' : `Audit ${ecosystem.toUpperCase()} Dependencies`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <textarea
              value={manifestInput}
              onChange={(e) => setManifestInput(e.target.value)}
              placeholder={
                ecosystem === 'npm'
                  ? 'Paste your package.json dependencies here...'
                  : 'Paste your requirements.txt dependencies here...'
              }
              rows={9}
              className="w-full font-mono text-xs bg-zinc-900/90 text-zinc-200 p-4 rounded-lg border border-zinc-800 focus:outline-none focus:border-emerald-500 resize-none"
            />

            {probeResult && (
              <div className="mt-4 p-4 rounded-lg border border-zinc-800 bg-zinc-900">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                  <span className="text-xs text-zinc-400 font-mono">
                    Scanned {probeResult.scanned} packages
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExportManifestReport('md')}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded border border-zinc-700 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> Markdown (.md)
                    </button>
                    <button
                      onClick={() => handleExportManifestReport('sarif')}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded border border-zinc-700 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> SARIF (.sarif)
                    </button>
                  </div>
                </div>

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
          /* TAB 2: CODE SCANNER & SUGGESTED FIXES */
          <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Presets:</span>
                <button
                  onClick={() => {
                    setCodeInput(`export async function POST(req: Request) {
  const event = await req.json();
  if (event.event === 'charge.success') {
    await fulfillOrder(event.data.reference);
  }
  return new Response('OK');
}`);
                    setCodeResult(null);
                  }}
                  className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 text-xs"
                >
                  Paystack Webhook
                </button>
                <button
                  onClick={() => {
                    setCodeInput(SAMPLES.code);
                    setCodeResult(null);
                  }}
                  className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 text-xs"
                >
                  Supabase Client Leak
                </button>
                <button
                  onClick={() => {
                    setCodeInput(`export const config = {
  apiKey: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY,
};`);
                    setCodeResult(null);
                  }}
                  className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 text-xs"
                >
                  Secret Bleed
                </button>
                <button
                  onClick={() => {
                    setCodeInput('');
                    setCodeResult(null);
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 ml-2"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </div>

              <button
                onClick={handleRunCodeAudit}
                disabled={auditingCode || !codeInput.trim()}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                {auditingCode ? 'Auditing Code...' : 'Scan Code & Generate Fix'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <textarea
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Paste any Next.js API route, component, or webhook handler code here to scan..."
              rows={9}
              className="w-full font-mono text-xs bg-zinc-900/90 text-zinc-200 p-4 rounded-lg border border-zinc-800 focus:outline-none focus:border-cyan-500 resize-none"
            />

            {codeResult && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/60">
                  <span className="text-xs text-zinc-400 font-mono">
                    Scanned {codeResult.scannedLines} lines of code
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExportCodeReport('md')}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded border border-zinc-700 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> Markdown (.md)
                    </button>
                    <button
                      onClick={() => handleExportCodeReport('sarif')}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded border border-zinc-700 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> SARIF (.sarif)
                    </button>
                  </div>
                </div>

                {codeResult.error ? (
                  <div className="p-4 rounded-lg border border-red-900/50 bg-red-950/20 text-red-400 text-sm">
                    {codeResult.error}
                  </div>
                ) : codeResult.findings && codeResult.findings.length > 0 ? (
                  codeResult.findings.map((f: AuditFinding, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-red-900/60 bg-zinc-900/90 p-5 space-y-4 shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                          <h4 className="font-semibold text-white text-sm">{f.title}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-mono font-bold">
                            {f.severity}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-zinc-500">{f.ruleId}</span>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed">{f.description}</p>

                      {/* Remediation Block */}
                      <div className="rounded-lg border border-emerald-900/50 bg-black/60 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> Suggested Remediation Fix
                          </span>
                          <button
                            onClick={() => copyToClipboard(f.suggestedFix, idx)}
                            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white bg-zinc-800 px-2.5 py-1 rounded transition"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" /> Copy Fix
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="font-mono text-xs text-zinc-200 overflow-x-auto whitespace-pre-wrap">
                          {f.suggestedFix}
                        </pre>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-lg border border-emerald-900/50 bg-emerald-950/20 text-emerald-400 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>No vulnerabilities or secret bleeds detected across {codeResult.scannedLines} lines of code!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
