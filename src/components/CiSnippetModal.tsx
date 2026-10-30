'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/Icons';
import { downloadFile } from '@/lib/exportReports';

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

  useEffect(() => {
    setEcosystem(defaultEcosystem);
  }, [defaultEcosystem, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const yamlContent = `name: SafeKen VibeShield Security Audit (${ecosystem.toUpperCase()})

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
        uses: kennedy1020/vibe-shield@v1.1.3
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

  const badgeMarkdown = `[![Protected by VibeShield](https://img.shields.io/badge/Security-SafeKen_VibeShield-0d9488?style=flat&logo=githubactions&logoColor=white)](https://github.com/kennedy1020/vibe-shield)`;

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(yamlContent);
    setCopiedYaml(true);
    setTimeout(() => setCopiedYaml(false), 2000);
  };

  const handleDownloadYaml = () => {
    downloadFile(yamlContent, 'vibe-shield.yml', 'text/yaml');
  };

  const handleCopyBadge = () => {
    navigator.clipboard.writeText(badgeMarkdown);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ci-modal-title"
    >
      <div
        className="w-full max-w-2xl rounded-lg border border-[var(--ks-edge)] bg-[var(--ks-paper)] p-6 shadow-2xl relative text-[var(--ks-text)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--ks-rule)]">
          <div className="flex items-center gap-2.5">
            <Icon name="shield" size={17} className="text-[var(--ks-patina)]" />
            <h3 id="ci-modal-title" className="text-base font-semibold text-[var(--ks-ink)]">
              GitHub Actions CI/CD Integration
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[var(--ks-paper-deep)] border border-[var(--ks-rule)] rounded p-0.5 text-xs">
              <button
                onClick={() => setEcosystem('npm')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  ecosystem === 'npm'
                    ? 'bg-[var(--ks-paper-raised)] text-[var(--ks-ink)] font-semibold'
                    : 'text-[var(--ks-text-muted)] hover:text-[var(--ks-ink)]'
                }`}
              >
                npm
              </button>
              <button
                onClick={() => setEcosystem('pypi')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  ecosystem === 'pypi'
                    ? 'bg-[var(--ks-paper-raised)] text-[var(--ks-ink)] font-semibold'
                    : 'text-[var(--ks-text-muted)] hover:text-[var(--ks-ink)]'
                }`}
              >
                PyPI
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-[var(--ks-text-muted)] hover:text-[var(--ks-ink)] p-1 rounded transition-colors"
              aria-label="Close dialog"
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        </div>

        {/* Configuration Toggles */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label className="flex items-center gap-2 p-3 rounded border border-[var(--ks-rule)] bg-[var(--ks-paper-raised)] cursor-pointer">
            <input
              type="checkbox"
              checked={enableSarif}
              onChange={(e) => setEnableSarif(e.target.checked)}
              className="accent-[var(--ks-patina)] rounded"
            />
            <span className="text-[var(--ks-ink)]">Upload to GitHub Security Tab (SARIF)</span>
          </label>

          <label className="flex items-center gap-2 p-3 rounded border border-[var(--ks-rule)] bg-[var(--ks-paper-raised)] cursor-pointer">
            <input
              type="checkbox"
              checked={failOnFindings}
              onChange={(e) => setFailOnFindings(e.target.checked)}
              className="accent-[var(--ks-patina)] rounded"
            />
            <span className="text-[var(--ks-ink)]">Fail PR on Critical Flaws (Exit 1)</span>
          </label>
        </div>

        {/* Instructions */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--ks-text-muted)]">
          <span className="font-mono text-[11px] text-[var(--ks-text)]">
            File path: <code className="text-[var(--ks-ink)]">.github/workflows/vibe-shield.yml</code>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadYaml}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[var(--ks-edge)] bg-[var(--ks-paper-raised)] text-[var(--ks-text)] hover:text-[var(--ks-ink)] transition-colors text-xs"
            >
              <Icon name="download" size={13} />
              <span>Download .yml</span>
            </button>
            <button
              onClick={handleCopyYaml}
              className="flex items-center gap-1.5 px-3 py-1 bg-[var(--ks-ink)] text-[var(--ks-paper-deep)] rounded text-xs font-semibold hover:bg-white transition-colors"
            >
              <Icon name={copiedYaml ? 'check' : 'copy'} size={13} />
              <span>{copiedYaml ? 'Copied Workflow' : 'Copy Workflow YAML'}</span>
            </button>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="mt-2 rounded border border-[var(--ks-edge)] bg-[var(--ks-paper-deep)] p-3 max-h-52 overflow-y-auto font-mono text-[11px] text-[var(--ks-text)]">
          <pre className="whitespace-pre-wrap">{yamlContent}</pre>
        </div>

        {/* Optional README Badge */}
        <div className="mt-4 pt-4 border-t border-[var(--ks-rule)] flex items-center justify-between text-xs">
          <span className="text-[var(--ks-text-muted)]">Add verification badge to repository README:</span>
          <button
            onClick={handleCopyBadge}
            className="flex items-center gap-1 px-2.5 py-1 rounded border border-[var(--ks-rule)] bg-[var(--ks-paper-raised)] text-[var(--ks-text)] hover:text-[var(--ks-ink)] hover:border-[var(--ks-edge)] transition-colors text-[11px]"
          >
            <Icon name={copiedBadge ? 'check' : 'copy'} size={12} />
            <span>{copiedBadge ? 'Copied Badge Markdown' : 'Copy Badge Markdown'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
