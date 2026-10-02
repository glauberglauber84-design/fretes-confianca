import type { APIRoute } from 'astro';

// Dinamico: o dominio final ainda sera definido (SITE_URL), entao o Sitemap sai de astro.config.
export const GET: APIRoute = ({ site }) => {
  const base = (site?.href ?? '').replace(/\/+$/, '');
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap-index.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
