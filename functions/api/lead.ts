// Cloudflare Pages Function: POST /api/lead
// Valida os campos e, se existir a env var LEAD_WEBHOOK_URL, repassa o lead em JSON.
// Sem a variavel, apenas valida e redireciona (o WhatsApp ja e o canal principal).

interface Env {
  LEAD_WEBHOOK_URL?: string;
}

const MAX = { nome: 80, telefone: 20, cidade: 60, servico: 80, mensagem: 1000 } as const;

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  const { request, env } = context;
  const url = new URL(request.url);
  const ajax = url.searchParams.get('ajax') === '1';
  const form = await request.formData();
  const get = (k: string) => String(form.get(k) ?? '').trim();

  // Honeypot: robo preenche. Responde como sucesso, sem enviar nada.
  if (get('website')) return ajax ? new Response(null, { status: 204 }) : Response.redirect(`${url.origin}/obrigado/`, 303);

  const lead = {
    nome: get('nome'),
    telefone: get('telefone'),
    cidade: get('cidade'),
    servico: get('servico'),
    mensagem: get('mensagem'),
  };

  const digits = lead.telefone.replace(/\D/g, '');
  const invalid =
    lead.nome.length < 2 ||
    digits.length < 10 ||
    digits.length > 13 ||
    !lead.cidade ||
    !lead.servico ||
    !lead.mensagem ||
    (Object.keys(MAX) as (keyof typeof MAX)[]).some((k) => lead[k].length > MAX[k]);

  if (invalid) return new Response('Dados inválidos. Volte e confira os campos.', { status: 400 });

  if (env.LEAD_WEBHOOK_URL) {
    try {
      await fetch(env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...lead, origem: url.origin, recebidoEm: new Date().toISOString() }),
      });
    } catch {
      // Falha do webhook nao deve bloquear o usuario.
    }
  }

  return ajax ? new Response(null, { status: 204 }) : Response.redirect(`${url.origin}/obrigado/`, 303);
};
