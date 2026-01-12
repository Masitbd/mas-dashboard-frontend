import { NextResponse } from 'next/server';
import { getComments, setComments } from '@/mock/data-store';

interface Params {
  params: { id: string };
}

export async function PATCH(request: Request, { params }: Params) {
  const body = await request.json();
  const comments = getComments();
  const index = comments.findIndex((item) => item.id === params.id);
  if (index === -1) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  const updated = { ...comments[index], ...body };
  const next = [...comments];
  next[index] = updated;
  setComments(next);
  return NextResponse.json(updated);
}
