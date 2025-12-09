import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: true,
      minify: true,
    },
  },
};

export default nextConfig;
