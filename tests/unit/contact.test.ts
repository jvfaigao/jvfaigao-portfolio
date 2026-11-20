import { describe, expect, it, vi } from 'vitest';
import { createRateLimiter, sendMail, validateContact } from '../../src/lib/contact';

const valid = { name: 'Ana Cruz', email: 'ana@example.com', message: 'Hello JV, I need a booking system.', website: '' };

describe('validateContact', () => {
  it('accepts a valid message and trims fields', () => {
    const r = validateContact({ ...valid, name: '  Ana Cruz  ' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.name).toBe('Ana Cruz');
  });

  it.each([
    ['name', { name: '' }, 'Enter your name'],
    ['name', { name: 'x'.repeat(81) }, 'Enter your name'],
    ['email', { email: 'not-an-email' }, 'Enter a valid email'],
    ['email', { email: 'a@b' }, 'Enter a valid email'],
    ['message', { message: 'too short' }, 'Write at least 10 characters'],
    ['message', { message: 'x'.repeat(2001) }, 'Write at most 2,000 characters'],
  ])('rejects bad %s', (field, patch, text) => {
    const r = validateContact({ ...valid, ...patch });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors[field as 'name']).toBe(text);
  });

  it('accepts a message of exactly 10 and 2000 characters', () => {
    expect(validateContact({ ...valid, message: 'x'.repeat(10) }).ok).toBe(true);
    expect(validateContact({ ...valid, message: 'x'.repeat(2000) }).ok).toBe(true);
  });

  it('flags the honeypot as spam', () => {
    const r = validateContact({ ...valid, website: 'http://spam.example' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.spam).toBe(true);
  });

  it('treats missing fields as empty, not as a crash', () => {
    const r = validateContact({});
    expect(r.ok).toBe(false);
  });
});

describe('rate limiter', () => {
  it('allows 3 per IP per 10 minutes, then blocks', () => {
    const limited = createRateLimiter();
    const t = 1_000_000;
    expect([limited('1.1.1.1', t), limited('1.1.1.1', t + 1), limited('1.1.1.1', t + 2)]).toEqual([false, false, false]);
    expect(limited('1.1.1.1', t + 3)).toBe(true);
    expect(limited('2.2.2.2', t + 3)).toBe(false);
  });

  it('allows again after the window passes', () => {
    const limited = createRateLimiter();
    const t = 0;
    for (let i = 0; i < 3; i++) limited('ip', t);
    expect(limited('ip', t + 10 * 60_000 - 1)).toBe(true);
    expect(limited('ip', t + 10 * 60_000 + 1)).toBe(false);
  });
});

describe('sendMail', () => {
  const data = { name: 'Ana Cruz', email: 'ana@example.com', message: 'Hello JV, I need a booking system.' };

  it('posts to Resend with reply_to set to the visitor', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    expect(await sendMail(data, { apiKey: 'k', fetchFn })).toBe(true);
    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers.Authorization).toBe('Bearer k');
    const body = JSON.parse(init.body);
    expect(body.to).toEqual(['faigaojv027@gmail.com']);
    expect(body.from).toBe('Portfolio <onboarding@resend.dev>');
    expect(body.reply_to).toBe('ana@example.com');
    expect(body.text).toContain('Hello JV');
  });

  it('returns false on a non-2xx response or a network error', async () => {
    expect(await sendMail(data, { apiKey: 'k', fetchFn: vi.fn().mockResolvedValue(new Response('', { status: 500 })) })).toBe(false);
    expect(await sendMail(data, { apiKey: 'k', fetchFn: vi.fn().mockRejectedValue(new Error('down')) })).toBe(false);
  });

  it('returns false without an API key', async () => {
    const fetchFn = vi.fn();
    expect(await sendMail(data, { apiKey: undefined, fetchFn })).toBe(false);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('dry run succeeds without calling Resend', async () => {
    const fetchFn = vi.fn();
    expect(await sendMail(data, { apiKey: undefined, fetchFn, dryRun: true })).toBe(true);
    expect(fetchFn).not.toHaveBeenCalled();
  });
});
