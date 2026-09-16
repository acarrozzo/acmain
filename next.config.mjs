import { fileURLToPath } from "node:url";
import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // A stray pnpm lockfile in the home directory otherwise makes Next guess
  // the wrong workspace root.
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
  async redirects() {
    // The prototype's six destinations, mapped onto the three worlds.
    return [
      { source: "/product-design", destination: "/work", permanent: true },
      { source: "/worlds", destination: "/", permanent: true },
      { source: "/minimal", destination: "/", permanent: true },
      { source: "/starter-box", destination: "/games/starter-box", permanent: true },
      { source: "/music-lab", destination: "/music", permanent: true },
      { source: "/design-archive", destination: "/archive", permanent: true },
      { source: "/updates", destination: "/log", permanent: true },
    ];
  },
};

export default nextConfig;
