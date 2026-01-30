import { z, defineCollection } from 'astro:content';

const writingCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        description: z.string(),
        tags: z.array(z.string()).optional(),
        draft: z.boolean().optional(),
    }),
});

const notesCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        description: z.string(),
        tags: z.array(z.string()).optional(),
    }),
});

const workCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.date(),
        link: z.string().url().optional(), // External link to project if applicable
        tags: z.array(z.string()).optional(),
    }),
});

export const collections = {
    'writing': writingCollection,
    'notes': notesCollection,
    'work': workCollection,
};
