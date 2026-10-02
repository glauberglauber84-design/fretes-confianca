import { siteConfig } from '../config/siteConfig';
import type { FaqItem } from './pageContent';

type Json = Record<string, unknown>;

const strip = (s: string) => s.replace(/\/+$/, '');
export const absUrl = (site: string, path: string) => strip(site) + (path.startsWith('/') ? path : `/${path}`);
export const businessId = (site: string) => `${strip(site)}/#negocio`;

const city = (name: string): Json => ({ '@type': 'City', name });

export function webSite(site: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${strip(site)}/#website`,
    name: siteConfig.name,
    url: `${strip(site)}/`,
    inLanguage: 'pt-BR',
  };
}

/** Area de atendimento: sem streetAddress/postalCode/geo (nao inventar). */
export function localBusiness(site: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'MovingCompany'],
    '@id': businessId(site),
    name: siteConfig.name,
    url: `${strip(site)}/`,
    telephone: siteConfig.phoneE164,
    description: siteConfig.description,
    image: absUrl(site, siteConfig.ogImage),
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.locality,
      addressRegion: siteConfig.regionCode,
      addressCountry: siteConfig.country,
    },
    areaServed: siteConfig.areaServed.map(city),
    makesOffer: siteConfig.services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.label },
    })),
  };
}

export function service(site: string, opts: { name: string; path: string; areaServed: string[]; description?: string }): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: opts.name,
    name: opts.name,
    url: absUrl(site, opts.path),
    ...(opts.description ? { description: opts.description } : {}),
    provider: { '@id': businessId(site) },
    areaServed: opts.areaServed.map(city),
  };
}

export function faqPage(items: FaqItem[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: i.resposta },
    })),
  };
}

export function breadcrumbList(site: string, items: { name: string; path: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absUrl(site, it.path),
    })),
  };
}

export function itemList(site: string, items: { name: string; path: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: absUrl(site, it.path),
    })),
  };
}

export function webPage(site: string, opts: { type?: 'WebPage' | 'ContactPage' | 'AboutPage'; name: string; path: string; description: string }): Json {
  return {
    '@context': 'https://schema.org',
    '@type': opts.type ?? 'WebPage',
    name: opts.name,
    url: absUrl(site, opts.path),
    description: opts.description,
    inLanguage: 'pt-BR',
    isPartOf: { '@id': `${strip(site)}/#website` },
    about: { '@id': businessId(site) },
  };
}

export function blogPosting(site: string, opts: { title: string; description: string; path: string }): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    url: absUrl(site, opts.path),
    mainEntityOfPage: absUrl(site, opts.path),
    inLanguage: 'pt-BR',
    image: absUrl(site, siteConfig.ogImage),
    author: { '@id': businessId(site) },
    publisher: { '@id': businessId(site) },
  };
}
