import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      summary: z.string().max(90),
      intro: z.string(),
      group: z.enum(['production', 'other']),
      order: z.number(),
      status: z.enum(['production', 'competition', 'hackathon', 'team']),
      role: z.string(),
      year: z.string(),
      stack: z.array(z.string()),
      meta: z.string(),
      liveUrl: z.url().optional(),
      liveLabel: z.string().default('Visit site'),
      repoUrl: z.url().optional(),
      result: z.object({ headline: z.string(), line: z.string() }).optional(),
      quote: z.object({ text: z.string(), by: z.string() }).optional(),
      // The first screenshot doubles as the thumbnail on the Projects page. Made by scripts/make-media.mjs.
      screenshots: z.array(z.object({ src: image(), alt: z.string() })).min(1),
      // Award photo, certificate and the like, shown in a "Recognition" section.
      recognition: z.array(z.object({ src: image(), alt: z.string(), caption: z.string() })).optional(),
      // Short muted clip served from public/media/<slug>.mp4 (+ .webp poster).
      demo: z.object({ width: z.number(), height: z.number(), label: z.string() }).optional(),
      diagram: z.enum(['ja1', 'marami', 'urban', 'degz', 'faceattend', 'ambagpay', 'thesis']),
    }),
});

export const collections = { projects };
