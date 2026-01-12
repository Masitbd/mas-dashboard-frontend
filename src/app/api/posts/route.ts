import { NextResponse } from 'next/server';
import { getPosts, setPosts } from '@/mock/data-store';
import type { Post } from '@/types/blog';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const sort = searchParams.get('sort') || 'latest';
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 6);

  let data = [...getPosts()];
  if (search) {
    data = data.filter(
      (post) =>
        post.title.toLowerCase().includes(search) ||
        post.category.toLowerCase().includes(search) ||
        post.tags.some((tag) => tag.toLowerCase().includes(search))
    );
  }
  if (category && category !== 'All') {
    data = data.filter((post) => post.category === category);
  }
  if (tag && tag !== 'All') {
    data = data.filter((post) => post.tags.includes(tag));
  }
  if (sort === 'oldest') {
    data = data.reverse();
  }

  const total = data.length;
  const start = (page - 1) * limit;
  const paginated = data.slice(start, start + limit);

  return NextResponse.json({ data: paginated, total });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<Post>;
  const posts = getPosts();
  const author =
    posts[0]?.author || ({ id: 'a1', name: 'Notebook Editor', role: 'editor' } as const);
  const newPost: Post = {
    id: `${posts.length + 1}`,
    slug: body.title?.toLowerCase().replace(/\s+/g, '-') || `post-${posts.length + 1}`,
    title: body.title || 'Untitled',
    excerpt: body.excerpt || '',
    content: body.content || '',
    coverImage: body.coverImage || posts[0]?.coverImage || '',
    category: body.category || 'General',
    tags: body.tags || [],
    author,
    publishedAt: new Date().toISOString().split('T')[0],
    readingTime: '5 min read'
  };

  setPosts([newPost, ...posts]);

  return NextResponse.json(newPost, { status: 201 });
}
