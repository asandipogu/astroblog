import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const writing = await getCollection('writing');
  const notes = await getCollection('notes');
  
  const items = [...writing, ...notes]
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description || '',
      link: `/${post.collection}/${post.slug}/`,
    }));

  return rss({
    title: 'Andy | Personal Workspace',
    description: 'Essays, notes, and thoughts.',
    site: context.site,
    items: items,
    customData: `<language>en-us</language>`,
  });
}