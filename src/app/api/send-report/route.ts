import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { resend, DEFAULT_FROM_EMAIL, AUDIT_TEMPLATE_ID } from '@/lib/resend';

interface SendReportBody {
  to: string;
  ecosystem: string;
  statusLabel: string;
  totalFindings: number;
  scanLatencyMs: number;
  reportSummary: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SendReportBody;
    const recipient = body.to?.trim();

    if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      return NextResponse.json(
        { error: 'Please provide a valid recipient email address.' },
        { status: 400 }
      );
    }

    const ecosystem = body.ecosystem || 'AST Boundary Ruleset';
    const statusLabel = body.statusLabel || 'exit 0';
    const totalFindings = Number(body.totalFindings ?? 0);
    const scanLatencyMs = Number(body.scanLatencyMs ?? 0);
    const reportSummary =
      body.reportSummary || 'Zero AST or registry flaws detected (exit 0).';

    // Deterministic idempotency key per recipient + report content within a 1-minute window
    const minuteBucket = Math.floor(Date.now() / 60000);
    const hash = crypto
      .createHash('sha256')
      .update(`${recipient}:${ecosystem}:${statusLabel}:${reportSummary}:${minuteBucket}`)
      .digest('hex')
      .slice(0, 32);
    const idempotencyKey = `audit-report/${hash}`;

    const subject = `SafeKen VibeShield Audit: ${statusLabel} (${totalFindings} findings)`;

    // Send using hosted Resend Template if configured, otherwise fallback HTML
    const payload = AUDIT_TEMPLATE_ID
      ? {
          from: DEFAULT_FROM_EMAIL,
          to: [recipient],
          subject,
          template: {
            id: AUDIT_TEMPLATE_ID,
            variables: {
              ECOSYSTEM: ecosystem,
              STATUS_LABEL: statusLabel,
              TOTAL_FINDINGS: totalFindings,
              SCAN_LATENCY_MS: scanLatencyMs,
              REPORT_SUMMARY: reportSummary,
            },
          },
        }
      : {
          from: DEFAULT_FROM_EMAIL,
          to: [recipient],
          subject,
          html: `<div style="font-family: sans-serif; background: #111; color: #e4e4e7; padding: 24px; border-radius: 8px;">
            <h2 style="color: #fafafa; margin-top: 0;">SafeKen VibeShield Audit Report</h2>
            <p><strong>Engine:</strong> ${ecosystem} &bull; <strong>Status:</strong> ${statusLabel} &bull; <strong>Latency:</strong> ${scanLatencyMs}ms</p>
            <pre style="background: #18181b; padding: 12px; border-radius: 6px; color: #f4f4f5; white-space: pre-wrap;">${reportSummary}</pre>
          </div>`,
        };

    // Retry with exponential backoff on 429 or 5xx errors (never retry other 4xx errors)
    let lastError: { message: string; name?: string } | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data, error } = await resend.emails.send(payload, {
        idempotencyKey,
      });

      if (!error && data) {
        console.log(`[Resend] Audit report email sent: ${data.id}`);
        return NextResponse.json({
          id: data.id,
          idempotencyKey,
          usedTemplate: Boolean(AUDIT_TEMPLATE_ID),
        });
      }

      lastError = error;
      const errName = error?.name || '';
      const isRetryable =
        errName === 'rate_limit_exceeded' ||
        errName === 'application_error' ||
        errName === 'internal_server_error';

      if (!isRetryable) {
        break;
      }

      await new Promise((r) => setTimeout(r, 500 * Math.pow(2, attempt)));
    }

    return NextResponse.json(
      { error: lastError?.message || 'Failed to send audit report email.' },
      { status: 400 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error sending email';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

