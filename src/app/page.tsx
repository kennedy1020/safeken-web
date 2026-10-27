import Playground from '@/components/Playground';
import { Shield, Terminal, Check, ExternalLink } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      {/* Header */}
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
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight">
          Don&apos;t deploy AI-generated vulnerabilities.
        </h1>
        <p className="mt-6 text-lg text-zinc-400 max-w-2xl leading-relaxed">
          The open-source security engine for modern full-stack workflows. Catches slopsquatting, client secret leaks, and unverified payment webhooks before production.
        </p>

        {/* CLI Terminal Pill */}
        <div className="mt-8 flex items-center gap-3 px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-sm shadow-xl">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-zinc-200">npx @kennedy1020/vibe-shield scan .</span>
        </div>

        {/* Interactive Sandbox */}
        <div className="mt-16 w-full text-left">
          <Playground />
        </div>
      </section>

      {/* Comparison Grid: Why SAST beats DAST URL Scanners */}
      <section className="py-20 border-t border-zinc-900 bg-zinc-950 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-12">
            Why Source-Code Audits Outperform Black-Box URL Scanners
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40">
              <h3 className="font-semibold text-lg text-zinc-200 mb-2">Hosted URL Scanners (DAST)</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Wait until your app is already deployed to crawl headers and client bundles.
              </p>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li className="flex items-center gap-2">❌ Blind to server actions and backend logic</li>
                <li className="flex items-center gap-2">❌ Cannot audit dependencies or slopsquatting</li>
                <li className="flex items-center gap-2">❌ Misses unverified Paystack / Stripe webhooks</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-emerald-900/50 bg-emerald-950/10">
              <h3 className="font-semibold text-lg text-emerald-400 mb-2">SafeKen VibeShield (SAST + Registry)</h3>
              <p className="text-sm text-zinc-300 mb-4">
                Runs directly in your terminal, pre-commit hook, or GitHub Actions workflow.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Direct AST inspection of Next.js routes &amp; Prisma queries</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Registry HEAD checks for npm and PyPI hallucinated packages</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Free, open-source, and verified with Sigstore provenance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 px-6 text-center text-xs text-zinc-500">
        <p>Built by Kennedy Adongo · SafeKen Security Labs · MIT Licensed</p>
      </footer>
    </main>
  );
}
