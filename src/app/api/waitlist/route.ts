import { NextRequest, NextResponse } from 'next/server';
import { resend, DEFAULT_FROM_EMAIL, FOUNDER_NOTIFY_EMAIL } from '@/lib/resend';
import { redis } from '@/lib/redis';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawEmail = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!rawEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid work email address.' },
        { status: 400 }
      );
    }

    const domain = rawEmail.split('@')[1] || 'unknown';
    const timestamp = new Date().toISOString();

    // 1. Persist lead in Redis store (safeken:cloud:waitlist + safeken:cloud:leads)
    let storedInDb = false;
    try {
      const pipeline = redis.pipeline();
      pipeline.sadd('safeken:cloud:waitlist', rawEmail);
      pipeline.hset('safeken:cloud:leads', {
        [rawEmail]: JSON.stringify({
          email: rawEmail,
          domain,
          source: 'safeken-cloud-waitlist',
          requestedAt: timestamp,
        }),
      });
      await pipeline.exec();
      storedInDb = true;
    } catch {
      // Fallback if Redis is unreachable
    }

    // 2. Add to Resend Contacts / Mailing List (if using a full-access key)
    let contactId: string | null = null;
    try {
      const { data: contactData, error: contactError } = await resend.contacts.create({
        email: rawEmail,
        unsubscribed: false,
      });
      if (!contactError && contactData?.id) {
        contactId = contactData.id;
      }
    } catch {
      // Ignore if key is restricted to sending_access only
    }

    // 3. Send Automated Welcome Email to the User + Lead Alert to Your Personal Email
    let welcomeEmailId: string | null = null;
    let founderAlertEmailId: string | null = null;

    // 3a. Automated Welcome Email to the new signup
    const welcomePromise = resend.emails.send(
      {
        from: DEFAULT_FROM_EMAIL,
        to: [rawEmail],
        subject: 'SafeKen Cloud — Early Access Request Confirmed',
        html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #111111; color: #e4e4e7; padding: 32px; border-radius: 8px; max-width: 580px; margin: 0 auto; border: 1px solid #27272a;">
  <span style="color: #5eead4; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em;">SafeKen Cloud Enterprise</span>
  <h1 style="color: #fafafa; font-size: 20px; margin: 8px 0 12px 0;">You're on the SafeKen Cloud Early-Access List</h1>
  <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 16px 0;">
    We registered <strong style="color: #fafafa; font-family: monospace;">${rawEmail}</strong> for early access to SafeKen Cloud:
  </p>
  <ul style="font-size: 13px; line-height: 1.7; color: #d4d4d8; padding-left: 20px; margin: 0 0 20px 0;">
    <li>Continuous GitHub PR AST &amp; slopsquatting enforcement</li>
    <li>Dynamic unverified payment webhook simulation</li>
    <li>Centralized enterprise SARIF &amp; SOC2 compliance dashboards</li>
  </ul>
  <p style="font-size: 13px; color: #a1a1aa; line-height: 1.5; margin: 0;">
    While we prepare your organization invite, you can enforce deterministic checks in CI/CD today:<br />
    <code style="display: inline-block; margin-top: 8px; padding: 6px 10px; background: #09090b; border: 1px solid #27272a; border-radius: 4px; color: #5eead4; font-family: monospace;">npx @kennedy1020/vibe-shield scan .</code>
  </p>
</div>`,
      },
      {
        idempotencyKey: `cloud-waitlist-welcome/${rawEmail}`,
      }
    );

    // 3b. Instant Lead Notification Email to your personal email (if SAFEKEN_FOUNDER_EMAIL is set)
    const founderNotifyPromise = FOUNDER_NOTIFY_EMAIL
      ? resend.emails.send(
          {
            from: DEFAULT_FROM_EMAIL,
            to: [FOUNDER_NOTIFY_EMAIL],
            replyTo: rawEmail,
            subject: `🚀 New SafeKen Cloud Lead: ${rawEmail} (${domain})`,
            html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #111111; color: #e4e4e7; padding: 28px; border-radius: 8px; max-width: 540px; border: 1px solid #27272a;">
  <span style="color: #5eead4; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em;">New Enterprise Waitlist Signup</span>
  <h2 style="color: #fafafa; font-size: 18px; margin: 8px 0 16px 0;">${rawEmail} requested SafeKen Cloud access</h2>
  <table style="width: 100%; border-collapse: collapse; font-size: 13px; font-family: monospace;">
    <tr>
      <td style="padding: 8px 0; color: #a1a1aa; border-bottom: 1px solid #27272a;">Work Email</td>
      <td style="padding: 8px 0; color: #fafafa; border-bottom: 1px solid #27272a;">${rawEmail}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #a1a1aa; border-bottom: 1px solid #27272a;">Company Domain</td>
      <td style="padding: 8px 0; color: #5eead4; border-bottom: 1px solid #27272a;">${domain}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #a1a1aa;">Timestamp (UTC)</td>
      <td style="padding: 8px 0; color: #fafafa;">${timestamp}</td>
    </tr>
  </table>
  <p style="font-size: 12px; color: #71717a; margin: 16px 0 0 0;">
    Tip: Hit <strong>Reply</strong> in your email client to respond directly to ${rawEmail}.
  </p>
</div>`,
          },
          {
            idempotencyKey: `cloud-waitlist-notify/${rawEmail}`,
          }
        )
      : Promise.resolve({ data: null, error: null });

    const [welcomeRes, founderRes] = await Promise.allSettled([
      welcomePromise,
      founderNotifyPromise,
    ]);

    if (welcomeRes.status === 'fulfilled' && welcomeRes.value.data?.id) {
      welcomeEmailId = welcomeRes.value.data.id;
    }
    if (founderRes.status === 'fulfilled' && founderRes.value.data?.id) {
      founderAlertEmailId = founderRes.value.data.id;
    }

    return NextResponse.json({
      success: true,
      email: rawEmail,
      storedInDb,
      contactId,
      welcomeEmailId,
      founderAlertEmailId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unable to process waitlist request.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
