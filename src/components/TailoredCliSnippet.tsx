'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/Icons';

interface TailoredCliSnippetProps {
  type: 'manifest' | 'code';
  ecosystem?: 'npm' | 'pypi';
  findings: Array<{ ruleId?: string; name?: string }>;
}

export default function TailoredCliSnippet({
  type,
  ecosystem = 'npm',
  findings,
}: TailoredCliSnippetProps) {
  const [includeSarif, setIncludeSarif] = useState(false);
  const [isolatedRules, setIsolatedRules] = useState(true);
  const [copied, setCopied] = useState(false);

  // Extract distinct AST rules detected during the scan
  const detectedRules = Array.from(
    new Set(findings.map((f) => f.ruleId).filter(Boolean))
  ) as string[];

  // Build the dynamic terminal command
  const buildCommand = (): string => {
    const parts = ['npx @kennedy1020/vibe-shield@1.1.3 scan .'];

    if (type === 'manifest') {
      if (ecosystem === 'pypi') {
        parts.push('--manifest requirements.txt');
      } else {
        parts.push('--manifest package.json');
      }
    } else if (type === 'code' && isolatedRules && detectedRules.length > 0) {
      parts.push(`--rules ${detectedRules.join(',')}`);
    }

    if (includeSarif) {
      parts.push('--format sarif --output vibe-shield.sarif');
    }

    return parts.join(' ');
  };

  const command = buildCommand();

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded border border-[var(--ks-edge)] bg-[var(--ks-paper-deep)] p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ks-ink)]">
          <Icon name="terminal" size={14} className="text-[var(--ks-patina)]" />
          <span>Reproduce in Local Terminal</span>
        </div>

        {/* Options to tune flags */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-[var(--ks-text-muted)]">
          {detectedRules.length > 0 && type === 'code' && (
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-[var(--ks-ink)]">
              <input
                type="checkbox"
                checked={isolatedRules}
                onChange={(e) => setIsolatedRules(e.target.checked)}
                className="accent-[var(--ks-patina)] rounded"
              />
              <span>Target flagged rules only ({detectedRules.length})</span>
            </label>
          )}

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-[var(--ks-ink)]">
            <input
              type="checkbox"
              checked={includeSarif}
              onChange={(e) => setIncludeSarif(e.target.checked)}
              className="accent-[var(--ks-patina)] rounded"
            />
            <span>Export SARIF file</span>
          </label>
        </div>
      </div>

      {/* Terminal Block */}
      <div className="flex items-center justify-between gap-3 bg-[var(--ks-paper)] border border-[var(--ks-rule)] rounded p-2.5 font-mono text-xs">
        <div className="flex items-center gap-2 overflow-x-auto text-[var(--ks-ink)] whitespace-nowrap">
          <span className="text-[var(--ks-patina)] font-bold select-none">$</span>
          <span>{command}</span>
        </div>

        <button
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-[var(--ks-paper-raised)] border border-[var(--ks-edge)] hover:border-[var(--ks-patina)] text-[var(--ks-text)] hover:text-[var(--ks-ink)] rounded text-xs font-medium transition-colors"
        >
          <Icon name={copied ? 'check' : 'copy'} size={13} className={copied ? 'text-[var(--ks-patina)]' : ''} />
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <p className="text-[11px] text-[var(--ks-text-muted)]">
        Run this command inside your project root to execute the identical deterministic checks locally before pushing.
      </p>
    </div>
  );
}
