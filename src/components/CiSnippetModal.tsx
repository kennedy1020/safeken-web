'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, Shield, X, Code2 } from 'lucide-react';

interface CiSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEcosystem?: 'npm' | 'pypi';
}

export default function CiSnippetModal({
  isOpen,
  onClose,
  defaultEcosystem = 'npm',
}: CiSnippetModalProps) {
  const [ecosystem, setEcosystem] = useState<'npm' | 'pypi'>(defaultEcosystem);
  const [enableSarif, setEnableSarif] = useState(true);
  const [failOnFindings, setFailOnFindings] = useState(true);
  const [copiedYaml, setCopiedYaml] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false);

  if (!isOpen) return null;

  const yamlContent = `name: VibeShield Security Audit (${ecosystem.toUpperCase()})

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  audit:
    name: Run VibeShield Audit
    runs-on: ubuntu-latest
    permissions:
      contents: read
      ${enableSarif ? 'security-events: write # Required for GitHub Code Scanning SARIF tab' : ''}

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install Semgrep AST Engine
        run: pip install semgrep

      - name: Run SafeKen VibeShield
        uses: kennedy1020/vibe-shield@v1.1.2
        with:
          target-dir: '.'
          github-token: \${{ secrets.GITHUB_TOKEN }}
          sarif: '${enableSarif ? 'true' : 'false'}'
          fail-on-findings: '${failOnFindings ? 'true' : 'false'}'
${
  enableSarif
    ? `
      - name: Upload Findings to GitHub Security Tab
        if: always()
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: vibe-shield.sarif
`
    : ''
}`;

  const badgeMarkdown = `[![Protected by VibeShield](https://img.shields.io/badge/Security-VibeShield_v1.1.2-059669?style=flat&logo=githubactions&logoColor=white)](https://github.com/kennedy1020/vibe-shield)`;

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(yamlContent);
    setCopiedYaml(true);
    setTimeout(() => setCopiedYaml(false), 2000);
  };

  const handleCopyBadge = () => {
    navigator.clipboard.writeText(badgeMarkdown);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-zinc-100">
              Automate in CI/CD with GitHub Actions
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setEcosystem('npm')}
                className={`px-2 py-0.5 rounded transition ${
                  ecosystem === 'npm'
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                npm
              </button>
              <button
                onClick={() => setEcosystem('pypi')}
                className={`px-2 py-0.5 rounded transition ${
                  ecosystem === 'pypi'
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                PyPI
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Configuration Toggles */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label className="flex items-center gap-2 p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 cursor-pointer">
            <input
              type="checkbox"
              checked={enableSarif}
              onChange={(e) => setEnableSarif(e.target.checked)}
              className="accent-emerald-500 rounded"
            />
            <span className="text-zinc-300">Upload to GitHub Security Tab (SARIF)</span>
          </label>

          <label className="flex items-center gap-2 p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 cursor-pointer">
            <input
              type="checkbox"
              checked={failOnFindings}
              onChange={(e) => setFailOnFindings(e.target.checked)}
              className="accent-emerald-500 rounded"
            />
            <span className="text-zinc-300">Fail Pull Request on Critical Flaws</span>
          </label>
        </div>

        {/* Instructions */}
        <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 font-mono">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            Save as: <code className="text-zinc-200">.github/workflows/vibe-shield.yml</code>
          </span>
          <button
            onClick={handleCopyYaml}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition"
          >
            {copiedYaml ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied Workflow!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Workflow YAML
              </>
            )}
          </button>
        </div>

        {/* Code Snippet Box */}
        <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-900 p-3 max-h-56 overflow-y-auto font-mono text-[11px] text-zinc-300">
          <pre className="whitespace-pre-wrap">{yamlContent}</pre>
        </div>

        {/* Optional README Badge */}
        <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-zinc-400" />
            <span className="text-xs text-zinc-400">Add Shield badge to README:</span>
          </div>
          <button
            onClick={handleCopyBadge}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded border border-zinc-700 transition"
          >
            {copiedBadge ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" /> Copied Markdown
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Badge Code
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
