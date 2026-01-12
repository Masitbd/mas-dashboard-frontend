import { NextResponse } from 'next/server';
import { getSubscribers, setSubscribers } from '@/mock/data-store';
import type { NewsletterSubscriber } from '@/types/blog';

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string };
  if (!body.email) {
    return NextResponse.json({ message: 'Email required' }, { status: 400 });
  }
  const subscribers = getSubscribers();
  const newSubscriber: NewsletterSubscriber = {
    id: `n${subscribers.length + 1}`,
    email: body.email,
    subscribedAt: new Date().toISOString().split('T')[0]
  };
  setSubscribers([newSubscriber, ...subscribers]);
  return NextResponse.json(newSubscriber, { status: 201 });
}
