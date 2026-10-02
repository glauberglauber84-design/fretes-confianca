import { siteConfig } from '../config/siteConfig';
import locais from '../data/locais.json';

export interface FaqItem {
  pergunta: string;
  resposta: string;
}
export interface PageContent {
  title: string;
  description: string;
  h1: string;
  hero_subtitle: string;
  sobre_texto: string;
  faq: FaqItem[];
}

// Conteudo da Maria (somente leitura). Se a pasta nao existir/estiver vazia, o glob retorna {}.
const modules = import.meta.glob('../data/pages/*.json', { eager: true }) as Record<
  string,
  { default?: Partial<PageContent> } & Partial<PageContent>
>;

const byKey = new Map<string, Partial<PageContent>>();
for (const [path, mod] of Object.entries(modules)) {
  const key = path.split('/').pop()!.replace(/\.json$/, '');
  byKey.set(key, (mod.default ?? mod) as Partial<PageContent>);
}

const fallbackPages: string[] = [];
const warnedFields: string[] = [];

export function getFallbackPages(): string[] {
  return fallbackPages;
}

const truncate = (s: string, n: number) => (s.length <= n ? s : s.slice(0, n - 1).trimEnd() + '…');

function buildFallback(servicoLabel: string, cidadeLabel: string): PageContent {
  const { name, phone } = siteConfig;
  return {
    title: truncate(`${servicoLabel} em ${cidadeLabel} | ${name}`, 60),
    description: truncate(
      `${servicoLabel} em ${cidadeLabel} e região. Peça orçamento pelo WhatsApp ${phone}.`,
      155,
    ),
    h1: `${servicoLabel} em ${cidadeLabel}`,
    hero_subtitle: `Atendimento em ${cidadeLabel} e região. Chame no WhatsApp, conte o que precisa e receba o orçamento.`,
    sobre_texto:
      `A ${name} atende ${cidadeLabel} e a Grande São Paulo com ${servicoLabel.toLowerCase()}. São ${siteConfig.foundingNote} de atuação na região, sempre buscando atender melhor cada cliente.\n\n` +
      `Para pedir orçamento, basta chamar no WhatsApp ${phone} e informar o que será transportado, os endereços de origem e destino e o melhor dia e horário.`,
    faq: [
      {
        pergunta: `Como peço orçamento de ${servicoLabel.toLowerCase()} em ${cidadeLabel}?`,
        resposta: `Chame no WhatsApp ${phone} e descreva o serviço. Com as informações, passamos o orçamento.`,
      },
      {
        pergunta: 'Quais regiões vocês atendem?',
        resposta: `Atendemos ${siteConfig.areaServed.join(', ')}.`,
      },
      {
        pergunta: 'O que preciso informar no pedido?',
        resposta:
          'Informe o que será transportado, o endereço de retirada e de entrega, as condições de acesso (escada, elevador) e a data desejada.',
      },
    ],
  };
}

/** Nunca quebra o build: usa o JSON da Maria, completa campos faltantes com o fallback. */
export function loadPageContent(servico: string, cidade: string, servicoLabel: string, cidadeLabel: string): PageContent {
  const key = `${servico}-${cidade}`;
  const fb = buildFallback(servicoLabel, cidadeLabel);
  const real = byKey.get(key);
  if (!real) {
    return fb;
  }
  const out: PageContent = { ...fb };
  const missing: string[] = [];
  (['title', 'description', 'h1', 'hero_subtitle', 'sobre_texto'] as const).forEach((f) => {
    const v = real[f];
    if (typeof v === 'string' && v.trim()) out[f] = v;
    else missing.push(f);
  });
  if (Array.isArray(real.faq) && real.faq.length > 0) out.faq = real.faq;
  else missing.push('faq');
  if (out.title.length > 60) warnedFields.push(`${key}: title > 60`);
  if (out.description.length > 155) warnedFields.push(`${key}: description > 155`);
  if (missing.length) warnedFields.push(`${key}: campos faltando (fallback usado): ${missing.join(', ')}`);
  if (warnedFields.length) console.warn(`[pageContent] ${warnedFields.pop()}`);
  return out;
}

// Aviso unico no build: lista paginas em fallback (conteudo da Maria ainda ausente).
for (const l of locais as { servico: string; cidade: string }[]) {
  const k = `${l.servico}-${l.cidade}`;
  if (!byKey.has(k)) fallbackPages.push(k);
}
if (fallbackPages.length) {
  console.warn(`[pageContent] ${fallbackPages.length} paginas em FALLBACK (sem JSON em src/data/pages): ${fallbackPages.join(", ")}`);
}
