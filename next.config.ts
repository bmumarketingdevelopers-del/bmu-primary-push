import type { NextConfig } from "next";

/**
 * Security headers. `Content-Security-Policy` is deliberately absent — Razorpay
 * checkout and the Next dev overlay both need inline scripts, so a CSP added
 * without testing breaks payments. Add one once you're on a real domain and can
 * verify checkout still opens.
 */
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Camera is now self-allowed: the AR viewer needs it.
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Required for the Docker image. Harmless on Vercel.
  output: process.env.DOCKER_BUILD ? "standalone" : undefined,

  /**
   * Automatic memoization, stable since Next 16. Components stop re-rendering
   * when their props haven't changed, without a single useMemo or memo() call.
   * The admin tables and the appearance editor's live preview benefit most.
   */
  reactCompiler: true,

  images: {
    /**
     * Narrowed from the previous wildcard.
     *
     * `hostname: "**"` let any https host be proxied through the image
     * optimiser — meaning anyone could use your server, and your bandwidth
     * bill, to resize their own images. Next 16 tightened image security for
     * exactly this reason. Add a pattern when you add a media host.
     */
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "*.amazonaws.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  poweredByHeader: false,
  compress: true,

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Printed QR images are immutable once generated.
      {
        source: "/api/qr/:slug",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400" }],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/services/index", destination: "/services", permanent: true },
      { source: "/work", destination: "/case-studies", permanent: true },
      { source: "/blog", destination: "/resources", permanent: true },
      { source: "/blog/:slug", destination: "/resources/:slug", permanent: true },
    ];
  },
};

export default nextConfig;