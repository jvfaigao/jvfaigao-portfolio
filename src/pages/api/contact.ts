import type { APIRoute } from 'astro';
import { isRateLimited, sendMail, validateContact } from '../../lib/contact';

export const prerender = false;

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  const isJson = (request.headers.get('content-type') ?? '').includes('application/json');
  const dryRun = Boolean(process.env.CONTACT_DRY_RUN);

  // Without JS the browser posts the form; answer with a result page instead of JSON.
  const reply = (status: 'sent' | 'invalid' | 'limited' | 'error', code: number, body: Record<string, unknown> = {}) => {
    if (isJson) return json({ ok: status === 'sent', status, ...body }, code);
    const params = new URLSearchParams({ status });
    if (body.errors) params.set('fields', Object.keys(body.errors).join(','));
    return redirect(`/contact-result?${params}`, 303);
  };

  let input: Record<string, unknown>;
  try {
    input = isJson ? await request.json() : Object.fromEntries(await request.formData());
    if (!input || typeof input !== 'object') throw new Error('bad body');
  } catch {
    return json({ ok: false, status: 'invalid' }, 400);
  }

  const result = validateContact(input);
  // Bots that fill the hidden field get a fake success so they don't retry.
  if (!result.ok && result.spam) return reply('sent', 200);
  if (!result.ok) return reply('invalid', 400, { errors: result.errors });

  // Dry run (local tests) skips the limit so repeated runs don't lock themselves out.
  if (!dryRun && isRateLimited(clientAddress)) return reply('limited', 429);

  const sent = await sendMail(result.data, { apiKey: process.env.RESEND_API_KEY, dryRun });
  return sent ? reply('sent', 200) : reply('error', 502);
};

export const ALL: APIRoute = () => json({ ok: false }, 405);
