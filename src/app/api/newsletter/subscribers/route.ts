import { NextResponse } from 'next/server';
import { getSubscribers } from '@/mock/data-store';

export async function GET() {
  return NextResponse.json(getSubscribers());
}
