import {PHASE_PRODUCTION_SERVER} from 'next/constants.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true
};

export default async function configure(phase) {
  // next-intl's compiler plugin is only needed during development/build.
  // A production server serves the already compiled application.
  if (phase === PHASE_PRODUCTION_SERVER) return nextConfig;
  const {default: createNextIntlPlugin} = await import('next-intl/plugin');
  return createNextIntlPlugin('./src/i18n/request.ts')(nextConfig);
}
