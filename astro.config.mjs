// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jvfaigao-portfolio.vercel.app',
  adapter: vercel(),
  integrations: [sitemap()],
  devToolbar: { enabled: false },
});
