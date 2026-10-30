import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icons';
import DeterministicVsAi from '@/components/DeterministicVsAi';
import TerminalPreview from '@/components/TerminalPreview';
import LiveScanner from '@/components/LiveScanner';
import HeroCliBox from '@/components/HeroCliBox';
import CloudWaitlist from '@/components/CloudWaitlist';

export const metadata: Metadata = {
  title: 'SafeKen VibeShield — Deterministic Security for AI Codebases',
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
    <main className="min-h-screen bg-[var(--ks-paper-deep)] text-[var(--ks-text)]">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-[var(--ks-rule)] bg-[var(--ks-paper-deep)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 text-[var(--ks-ink)] hover:opacity-90 transition-opacity">
            <span className="w-6 h-6 rounded flex items-center justify-center bg-[var(--ks-paper-raised)] border border-[var(--ks-edge)] text-[var(--ks-patina)]">
              <Icon name="shield" size={14} />
            </span>
            <span className="font-semibold text-sm tracking-tight">
              SafeKen <span className="font-normal text-[var(--ks-text-muted)]">VibeShield</span>
            </span>
            <span className="tabular-nums font-mono text-[10px] px-1.5 py-0.5 rounded border border-[var(--ks-rule)] text-[var(--ks-text-muted)]">
              v1.1.3
            </span>
          </Link>

          {/* Nav Links & GitHub */}
          <div className="flex items-center gap-3 sm:gap-5 text-xs font-medium">
            <nav className="flex items-center gap-3 sm:gap-5 text-[var(--ks-text-muted)]">
              <a href="#scanner" className="hover:text-[var(--ks-ink)] transition-colors">
                Workbench
              </a>
              <a href="#terminal" className="hover:text-[var(--ks-ink)] transition-colors">
                <span className="hidden sm:inline">Terminal Proof</span>
                <span className="sm:hidden">Terminal</span>
              </a>
              <a href="#architecture" className="hover:text-[var(--ks-ink)] transition-colors">
                <span className="hidden sm:inline">Architecture</span>
                <span className="sm:hidden">Engine</span>
              </a>
              <a href="#cloud" className="text-[var(--ks-patina)] hover:text-[var(--ks-ink)] transition-colors">
                Cloud
              </a>
            </nav>

            <Link
              href="https://github.com/kennedy1020/vibe-shield"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded border border-[var(--ks-edge)] bg-[var(--ks-paper-raised)] text-[var(--ks-ink)] hover:border-[var(--ks-patina)] transition-colors text-xs font-medium"
            >
              <Icon name="github" size={14} />
              <span className="hidden xs:inline">GitHub</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Claims & Execution */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--ks-ink)] leading-[1.12]">
                Deterministic Security for AI-Generated Codebases
              </h1>

              <p className="text-base sm:text-lg text-[var(--ks-text-muted)] leading-relaxed">
                Detect dependency slopsquatting, client-side secret bleeds, and unverified payment webhooks before production. Mathematical AST proof with zero API tokens.
              </p>

              {/* Quick CLI Execution Box */}
              <HeroCliBox />

              {/* Factual Proof Points */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--ks-rule)] text-xs">
                <div>
                  <div className="font-semibold text-[var(--ks-ink)] mb-0.5">Sub-2s Run</div>
                  <div className="text-[var(--ks-text-muted)]">Local CLI and CI runner execution</div>
                </div>
                <div>
                  <div className="font-semibold text-[var(--ks-ink)] mb-0.5">Zero Remote Egress</div>
                  <div className="text-[var(--ks-text-muted)]">Code never leaves your environment</div>
                </div>
                <div>
                  <div className="font-semibold text-[var(--ks-ink)] mb-0.5">Binary Exit Code</div>
                  <div className="text-[var(--ks-text-muted)]">exit 0 for pass, exit 1 for block</div>
                </div>
              </div>
            </div>

            {/* Right Column: Authentic Terminal Specimen */}
            <div className="lg:col-span-5">
              <div className="rounded-lg border border-[var(--ks-edge)] bg-[var(--ks-paper-deep)] overflow-hidden text-xs font-mono">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[var(--ks-rule)] bg-[var(--ks-paper-raised)] text-[11px] text-[var(--ks-text-muted)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--ks-vermilion)]" />
                    <span className="text-[var(--ks-ink)]">vibe-shield audit</span>
                  </div>
                  <span className="tabular-nums">1.14s</span>
                </div>

                {/* Output Content */}
                <div className="p-4 space-y-1.5 text-[11px] leading-relaxed text-[var(--ks-text)]">
                  <div className="text-[var(--ks-ink)] font-semibold">SafeKen VibeShield v1.1.3</div>
                  <div className="text-[var(--ks-text-faint)]">Probing package.json against npm registry...</div>
                  <div className="text-[var(--ks-vermilion)] font-medium pt-1">
                    CRITICAL [dependency-hallucination]: 1 issue found
                  </div>
                  <div className="text-[var(--ks-text-muted)] pl-2">
                    • package.json:18
                  </div>
                  <div className="text-[var(--ks-vermilion)] pl-2">
                    Package &quot;react-use-stream-ai-fake-package-9912&quot; does not exist on npm (HTTP 404)
                  </div>
                  <div className="text-amber-300 pl-2">
                    Slopsquatting risk: Attacker can publish this package to hijack build
                  </div>
                  <div className="pt-2 text-[var(--ks-rule)] select-none">──────────────────────────────────────</div>
                  <div className="flex items-center justify-between text-[var(--ks-vermilion)] font-semibold pt-1">
                    <span>Audit failed with exit code 1</span>
                    <span className="tabular-nums text-[10px] text-[var(--ks-text-faint)]">PID 4821</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Scanner */}
      <LiveScanner />

      {/* Terminal Proof Section */}
      <TerminalPreview />

      {/* Architecture Comparison Section */}
      <DeterministicVsAi />

      {/* SafeKen Cloud Early-Access Waitlist */}
      <CloudWaitlist />

      {/* Footer */}
      <footer className="border-t border-[var(--ks-rule)] bg-[var(--ks-paper-deep)] py-12 text-xs text-[var(--ks-text-muted)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[var(--ks-ink)]">SafeKen VibeShield</span>
            <span className="text-[var(--ks-rule)]">|</span>
            <span>Deterministic AST Security Scanner</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/kennedy1020/vibe-shield"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--ks-ink)] transition-colors"
            >
              GitHub Source
            </Link>
            <span className="text-[var(--ks-rule)]">•</span>
            <span>MIT License</span>
            <span className="text-[var(--ks-rule)]">•</span>
            <span>2026 SafeKen</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
