import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    year: z.string(),
    stack: z.array(z.string()).default([]),
    url: z.string().url().optional(),
    repository: z.string().url().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { projects };
