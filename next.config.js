const nextConfig = {
  eslint: {
      ignoreDuringBuilds: true,
  },
  typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
  },
  // swcMinify: false,
};

module.exports = nextConfig;