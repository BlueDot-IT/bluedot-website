import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  outputFileTracingRoot: process.cwd(),
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  allowedDevOrigins: ["172.235.158.51"],
  poweredByHeader: false,
  experimental: {
    serverActions: { allowedOrigins: ["bluedot.it.com", "www.bluedot.it.com"] },
    esmExternals: "loose",
    cpus: 1,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/spatial/index.html" },
        ...["work", "process"].map((page) => ({
          source: `/${page}`, destination: `/spatial/${page}.html`,
        })),
        { source: "/spatial-documents.css", destination: "/spatial/documents.css" },
        { source: "/spatial-contact.js", destination: "/spatial/contact.js" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: "/resume.pdf",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      {
        source: "/login",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      {
        source: "/resume",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      {
        source: "/contact/thank-you",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      {
        source: "/.well-known/bluedot-disclosure-public-key.asc",
        headers: [
          { key: "Content-Type", value: "application/pgp-keys" },
          { key: "Content-Disposition", value: "inline" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/projects", destination: "/work", permanent: true },
      ...["services", "research", "about", "contact"].map((page) => ({
        source: `/${page}`, destination: `/#${page}`, permanent: false,
      })),
      ...["services", "work", "about", "process", "contact", "research"].map((page) => ({
        source: `/${page}.html`, destination: `/${page}`, permanent: true,
      })),
      {
        source: "/security.txt",
        destination: "/.well-known/security.txt",
        permanent: true,
      },
      {
        source: "/resume.pdf",
        destination: "/about",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
