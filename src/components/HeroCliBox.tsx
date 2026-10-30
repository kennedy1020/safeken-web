'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/Icons';

const CLI_COMMAND = 'npx @kennedy1020/vibe-shield scan .';

const GITHUB_ACTIONS_YAML = `name: SafeKen VibeShield Audit
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npx @kennedy1020/vibe-shield scan .`;

export default function HeroCliBox() {
  const [activeTab, setActiveTab] = useState<'cli' | 'ci'>('cli');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = activeTab === 'cli' ? CLI_COMMAND : GITHUB_ACTIONS_YAML;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="rounded-lg border border-[var(--ks-edge)] bg-[var(--ks-paper)] overflow-hidden">
      {/* Tab Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--ks-rule)] bg-[var(--ks-paper-raised)] text-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('cli');
              setCopied(false);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-colors ${
              activeTab === 'cli'
                ? 'bg-[var(--ks-paper)] text-[var(--ks-ink)] border border-[var(--ks-patina)] font-semibold'
                : 'text-[var(--ks-text-muted)] hover:text-[var(--ks-ink)] border border-transparent'
            }`}
          >
            <Icon name="terminal" size={12} className={activeTab === 'cli' ? 'text-[var(--ks-patina)]' : ''} />
            <span>Local CLI</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('ci');
              setCopied(false);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-colors ${
              activeTab === 'ci'
                ? 'bg-[var(--ks-paper)] text-[var(--ks-ink)] border border-[var(--ks-patina)] font-semibold'
                : 'text-[var(--ks-text-muted)] hover:text-[var(--ks-ink)] border border-transparent'
            }`}
          >
            <Icon name="github" size={12} className={activeTab === 'ci' ? 'text-[var(--ks-patina)]' : ''} />
            <span>Run in CI/CD (GitHub Actions)</span>
          </button>
        </div>

        <span className="hidden sm:inline font-mono text-[10px] text-[var(--ks-text-faint)]">
          {activeTab === 'cli' ? 'Zero-config execution' : '.github/workflows/vibe-shield.yml'}
        </span>
      </div>

      {/* Tab Body */}
      {activeTab === 'cli' ? (
        <div className="p-3 sm:p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center justify-between gap-2.5 flex-1 min-w-0">
            <div className="flex items-center gap-2.5 font-mono text-xs overflow-x-auto text-[var(--ks-ink)] py-1">
              <span className="text-[var(--ks-patina)] font-bold select-none">$</span>
              <span className="whitespace-nowrap">{CLI_COMMAND}</span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium border border-[var(--ks-rule)] bg-[var(--ks-paper-raised)] text-[var(--ks-text)] hover:text-[var(--ks-ink)] hover:border-[var(--ks-patina)] transition-colors"
              title="Copy CLI command to clipboard"
              aria-label="Copy CLI command"
            >
              <Icon name={copied ? 'check' : 'copy'} size={13} className={copied ? 'text-[var(--ks-patina)]' : ''} />
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <a
            href="#scanner"
            className="shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded text-xs font-semibold bg-[var(--ks-ink)] text-[var(--ks-paper-deep)] hover:bg-white transition-colors"
          >
            <span>Open Workbench</span>
            <Icon name="next" size={13} />
          </a>
        </div>
      ) : (
        <div className="p-3.5 bg-[var(--ks-paper-deep)] space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-[var(--ks-text-muted)]">
              Breaks PR builds automatically on critical AST or slopsquatting findings (<code className="font-mono text-[var(--ks-vermilion)]">exit 1</code>):
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-[var(--ks-ink)] text-[var(--ks-paper-deep)] hover:bg-white transition-colors"
              title="Copy GitHub Actions YAML"
            >
              <Icon name={copied ? 'check' : 'copy'} size={13} />
              <span>{copied ? 'Copied YAML' : 'Copy YAML'}</span>
            </button>
          </div>

          <pre className="font-mono text-[11px] leading-relaxed text-[var(--ks-ink)] bg-[var(--ks-paper)] border border-[var(--ks-rule)] rounded p-3 overflow-x-auto">
            {GITHUB_ACTIONS_YAML}
          </pre>
        </div>
      )}
    </div>
  );
}
