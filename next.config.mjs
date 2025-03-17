/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "felts.xyz",
        port: "", // Leave empty unless a specific port is required
        pathname: "/**", // Use `/path/*` to specify a path or `/**` to allow all paths
      },
    ],
  },
};

export default nextConfig;
