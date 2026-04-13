/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: false,
  images: {
    unoptimized: true,
    domains: ["c.animaapp.com", "rewardsapi.hireagent.co"],
  },
};

export default nextConfig;
