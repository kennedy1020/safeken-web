import type { Metadata } from "next";
import { Albert_Sans } from "next/font/google";
import "./globals.css";

const albertSans = Albert_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-albert-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SafeKen VibeShield — Deterministic Security for AI Codebases",
  description:
    "Detect AI dependency hallucinations, slopsquatting, and client-side credential bleeds before production. Mathematical AST proof with zero API tokens.",
  openGraph: {
    title: "SafeKen VibeShield",
    description:
      "Deterministic AST security auditor for Next.js, Supabase, and payment stacks.",
    url: "https://safeken-web.vercel.app",
    siteName: "SafeKen VibeShield",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SafeKen VibeShield",
    description: "Audit hallucinated dependencies and AST vulnerabilities in seconds.",
    creator: "@kennedy1020",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={albertSans.variable}>
      <body className="bg-[var(--ks-paper-deep)] text-[var(--ks-text)] antialiased font-sans selection:bg-[var(--ks-patina-pale)] selection:text-[var(--ks-ink)]">
        {children}
      </body>
    </html>
  );
}
