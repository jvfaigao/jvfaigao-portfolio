export const CONTACT_EMAIL = 'faigaojv027@gmail.com';

export interface ContactData {
  name: string;
  email: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactData, string>>;

export type ValidationResult =
  | { ok: true; data: ContactData }
  | { ok: false; errors: ContactErrors; spam?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Shared by the browser (instant feedback) and the server (the real check).
export function validateContact(input: Record<string, unknown>): ValidationResult {
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  if (str(input.website)) return { ok: false, errors: {}, spam: true };

  const data = { name: str(input.name), email: str(input.email), message: str(input.message) };
  const errors: ContactErrors = {};
  if (data.name.length < 1 || data.name.length > 80) errors.name = 'Enter your name';
  if (data.email.length > 254 || !EMAIL_RE.test(data.email)) errors.email = 'Enter a valid email';
  if (data.message.length < 10) errors.message = 'Write at least 10 characters';
  else if (data.message.length > 2000) errors.message = 'Write at most 2,000 characters';

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 3;

// shortcut: in-memory, so each serverless instance counts on its own; move to Vercel KV/Upstash if spam gets through.
export function createRateLimiter() {
  const hits = new Map<string, number[]>();
  return function isRateLimited(ip: string, now = Date.now()): boolean {
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_PER_WINDOW) {
      hits.set(ip, recent);
      return true;
    }
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000) hits.clear(); // keep memory bounded
    return false;
  };
}

export const isRateLimited = createRateLimiter();

interface SendOptions {
  apiKey: string | undefined;
  fetchFn?: typeof fetch;
  dryRun?: boolean;
}

export async function sendMail(data: ContactData, { apiKey, fetchFn = fetch, dryRun = false }: SendOptions): Promise<boolean> {
  if (dryRun) return true;
  if (!apiKey) return false;
  try {
    const res = await fetchFn('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Portfolio <onboarding@resend.dev>',
        to: [CONTACT_EMAIL],
        reply_to: data.email,
        subject: `Portfolio message from ${data.name.replace(/[\r\n]+/g, ' ')}`,
        text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
