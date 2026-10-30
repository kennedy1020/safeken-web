'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/Icons';

export default function CloudWaitlist() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({
          type: 'error',
          message: data.error || 'Could not register email. Please try again.',
        });
      } else {
        setStatus({
          type: 'success',
          message: `Registered ${data.email} for SafeKen Cloud early access.`,
        });
        setEmail('');
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Network error. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="cloud"
      className="py-20 border-t border-[var(--ks-rule)] bg-[var(--ks-paper)]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-[var(--ks-patina)]/50 bg-[var(--ks-paper-deep)] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-[var(--ks-patina)]/40 bg-[var(--ks-patina-pale)] text-[var(--ks-patina)] text-[11px] font-mono uppercase tracking-wider font-semibold">
                <Icon name="shield" size={12} />
                <span>SafeKen Cloud — Early Access</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--ks-ink)]">
                Automate SafeKen Across Your Entire Engineering Team
              </h2>

              <p className="text-sm sm:text-base text-[var(--ks-text-muted)] leading-relaxed">
                Continuous PR auditing, unverified webhook dynamic simulation, and centralized enterprise compliance dashboards.
              </p>
            </div>

            {/* Right Lead Capture Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter work email..."
                    aria-label="Enter work email"
                    className="flex-1 min-w-0 rounded-lg border border-[var(--ks-edge)] bg-[var(--ks-paper)] px-3.5 py-2.5 text-xs sm:text-sm text-[var(--ks-ink)] placeholder:text-[var(--ks-text-faint)] focus:outline-none focus:border-[var(--ks-patina)] font-mono"
                  />

                  <button
                    type="submit"
                    disabled={submitting || !email.trim()}
                    className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--ks-ink)] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[var(--ks-paper-deep)] hover:bg-white transition-colors disabled:opacity-50"
                  >
                    <span>{submitting ? 'Requesting...' : 'Request Cloud Access'}</span>
                    <Icon name="arrowRight" size={14} />
                  </button>
                </div>

                {status ? (
                  <div
                    className={`flex items-center gap-2 text-xs font-mono pt-1 ${
                      status.type === 'success'
                        ? 'text-[var(--ks-patina)]'
                        : 'text-[var(--ks-vermilion)]'
                    }`}
                  >
                    <Icon
                      name={status.type === 'success' ? 'check' : 'alert'}
                      size={14}
                    />
                    <span>{status.message}</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-[var(--ks-text-faint)] font-mono">
                    Zero spam. Priority onboarding for engineering and security teams.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

