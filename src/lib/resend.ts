import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export const DEFAULT_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || 'SafeKen VibeShield <onboarding@resend.dev>';

export const FOUNDER_NOTIFY_EMAIL =
  process.env.SAFEKEN_FOUNDER_EMAIL || '';

export const AUDIT_TEMPLATE_ID = process.env.RESEND_AUDIT_TEMPLATE_ID || '';

