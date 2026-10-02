/**
 * UNICA fonte de NAP e dados do negocio.
 * Nome pode ser trocado em 1 lugar (name / legalName).
 * Negocio de area de atendimento: NAO ha streetAddress, postalCode nem geo.
 */
export const siteConfig = {
  name: 'Frentes Confiança',
  legalName: 'Frentes Confiança',
  phone: '(11) 93932-9439',
  phoneE164: '+5511939329439',
  phoneHref: 'tel:+5511939329439',
  whatsappUrl: 'https://wa.me/5511939329439',
  region: 'Zona Leste, São Paulo — SP',
  locality: 'São Paulo',
  regionCode: 'SP',
  country: 'BR',
  areaServed: [
    'São Paulo (Zona Leste)',
    'Guarulhos',
    'Osasco',
    'Santo André',
    'São Bernardo do Campo',
  ],
  description:
    'Fretes e mudanças na Zona Leste de São Paulo, Guarulhos, Osasco, Santo André e São Bernardo do Campo. Mais de 10 anos de atendimento na Grande São Paulo.',
  foundingNote: 'mais de 10 anos',
  ogImage: '/og-default.jpg',
  mapEmbedUrl: 'https://www.google.com/maps?q=Zona+Leste+S%C3%A3o+Paulo&output=embed',
  services: [
    { slug: 'mudancas', label: 'Mudanças', short: 'Mudança residencial e comercial, com carga e descarga organizadas.' },
    { slug: 'fretes', label: 'Fretes', short: 'Frete avulso para móveis, eletrodomésticos e volumes diversos.' },
    { slug: 'transporte-entulho-limpeza-obra', label: 'Transporte de Entulho/Limpeza de Obra', short: 'Retirada de entulho e resíduos de reformas e obras.' },
    { slug: 'transporte-cargas', label: 'Transporte de Cargas', short: 'Cargas leves e médias dentro da Grande São Paulo.' },
    { slug: 'coleta-entulho-reciclaveis', label: 'Coleta de Entulho e Recicláveis', short: 'Coleta de entulho e materiais recicláveis para descarte correto.' },
    { slug: 'entregas-comerciais', label: 'Entregas Comerciais', short: 'Entregas para lojas, escritórios e pequenos negócios.' },
    { slug: 'transporte-equipamentos', label: 'Transporte de Equipamentos', short: 'Transporte de máquinas e equipamentos leves com cuidado.' },
    { slug: 'materiais-construcao-leves', label: 'Materiais de Construção Leves', short: 'Entrega de materiais de construção leves para obra ou reforma.' },
  ],
  cities: [
    { slug: 'sao-paulo', label: 'São Paulo', name: 'São Paulo (Zona Leste)' },
    { slug: 'guarulhos', label: 'Guarulhos', name: 'Guarulhos' },
    { slug: 'osasco', label: 'Osasco', name: 'Osasco' },
    { slug: 'santo-andre', label: 'Santo André', name: 'Santo André' },
    { slug: 'sao-bernardo-do-campo', label: 'São Bernardo do Campo', name: 'São Bernardo do Campo' },
  ],
  nav: [
    { href: '/', label: 'Início' },
    { href: '/servicos/', label: 'Serviços' },
    { href: '/sobre/', label: 'Sobre' },
    { href: '/contato/', label: 'Contato' },
  ],
} as const;

export type Service = (typeof siteConfig.services)[number];
export type City = (typeof siteConfig.cities)[number];

export const whatsappLink = (text?: string): string =>
  text ? `${siteConfig.whatsappUrl}?text=${encodeURIComponent(text)}` : siteConfig.whatsappUrl;
