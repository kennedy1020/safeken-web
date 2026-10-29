import React from 'react';
import { Icon } from '@/components/Icons';

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
    vibeShield: 'Direct HTTP HEAD query verifying 404 status on npm and PyPI registries',
  },
  {
    feature: 'CI/CD Predictability',
    llm: 'Unstable; non-deterministic outputs across model updates',
    vibeShield: '100% reproducible; identical inputs guarantee identical exit codes',
  },
  {
    feature: 'Audit Execution Time',
    llm: '5–30s latency waiting for remote LLM token streams',
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
    vibeShield: 'Zero remote egress; source code never leaves your machine',
  },
];

export default function DeterministicVsAi() {
  return (
    <section id="architecture" className="py-20 border-t border-[var(--ks-rule)] bg-[var(--ks-paper-deep)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ks-patina)] mb-2">
            Engine Architecture
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--ks-ink)]">
            Why Deterministic Engines Beat LLM Wrappers
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--ks-text-muted)] leading-relaxed">
            AI code assistants make probabilistic errors. Auditing them with another LLM introduces hallucinations checking hallucinations. SafeKen replaces prompt guesswork with mathematical certainty.
          </p>
        </div>

        {/* Matrix Table */}
        <div className="rounded-lg border border-[var(--ks-edge)] bg-[var(--ks-paper)] overflow-hidden">
          {/* Header Row */}
          <div className="hidden sm:grid sm:grid-cols-12 border-b border-[var(--ks-rule)] bg-[var(--ks-paper-raised)] text-xs font-semibold tracking-wider uppercase text-[var(--ks-text-muted)]">
            <div className="p-3.5 sm:col-span-3">Analysis Metric</div>
            <div className="p-3.5 sm:col-span-4 border-l border-[var(--ks-rule)] text-[var(--ks-vermilion)]">
              Probabilistic LLM Wrappers
            </div>
            <div className="p-3.5 sm:col-span-5 border-l border-[var(--ks-rule)] text-[var(--ks-patina)]">
              SafeKen VibeShield Engine
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-[var(--ks-rule)]">
            {COMPARISONS.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 transition-colors duration-150 hover:bg-[var(--ks-paper-raised)]"
              >
                {/* Metric */}
                <div className="p-3.5 sm:col-span-3 text-xs sm:text-sm font-medium text-[var(--ks-ink)] bg-[var(--ks-paper-deep)] sm:bg-transparent">
                  {row.feature}
                </div>

                {/* LLM Reality */}
                <div className="p-3.5 sm:col-span-4 sm:border-l sm:border-[var(--ks-rule)] text-xs sm:text-sm text-[var(--ks-text-muted)] flex items-start gap-2.5">
                  <span className="text-[var(--ks-vermilion)] shrink-0 mt-0.5">
                    <Icon name="close" size={14} />
                  </span>
                  <span>{row.llm}</span>
                </div>

                {/* SafeKen Standard */}
                <div className="p-3.5 sm:col-span-5 sm:border-l sm:border-[var(--ks-rule)] text-xs sm:text-sm text-[var(--ks-text)] flex items-start gap-2.5 bg-[var(--ks-patina-pale)]">
                  <span className="text-[var(--ks-patina)] shrink-0 mt-0.5">
                    <Icon name="check" size={14} />
                  </span>
                  <span>{row.vibeShield}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Binary Truth Statement */}
        <div className="mt-8 rounded-lg border border-[var(--ks-rule)] bg-[var(--ks-paper-raised)] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[var(--ks-patina)] uppercase tracking-wider mb-1">
              Deterministic Ground Truth
            </p>
            <p className="text-sm sm:text-base font-medium text-[var(--ks-ink)]">
              &ldquo;You cannot fight hallucinations with more hallucinations. Security is binary proof, not a prompt.&rdquo;
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 font-mono text-xs text-[var(--ks-text-muted)] bg-[var(--ks-paper-deep)] px-3 py-1.5 rounded border border-[var(--ks-edge)]">
            <span className="text-[var(--ks-patina)] font-bold">exit 0</span>
            <span className="text-[var(--ks-rule)]">|</span>
            <span className="text-[var(--ks-vermilion)] font-bold">exit 1</span>
          </div>
        </div>
      </div>
    </section>
  );
}
