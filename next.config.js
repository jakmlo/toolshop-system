/** @type {import('next').NextConfig} */

const cspHeader = `
    default-src 'self' files.edgestore.dev edge-store.s3.us-east-1.amazonaws.com;
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' files.edgestore.dev lh3.googleusercontent.com blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;

const nextConfig = {
  // output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
        port: "",
        pathname: "/*/publicFiles/_public/*",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)?",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Permissions-Policy",
            value:
              "accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=(), fullscreen=(), magnetometer=(), sync-xhr=()",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
