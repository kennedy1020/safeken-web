import { NextRequest, NextResponse } from 'next/server';

interface AuditFinding {
  ruleId: string;
  severity: 'CRITICAL' | 'HIGH' | 'WARN';
  title: string;
  description: string;
  suggestedFix: string;
}

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code snippet is required' }, { status: 400 });
    }

    const findings: AuditFinding[] = [];
    const isClientComponent = /['"]use client['"]/.test(code);

    // 1. Paystack Webhook without HMAC SHA-512 verification
    if (
      code.includes('paystack') ||
      code.includes('x-paystack-signature') ||
      code.includes('charge.success')
    ) {
      const hasSignatureCheck =
        code.includes('x-paystack-signature') &&
        (code.includes('sha512') || code.includes('createHmac'));

      if (!hasSignatureCheck) {
        findings.push({
          ruleId: 'nextjs-paystack-unsigned-webhook',
          severity: 'HIGH',
          title: 'Unverified Paystack Webhook Handler',
          description:
            'Processing payment events without computing an HMAC SHA-512 hash against your secret key allows attackers to spoof charge.success events and steal fulfillment credits.',
          suggestedFix: `import crypto from 'node:crypto';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-paystack-signature');
  const secret = process.env.PAYSTACK_SECRET_KEY!;

  const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
  if (hash !== signature) {
    return new Response('Invalid webhook signature', { status: 401 });
  }

  const event = JSON.parse(body);
  // Safely handle event.data...
  return new Response('OK');
}`,
        });
      }
    }

    // 2. Stripe Webhook without constructEvent
    if (code.includes('stripe') && (code.includes('/api/webhook') || code.includes('POST'))) {
      const hasConstructEvent = code.includes('constructEvent');
      if (!hasConstructEvent) {
        findings.push({
          ruleId: 'nextjs-stripe-unsigned-webhook',
          severity: 'HIGH',
          title: 'Unsigned Stripe Webhook',
          description:
            'Parsing Stripe webhook JSON directly without stripe.webhooks.constructEvent allows unauthorized parties to forge checkout completions.',
          suggestedFix: `import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    // Process verified event...
    return new Response('OK');
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown webhook error';
    return new Response(\`Webhook Error: \${errorMsg}\`, { status: 400 });
  }
}`,
        });
      }
    }

    // 3. Supabase Service Role Key in 'use client'
    if (
      isClientComponent &&
      (code.includes('SUPABASE_SERVICE_ROLE_KEY') ||
        code.includes('service_role') ||
        code.includes('SUPABASE_ADMIN_KEY'))
    ) {
      findings.push({
        ruleId: 'nextjs-supabase-service-role-client',
        severity: 'CRITICAL',
        title: 'Supabase Service Key in Client Component',
        description:
          'Supabase service_role keys bypass Row Level Security (RLS). Importing or using this key in a file with "use client" bakes full database admin privileges directly into the public JavaScript bundle.',
        suggestedFix: `'use client';
import { createBrowserClient } from '@supabase/ssr';

// Safe: anon key is strictly restricted by Row Level Security (RLS) policies
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);`,
      });
    }

    // 4. NEXT_PUBLIC_ Secret Bleeds
    const secretBleedRegex = /NEXT_PUBLIC_[A-Z0-9_]*(SECRET|PRIVATE|SERVICE_ROLE|ADMIN_KEY)/i;
    if (secretBleedRegex.test(code)) {
      findings.push({
        ruleId: 'nextjs-public-secret-bleed',
        severity: 'CRITICAL',
        title: 'Private Secret Exposed with NEXT_PUBLIC_ Prefix',
        description:
          'Any environment variable prefixed with NEXT_PUBLIC_ is inlined into the client-side JavaScript sent to every visitor browser.',
        suggestedFix: `// Access private backend credentials exclusively inside Server Components, 
// Route Handlers (/app/api), or Server Actions without the NEXT_PUBLIC_ prefix:
const secretKey = process.env.STRIPE_SECRET_KEY; // Safe on server`,
      });
    }

    // 5. Hardcoded Live Payment Secret Keys
    const liveKeyRegex = /['"](sk_live_[a-zA-Z0-9]{20,}|pk_live_[a-zA-Z0-9]{20,})['"]/;
    if (liveKeyRegex.test(code)) {
      findings.push({
        ruleId: 'hardcoded-payment-live-secret',
        severity: 'CRITICAL',
        title: 'Hardcoded Production Secret Committed to Code',
        description:
          'A live production payment token was found directly in the code body. Secrets must always be loaded via server-side environment variables.',
        suggestedFix: `// Load production credentials from environment variables:
const paymentKey = process.env.PAYMENT_SECRET_KEY;`,
      });
    }

    return NextResponse.json({
      findings,
      scannedLines: code.split('\n').length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Audit failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
