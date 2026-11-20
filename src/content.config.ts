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
      liveUrl: z.string().url().optional(),
      liveLabel: z.string().default('Visit site'),
      repoUrl: z.string().url().optional(),
      result: z.object({ headline: z.string(), line: z.string() }).optional(),
      quote: z.object({ text: z.string(), by: z.string() }).optional(),
      // CSS wireframe thumbnail from the design canvas; swap for real images later.
      thumb: z.enum(['ja1', 'marami', 'urban', 'degz', 'faceattend', 'ambagpay', 'thesis']),
      screenshots: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      diagram: z.enum(['ja1', 'marami', 'urban', 'degz', 'faceattend', 'ambagpay', 'thesis']),
    }),
});

export const collections = { projects };
