import type { Post, Comment, NewsletterSubscriber } from '@/types/blog';

export const posts: Post[] = [
  {
    id: '1',
    slug: 'slow-living-in-the-city',
    title: 'Slow living in the city',
    excerpt: 'Reflections on creating calm rituals in a fast-paced world.',
    content:
      '<p>Slow living is not about doing less, it is about doing what matters with intention.</p><p>In the city, we can build small rituals that ground us.</p>',
    coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    category: 'Lifestyle',
    tags: ['Mindfulness', 'Wellness'],
    author: {
      id: 'a1',
      name: 'Claire Abbott',
      role: 'editor',
      image: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe',
      bio: 'Writer & photographer.'
    },
    publishedAt: '2024-01-12',
    readingTime: '6 min read'
  },
  {
    id: '2',
    slug: 'notes-on-coffee-culture',
    title: 'Notes on coffee culture',
    excerpt: 'A short guide to quiet mornings and tiny neighborhood cafes.',
    content:
      '<p>From espresso bars to pour-overs, coffee rituals are a tiny respite.</p><p>Find the places that let you breathe.</p>',
    coverImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Culture',
    tags: ['Cafe', 'City'],
    author: {
      id: 'a2',
      name: 'Samuel Reyes',
      role: 'editor',
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91',
      bio: 'Culture editor.'
    },
    publishedAt: '2024-02-03',
    readingTime: '4 min read'
  },
  {
    id: '3',
    slug: 'designing-a-workspace',
    title: 'Designing a workspace that feels like home',
    excerpt: 'Thoughts on light, texture, and intention for creative spaces.',
    content:
      '<p>Bring softness to your workspace with textures and a calm palette.</p><p>A simple reset can turn any desk into a sanctuary.</p>',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    category: 'Design',
    tags: ['Workspace', 'Minimalism'],
    author: {
      id: 'a3',
      name: 'Olivia Chen',
      role: 'editor',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
      bio: 'Product designer.'
    },
    publishedAt: '2024-02-18',
    readingTime: '7 min read'
  },
  {
    id: '4',
    slug: 'design-is-the-mix-of-emotions',
    title: 'Design is the mix of emotions',
    excerpt: 'Did you come here for something in particular or just general Riker-bashing?',
    content:
      '<p>Design is a conversation between the maker and the viewer. It is a balance of clarity, restraint, and emotion.</p>',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    category: 'Travel',
    tags: ['Travel', 'Design'],
    author: {
      id: 'a4',
      name: 'Jesica Koli',
      role: 'editor',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
      bio: 'Travel editor.'
    },
    publishedAt: '2024-03-02',
    readingTime: '3 min read'
  },
  {
    id: '5',
    slug: 'developer-rap-video',
    title: 'I created a developer rap video - here’s what I learned',
    excerpt: 'Did you come here for something in particular or just general Riker-bashing?',
    content:
      '<p>Creative experiments often come from playful constraint. Here are the lessons from a developer rap video.</p>',
    coverImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    category: 'Travel',
    tags: ['Travel', 'Lifestyle'],
    author: {
      id: 'a5',
      name: 'Jesica Koli',
      role: 'editor',
      image: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe',
      bio: 'Writer & traveler.'
    },
    publishedAt: '2024-03-10',
    readingTime: '3 min read'
  }
];

export const comments: Comment[] = [
  {
    id: 'c1',
    postId: '1',
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    message: 'Absolutely loved this. The rituals section is perfect.',
    createdAt: '2024-02-20',
    approved: true
  }
];

export const subscribers: NewsletterSubscriber[] = [
  {
    id: 'n1',
    email: 'hello@notebook.com',
    subscribedAt: '2024-01-02'
  }
];
