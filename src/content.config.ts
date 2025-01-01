import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

export const works = defineCollection({
  loader: glob({ base: 'works', pattern: '**/*.yaml' }),
  schema: () =>
    z.object({
      name: z.string(),
      tags: z.array(z.string()),
      desc: z.string(),
      images: z.array(z.string()),
      size: z.string(),
      est_hours: z.number(),
      est_days: z.number(),
      services_used: z.array(z.string()),
    }),
});

export const collections = { works };
