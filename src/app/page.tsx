import type { Metadata } from 'next';
import Link from 'next/link';
import DeterministicVsAi from '@/components/DeterministicVsAi';
import TerminalPreview from '@/components/TerminalPreview';
import LiveScanner from '@/components/LiveScanner';

export const metadata: Metadata = {
  title: 'SafeKen VibeShield | Deterministic AI-Code Security Scanner',
  description:
    'Detect AI package hallucinations (slopsquatting), client-side secret bleeds, and unverified payment webhooks with zero prompt drift.',
  keywords: [
    'cybersecurity',
    'AI hallucinations',
    'slopsquatting',
    'AST security',
    'npm security',
    'SAST',
    'Next.js security',
  ],
  openGraph: {
    title: 'SafeKen VibeShield — Deterministic Security for AI Codebases',
    description:
      'Mathematical certainty for AI-generated code. Catches fake dependencies, raw Supabase keys, and unsigned webhooks.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono font-bold">
              🛡️
            </span>
            <span className="font-mono text-base font-bold tracking-tight text-zinc-100">
              SafeKen <span className="text-emerald-400">VibeShield</span>
            </span>
            <span className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
              v1.1.3
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <Link
              href="https://github.com/kennedy1020/vibe-shield"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 text-zinc-300 transition-all hover:border-zinc-700 hover:text-zinc-100"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>GitHub</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-16 text-center sm:pt-28">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE ON NPM REGISTRY
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl sm:leading-[1.1]">
            Deterministic Security for{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              AI-Generated Code
            </span>
          </h1>

          <p className="text-lg text-zinc-400 sm:text-xl leading-relaxed">
            Stop dependency slopsquatting, client-side secret bleeds, and unverified payment webhooks before they reach production. Mathematical AST proof with zero API tokens.
          </p>

          {/* Quick Execution Pill */}
          <div className="mx-auto mt-8 flex max-w-xl items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/90 p-2 shadow-2xl font-mono text-xs sm:text-sm">
            <div className="flex items-center gap-3 pl-3 text-zinc-300 truncate">
              <span className="text-emerald-400 font-bold">$</span>
              <span className="truncate">npx @kennedy1020/vibe-shield@latest scan .</span>
            </div>
            <span className="hidden sm:inline-block rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400">
              Sub-2s Run
            </span>
          </div>
        </div>
      </section>

      {/* Live Interactive Playground */}
      <LiveScanner />

      {/* Interactive Terminal Section */}
      <TerminalPreview />

      {/* Comparison Engine Section */}
      <DeterministicVsAi />

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-12 text-center text-xs text-zinc-400 font-mono">
        <div className="mx-auto max-w-7xl px-6 space-y-2">
          <p>© 2026 SafeKen VibeShield. Open-source security under MIT License.</p>
          <p className="text-zinc-400">
            Built for developers using Cursor, Copilot, and LLMs who require deterministic CI builds.
          </p>
        </div>
      </footer>
    </main>
  );
}
