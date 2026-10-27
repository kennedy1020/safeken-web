'use client';

import React, { useState } from 'react';
import Playground from '@/components/Playground';
import {
  Shield,
  ExternalLink,
  Terminal,
  GitPullRequest,
  Copy,
  Check,
  CheckCircle2,
  ShieldCheck,
  Lock,
  FileCode,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                            1. HERO QUICKSTART                              */
/* -------------------------------------------------------------------------- */
function HeroQuickstart() {
  const [activeTab, setActiveTab] = useState<'cli' | 'ci'>('cli');
  const [copied, setCopied] = useState(false);

  const cliCode = `npx @kennedy1020/vibe-shield scan .`;
  const ciCode = `- name: Run SafeKen VibeShield
  uses: kennedy1020/vibe-shield@v1.1.2`;

  const copySnippet = () => {
    navigator.clipboard.writeText(activeTab === 'cli' ? cliCode : ciCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-4">
      {/* Live Shields.io Badges */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <a
          href="https://www.npmjs.com/package/@kennedy1020/vibe-shield"
          target="_blank"
          rel="noreferrer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://img.shields.io/npm/v/@kennedy1020/vibe-shield?color=10b981&label=npm"
            alt="npm version"
          />
        </a>
        <a
          href="https://github.com/kennedy1020/vibe-shield"
          target="_blank"
          rel="noreferrer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://img.shields.io/badge/license-MIT-blue"
            alt="MIT License"
          />
        </a>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://img.shields.io/badge/ecosystem-npm%20%7C%20PyPI-emerald"
          alt="npm &amp; PyPI support"
        />
      </div>

      {/* Tabbed Snippet Box */}
      <div className="w-full rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-2xl overflow-hidden font-mono text-xs">
        <div className="flex items-center justify-between px-3 py-2 bg-zinc-950/60 border-b border-zinc-800">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('cli')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition ${
                activeTab === 'cli'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" /> CLI Command
            </button>
            <button
              onClick={() => setActiveTab('ci')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition ${
                activeTab === 'ci'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <GitPullRequest className="w-3.5 h-3.5" /> GitHub Action
            </button>
          </div>

          <button
            onClick={copySnippet}
            className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px] bg-zinc-800 px-2.5 py-1 rounded transition"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="p-3.5 text-zinc-200 overflow-x-auto whitespace-pre">
          {activeTab === 'cli' ? cliCode : ciCode}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            2. TERMINAL MOCKUP                              */
/* -------------------------------------------------------------------------- */
function TerminalMockup() {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl border border-zinc-800 bg-black/90 shadow-2xl overflow-hidden text-left font-mono text-xs">
      <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <span className="text-zinc-400 text-[11px]">SafeKen VibeShield — bash / powershell</span>
        <span className="text-zinc-600 text-[11px]">v1.1.2</span>
      </div>

      <div className="p-5 space-y-2.5 text-zinc-300">
        <p className="text-zinc-400">
          <span className="text-emerald-400 select-none">$</span> npx @kennedy1020/vibe-shield scan .
        </p>
        <p className="text-zinc-400">✔ Probing package registries (npm &amp; PyPI)...</p>

        <div className="p-2.5 rounded bg-red-950/30 border border-red-900/40 text-red-300 space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-red-400">
            <span>✖ [CRITICAL]</span> Package &quot;supabase-realtime-quickconnect-ai&quot; does not exist on npm
          </p>
          <p className="text-[11px] text-zinc-400 pl-4">
            → AI Hallucination Risk: Attackers can register this vacant package with malicious hooks.
          </p>
        </div>

        <div className="p-2.5 rounded bg-amber-950/30 border border-amber-900/40 text-amber-300 space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-amber-400">
            <span>▲ [HIGH]</span> app/api/webhook/route.ts: Unverified Paystack webhook receiver
          </p>
          <p className="text-[11px] text-zinc-400 pl-4">
            → Missing HMAC SHA-512 comparison. Anyone can send fake charge.success events.
          </p>
        </div>

        <p className="text-emerald-400">✔ 0 client-side private keys exposed in browser bundles</p>

        <div className="pt-2 border-t border-zinc-800 text-zinc-400 text-[11px] flex justify-between">
          <span>Scan completed in 1.4s · 2 vulnerabilities flagged</span>
          <span className="text-emerald-400 font-medium">SARIF report: .vibeshield/report.sarif</span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            3. RULE CATALOG GRID                            */
/* -------------------------------------------------------------------------- */
function RuleCatalog() {
  const engines = [
    {
      title: 'Package Integrity Engine',
      subtitle: 'Dependency Slopsquatting & Registry Probing',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      items: [
        'Real-time HTTP HEAD checks on npm & PyPI registries for 404 responses',
        'Detects package names hallucinated by LLMs before an attacker registers them',
        'Flags dangerous postinstall script execution patterns in lockfiles',
        'Whitelist bypass support via .vibeshieldrc.json for private org packages',
      ],
    },
    {
      title: 'Secret Bleed Detector',
      subtitle: 'Client Bundle & Framework Leak Detection',
      icon: <Lock className="w-5 h-5 text-cyan-400" />,
      items: [
        'Flags Supabase service_role keys declared inside "use client" components',
        'Catches NEXT_PUBLIC_* variables exposing database administrative secrets',
        'Detects server-only Prisma or pg drivers instantiated in client bundles',
        'Validates environment variable loading order in modern Next.js routes',
      ],
    },
    {
      title: 'Webhook Defense Guard',
      subtitle: 'Cryptographic Signature & Signature Verification',
      icon: <FileCode className="w-5 h-5 text-amber-400" />,
      items: [
        'Ensures Paystack routes verify x-paystack-signature using crypto.timingSafeEqual',
        'Flags Stripe endpoints that parse event bodies before constructEvent verification',
        'Catches raw-body stream consumption errors in Next.js App Router',
        'Outputs copy-pasteable safe handler code with correct cryptographic verification',
      ],
    },
  ];

  return (
    <section className="py-20 border-t border-zinc-900 bg-zinc-950 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-3">
          Built Specifically for AI-Assisted Workflows
        </h2>
        <p className="text-sm text-zinc-400 text-center max-w-xl mx-auto mb-14">
          SafeKen VibeShield focuses specifically on the logic flaws and supply-chain vulnerabilities that LLMs introduce when writing full-stack code.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {engines.map((engine, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-zinc-800/80 border border-zinc-700">
                    {engine.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white">{engine.title}</h3>
                    <p className="text-[11px] text-zinc-400">{engine.subtitle}</p>
                  </div>
                </div>

                <ul className="mt-4 space-y-2.5">
                  {engine.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                            4. MAIN PAGE EXPORT                             */
/* -------------------------------------------------------------------------- */
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      {/* Sticky Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/70 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-400" />
            <span className="font-bold text-lg tracking-tight">SafeKen VibeShield</span>
            <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
              v1.1.2
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <a
              href="https://github.com/kennedy1020/vibe-shield"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-white flex items-center gap-1 transition"
            >
              GitHub <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.npmjs.com/package/@kennedy1020/vibe-shield"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition"
            >
              npm package
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center flex flex-col items-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
          Don&apos;t let AI code expose your database or install fake packages.
        </h1>
        <p className="mt-6 text-lg text-zinc-400 max-w-2xl leading-relaxed">
          Coding tools help you build fast, but they often invent libraries that don&apos;t exist and put secret keys in public files. SafeKen VibeShield catches these mistakes before you deploy.
        </p>

        {/* Tabbed Quickstart: CLI & GitHub Action */}
        <div className="mt-8 w-full">
          <HeroQuickstart />
        </div>

        {/* Terminal Visual Proof Mockup */}
        <div className="mt-8 w-full">
          <TerminalMockup />
        </div>

        {/* In-Browser Interactive Sandbox */}
        <div className="mt-16 w-full text-left">
          <div className="mb-4 text-center">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Try the Interactive Web Sandbox
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Paste a manifest or code snippet below to run real-time checks directly in your browser.
            </p>
          </div>
          <Playground />
        </div>
      </section>

      {/* Heuristic Rule Catalog */}
      <RuleCatalog />

      {/* Comparison: Source Code vs. URL Scanners */}
      <section className="py-20 border-t border-zinc-900 bg-zinc-900/20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-4">
            Why scanning your code works better than scanning live URLs
          </h2>
          <p className="text-sm text-zinc-400 text-center max-w-xl mx-auto mb-12">
            Tools that only check your live website can&apos;t see your real source files, server routes, or dependencies.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40">
              <h3 className="font-semibold text-lg text-zinc-200 mb-2">Live Website Scanners</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Waits until your site is already deployed to crawl public web pages from the outside.
              </p>
              <ul className="space-y-3 text-xs text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>Blind to your backend:</strong> Can&apos;t see server actions, route handlers, or database logic.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>Ignores dependencies:</strong> Doesn&apos;t check if AI invented a fake package that attackers can exploit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>Misses payment flaws:</strong> Can&apos;t verify whether webhooks safely check signatures.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-emerald-900/50 bg-emerald-950/10">
              <h3 className="font-semibold text-lg text-emerald-400 mb-2">SafeKen VibeShield</h3>
              <p className="text-sm text-zinc-300 mb-4">
                Checks your actual project files directly in your browser, terminal, or GitHub Actions.
              </p>
              <ul className="space-y-3 text-xs text-zinc-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Verifies packages in real time:</strong> Checks npm and PyPI to ensure every dependency is real.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Protects your database:</strong> Flags secret keys and admin privileges leaking to public browsers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Prevents payment spoofing:</strong> Ensures Paystack and Stripe webhooks verify real digital signatures.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 px-6 text-center text-xs text-zinc-500">
        <p>Built by Kennedy Adongo · SafeKen Security · Open Source (MIT)</p>
      </footer>
    </main>
  );
}
