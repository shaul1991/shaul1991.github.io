import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    articleType: z.enum(['brief', 'guide']).default('brief'),
    series: z.string().optional(),
    seriesOrder: z.number().int().positive().optional(),
    editor: z.literal('한결'),
    editorReview: z.string(),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    year: z.string(),
    stack: z.array(z.string()).default([]),
    url: z.string().url().optional(),
    repository: z.string().url().optional(),
    facts: z.array(z.string()).max(3).optional(),
    initials: z.string().min(1).max(3).optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { posts, projects };
