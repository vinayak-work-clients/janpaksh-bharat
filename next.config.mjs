/** @type {import('next').NextConfig} */

// Supabase Storage public URLs: next/image needs the project host allow-listed.
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null;
  } catch {
    return null;
  }
})();
const supabaseOrigin = supabaseHost ? `https://${supabaseHost}` : "https://*.supabase.co";

/**
 * Content-Security-Policy, report-only for now so nothing breaks silently in
 * production. Tighten to enforcing once the report log is clean.
 */
const csp = [
  "default-src 'self'",
  // Next.js inline runtime + JSON-LD; Vercel analytics/speed insights.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vercel.live",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  `img-src 'self' data: blob: ${supabaseOrigin} https://*.supabase.co https://images.unsplash.com https://i.ytimg.com https://commondatastorage.googleapis.com`,
  `media-src 'self' blob: ${supabaseOrigin} https://*.supabase.co https://commondatastorage.googleapis.com https://videos.pexels.com`,
  `connect-src 'self' ${supabaseOrigin} https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com https://va.vercel-scripts.com https://vercel.live`,
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://open.spotify.com https://www.instagram.com https://www.facebook.com https://vercel.live",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Content-Security-Policy-Report-Only", value: csp },
];

const nextConfig = {
  poweredByHeader: false,
  experimental: {
    // The OG image routes read public/fonts/*.ttf from disk at runtime.
    outputFileTracingIncludes: { "/**/*": ["./public/fonts/*.ttf"] },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "videos.pexels.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      // Any Supabase project host, so a preview/staging project also works.
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      ...(supabaseHost && !supabaseHost.endsWith(".supabase.co")
        ? [{ protocol: "https", hostname: supabaseHost }]
        : []),
    ],
  },
  async headers() {
    return [
      // Public pages may only be framed by the site itself.
      { source: "/((?!admin).*)", headers: [...securityHeaders, { key: "X-Frame-Options", value: "SAMEORIGIN" }] },
      // The dashboard is never framed and never indexed.
      { source: "/admin/:path*", headers: [...securityHeaders, { key: "X-Frame-Options", value: "DENY" }, { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] },
      { source: "/admin", headers: [...securityHeaders, { key: "X-Frame-Options", value: "DENY" }, { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] },
    ];
  },
};

export default nextConfig;
