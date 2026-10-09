/** @type {import('next').NextConfig} */
const backendUrl = process.env.BACKEND_URL;

const nextConfig = {
  reactStrictMode: true,
  // If an external backend is specified, proxy API requests to it;
  // otherwise, the built-in Next.js serverless route handlers in src/app/api/backend/ handle them natively.
  async rewrites() {
    if (backendUrl) {
      return [
        {
          source: '/api/backend/:path*',
          destination: `${backendUrl.replace(/\/$/, '')}/api/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
