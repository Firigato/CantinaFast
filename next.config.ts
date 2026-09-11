import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Vinext reads this file to enable static export. GitHub Pages asset URLs are
  // configured through Vite because basePath would also nest the output files.
  output: 'export',
};

export default nextConfig;
