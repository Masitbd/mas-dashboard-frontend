import { NextResponse } from 'next/server';
import { getComments, setComments } from '@/mock/data-store';
import type { Comment } from '@/types/blog';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');
  let data = getComments();
  if (postId && postId !== 'all') {
    data = data.filter((comment) => comment.postId === postId);
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<Comment>;
  const comments = getComments();
  const newComment: Comment = {
    id: `c${comments.length + 1}`,
    postId: body.postId || '',
    name: body.name || 'Anonymous',
    email: body.email || '',
    message: body.message || '',
    createdAt: new Date().toISOString().split('T')[0],
    approved: false
  };
  setComments([newComment, ...comments]);
  return NextResponse.json(newComment, { status: 201 });
}
