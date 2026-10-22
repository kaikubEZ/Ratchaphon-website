import type { NextConfig } from "next";

// Security headers applied to every response. These address the only
// *validated* finding from the security scan: missing hardening headers.
// (The SQLi/XSS probes in that report came back UNVALIDATED — no exploit.)
const securityHeaders = [
  // Baseline content-security-policy. Allows the inline scripts/styles that
  // Next.js injects for hydration ('unsafe-inline') without a nonce, plus
  // data:/blob: for images, fonts and three.js workers. Tighten later with a
  // nonce-based policy via middleware if you want to drop 'unsafe-inline'.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  // Clickjacking protection. frame-ancestors above is the modern equivalent;
  // this covers older browsers.
  { key: "X-Frame-Options", value: "DENY" },
  // Stop MIME-type sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Limit referrer leakage to other origins.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable the legacy XSS auditor. Per current OWASP guidance this is set to
  // "0" rather than enabled, since the old filter could itself be abused.
  { key: "X-XSS-Protection", value: "0" },
  // Drop access to powerful browser features this site doesn't use.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
