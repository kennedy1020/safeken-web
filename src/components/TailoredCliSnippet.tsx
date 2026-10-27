'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

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
    const parts = ['npx @kennedy1020/vibe-shield@1.1.2 scan .'];

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
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Reproduce in Local Terminal:</span>
        </div>

        {/* Options to tune flags */}
        <div className="flex items-center gap-4 text-[11px] text-zinc-400">
          {detectedRules.length > 0 && type === 'code' && (
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-200">
              <input
                type="checkbox"
                checked={isolatedRules}
                onChange={(e) => setIsolatedRules(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              Target flagged rules only ({detectedRules.length})
            </label>
          )}

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-200">
            <input
              type="checkbox"
              checked={includeSarif}
              onChange={(e) => setIncludeSarif(e.target.checked)}
              className="accent-emerald-500 rounded"
            />
            Export SARIF file
          </label>
        </div>
      </div>

      {/* Terminal Block */}
      <div className="flex items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 font-mono text-xs">
        <div className="flex items-center gap-2 overflow-x-auto text-emerald-300 whitespace-nowrap scrollbar-none">
          <span className="text-zinc-500 select-none">$</span>
          <span>{command}</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-medium transition"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Copy
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] text-zinc-500">
        Run this command inside your project root to run the identical checks locally before pushing.
      </p>
    </div>
  );
}
