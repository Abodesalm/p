/** @type {import('next'.NextConfig)} */
const nextConfig = {
  images: {
    domains: ["127.0.0.1", "zed-games-api.onrender.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
