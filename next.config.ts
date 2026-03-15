import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: false,
  outputFileTracingIncludes: {
    "/**/*": ["./src/content/**/*.mdx"],
  },
};

export default nextConfig;
