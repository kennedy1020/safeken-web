import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SafeKen VibeShield — AI Code Security & Slopsquatting Auditor",
  description: "Detect AI-hallucinated packages, client-side secret bleeds, and unverified payment webhooks before production.",
  openGraph: {
    title: "SafeKen VibeShield",
    description: "Zero-config security auditor for Next.js, Supabase, and payment stacks.",
    url: "https://safeken-web.vercel.app",
    siteName: "SafeKen Security",
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
    <html lang="en">
      <body className="bg-black text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
