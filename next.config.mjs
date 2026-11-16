import {PHASE_PRODUCTION_SERVER} from 'next/constants.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  async redirects() {
    const origin = process.env.SITE_URL?.trim().replace(/\/$/, '');
    if (!origin || process.env.ENABLE_INDEXING !== 'true') return [];
    return [{
      source: '/:path*',
      has: [{type: 'host', value: 'stanislavstarr.vercel.app'}],
      destination: origin + '/:path*',
      permanent: true
    }];
  }
};

export default async function configure(phase) {
  if (phase === PHASE_PRODUCTION_SERVER) return nextConfig;
  const {default: createNextIntlPlugin} = await import('next-intl/plugin');
  return createNextIntlPlugin('./src/i18n/request.ts')(nextConfig);
}
