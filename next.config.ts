import type { NextConfig } from "next";

/** Keep config minimal: explicit `turbopack.root` can mis-resolve in some setups and break dev. */
const nextConfig: NextConfig = {
  images: {
    /** Avoid `/_next/image` 500s when the optimizer (e.g. sharp) is unavailable on the host. */
    unoptimized: true,
  },
};

export default nextConfig;
