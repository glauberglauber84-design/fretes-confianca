import locais from '../data/locais.json';
import { siteConfig } from '../config/siteConfig';

export interface Local {
  servico: string;
  servicoLabel: string;
  cidade: string;
  cidadeLabel: string;
  estado: string;
  principal: boolean;
  servicoPrincipal: boolean;
}

export const getLocais = (): Local[] => locais as Local[];

/** Servicos unicos (na ordem de locais.json). */
export function getServicos(): { slug: string; label: string; principal: boolean }[] {
  const seen = new Map<string, { slug: string; label: string; principal: boolean }>();
  for (const l of getLocais()) {
    if (!seen.has(l.servico)) {
      seen.set(l.servico, { slug: l.servico, label: l.servicoLabel, principal: l.servicoPrincipal });
    }
  }
  return [...seen.values()];
}

/** Cidades unicas (principal primeiro). */
export function getCidades(): { slug: string; label: string; principal: boolean }[] {
  const seen = new Map<string, { slug: string; label: string; principal: boolean }>();
  for (const l of getLocais()) {
    if (!seen.has(l.cidade)) {
      seen.set(l.cidade, { slug: l.cidade, label: l.cidadeLabel, principal: l.principal });
    }
  }
  return [...seen.values()].sort((a, b) => Number(b.principal) - Number(a.principal));
}

export const getPair = (servico: string, cidade: string): Local | undefined =>
  getLocais().find((l) => l.servico === servico && l.cidade === cidade);

// Sanidade: siteConfig e locais.json precisam concordar (falha o build se divergirem).
const cfgServ = siteConfig.services.map((s) => s.slug).sort().join(',');
const jsonServ = getServicos().map((s) => s.slug).sort().join(',');
const cfgCid = siteConfig.cities.map((s) => s.slug).sort().join(',');
const jsonCid = getCidades().map((s) => s.slug).sort().join(',');
if (cfgServ !== jsonServ || cfgCid !== jsonCid) {
  throw new Error('siteConfig (services/cities) diverge de src/data/locais.json');
}
