import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /** Large CSV uploads via server action (`importProfilesCsv`). Adjust if needed. */
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
