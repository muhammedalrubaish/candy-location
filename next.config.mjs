/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.files.salla.network",
      },
      {
        protocol: "https",
        hostname: "cdn.assets.salla.network",
      }
    ],
  },
};

export default nextConfig;

