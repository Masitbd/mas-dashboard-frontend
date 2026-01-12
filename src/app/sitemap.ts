import type { MetadataRoute } from 'next';
import { posts } from '@/mock/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const postUrls = posts.map((post) => ({
    url: `http://localhost:3000/posts/${post.slug}`,
    lastModified: new Date(post.publishedAt)
  }));

  return [
    { url: 'http://localhost:3000', lastModified: new Date() },
    { url: 'http://localhost:3000/about', lastModified: new Date() },
    { url: 'http://localhost:3000/categories', lastModified: new Date() },
    { url: 'http://localhost:3000/contact', lastModified: new Date() },
    { url: 'http://localhost:3000/faq', lastModified: new Date() },
    { url: 'http://localhost:3000/elements', lastModified: new Date() },
    { url: 'http://localhost:3000/write-on', lastModified: new Date() },
    ...postUrls
  ];
}
