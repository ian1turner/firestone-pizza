import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Directory that contains this config file (the real Next app root). */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid mis-inferred root (e.g. `.../Pizza app/app`) so `next` resolves correctly.
    root: projectRoot,
  },
};

export default nextConfig;
