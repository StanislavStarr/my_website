import type {MetadataRoute} from 'next';
import {canIndex, getSiteOrigin} from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();
  
  return canIndex(origin)
    ? {rules: {userAgent: '*', allow: '/'}, sitemap: origin + '/sitemap.xml'}
    : {rules: {userAgent: '*', disallow: '/'}};
}
