/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@scolyra/ai", "@scolyra/db", "@scolyra/ui"],
};

module.exports = nextConfig;
