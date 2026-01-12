import { NextResponse } from 'next/server';
import { getPosts, setPosts } from '@/mock/data-store';

interface Params {
  params: { id: string };
}

export async function GET(_: Request, { params }: Params) {
  const post = getPosts().find((item) => item.slug === params.id);
  if (!post) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PATCH(request: Request, { params }: Params) {
  const body = await request.json();
  const posts = getPosts();
  const index = posts.findIndex((item) => item.id === params.id);
  if (index === -1) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  const updated = { ...posts[index], ...body };
  const next = [...posts];
  next[index] = updated;
  setPosts(next);
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
  const posts = getPosts();
  const next = posts.filter((item) => item.id !== params.id);
  setPosts(next);
  return NextResponse.json({ success: true });
}
