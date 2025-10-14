import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Directus assets (staging - has images)
      {
        protocol: 'https',
        hostname: 'cms-stg.dewbob.com',
        port: '',
        pathname: '/assets/**',
      },
      // Directus dev (for reference)
      {
        protocol: 'https',
        hostname: 'cms-dev.dewbob.com',
        port: '',
        pathname: '/assets/**',
      },
      // TODO: Add production Directus hostname when deploying
      // {
      //   protocol: 'https',
      //   hostname: 'cms.dewbob.com',
      //   port: '',
      //   pathname: '/assets/**',
      // },

      // TEMPORARY: Legacy WordPress images during migration
      // Remove this once all images are migrated to Directus
      {
        protocol: 'https',
        hostname: 'public.dewbob.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
