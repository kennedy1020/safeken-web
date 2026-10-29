import React from 'react';

interface ComparisonRow {
  feature: string;
  llm: string;
  vibeShield: string;
}

const COMPARISONS: ComparisonRow[] = [
  {
    feature: 'Verification Engine',
    llm: 'Probabilistic guess inferred from context and prompt drift',
    vibeShield: 'Deterministic AST syntax traversal and semantic rule checks',
  },
  {
    feature: 'Slopsquatting Audit',
    llm: 'Guesses whether a package name sounds authentic',
    vibeShield: 'Direct HTTP HEAD query verifying 404 status on npm & PyPI',
  },
  {
    feature: 'CI/CD Predictability',
    llm: 'Unstable; non-deterministic outputs across model updates',
    vibeShield: '100% reproducible; identical inputs guarantee identical exit codes',
  },
  {
    feature: 'Audit Execution Time',
    llm: '5–30s latency waiting for LLM token streams',
    vibeShield: 'Sub-2 second execution directly in local shell or GitHub runner',
  },
  {
    feature: 'Infrastructure Cost',
    llm: 'Variable per-token API billing and third-party rate limits',
    vibeShield: '$0 API costs; completely self-contained binary',
  },
  {
    feature: 'Source Code Privacy',
    llm: 'Pipes private application logic to third-party model servers',
    vibeShield: 'Zero remote egress; code never leaves your local workspace',
  },
];

export default function DeterministicVsAi() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-24 text-zinc-100 sm:py-32">
      {/* Background glow accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 transform-gpu opacity-25 blur-3xl"
      >
        <div className="h-[28rem] w-[56rem] bg-gradient-to-tr from-emerald-500 to-cyan-500 opacity-30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ENGINE ARCHITECTURE
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Why We Don’t Use AI to <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Audit AI Code
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
            AI code assistants make probabilistic mistakes. Auditing them with another LLM introduces hallucinations checking hallucinations. SafeKen VibeShield replaces prompt guesswork with mathematical certainty.
          </p>
        </div>

        {/* Comparison Matrix */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-1 divide-y divide-zinc-800 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
            {/* Table Header: Large Screens */}
            <div className="hidden bg-zinc-900/90 p-4 font-mono text-xs uppercase tracking-wider text-zinc-400 lg:col-span-3 lg:block">
              Analysis Metric
            </div>
            <div className="hidden bg-zinc-900/90 p-4 font-mono text-xs uppercase tracking-wider text-rose-400/90 lg:col-span-4 lg:block">
              Probabilistic LLM Wrappers
            </div>
            <div className="hidden bg-zinc-900/90 p-4 font-mono text-xs uppercase tracking-wider text-emerald-400 lg:col-span-5 lg:block">
              SafeKen VibeShield Engine
            </div>
          </div>

          <div className="divide-y divide-zinc-800/70">
            {COMPARISONS.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 transition-colors hover:bg-zinc-800/30 lg:grid-cols-12"
              >
                {/* Metric Label */}
                <div className="flex items-center bg-zinc-900/30 p-4 text-sm font-semibold text-zinc-200 lg:col-span-3">
                  {row.feature}
                </div>

                {/* LLM Reality */}
                <div className="flex items-start gap-2.5 p-4 text-sm text-zinc-400 lg:col-span-4 lg:border-l lg:border-zinc-800/70">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-rose-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>{row.llm}</span>
                </div>

                {/* VibeShield Standard */}
                <div className="flex items-start gap-2.5 bg-emerald-500/[0.02] p-4 text-sm font-medium text-zinc-100 lg:col-span-5 lg:border-l lg:border-zinc-800/70">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>{row.vibeShield}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner / Proof Statement */}
        <div className="mt-12 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-zinc-900/40 to-teal-950/40 p-6 sm:p-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="space-y-1 text-center md:left">
              <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                Guaranteed Ground Truth
              </p>
              <blockquote className="text-base font-semibold text-zinc-200 sm:text-lg">
                &ldquo;You don&apos;t fight hallucinations with more hallucinations. Security is a binary proof, not a prompt.&rdquo;
              </blockquote>
            </div>
            <div className="shrink-0 font-mono text-xs text-zinc-400">
              <span className="inline-block rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 font-semibold text-emerald-400">
                exit code 0 | exit code 1
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
