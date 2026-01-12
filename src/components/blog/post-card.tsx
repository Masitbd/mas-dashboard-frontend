import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/types/blog';
import { AuthorBadge } from './author-badge';

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-card">
      <Link href={`/posts/${post.slug}`} className="relative h-52 w-full overflow-hidden rounded-t-2xl">
        <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
      </Link>
      <div className="flex flex-1 flex-col gap-4 px-6 pb-6">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted">
          <span>{post.category}</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{post.readingTime}</span>
        </div>
        <Link
          href={`/posts/${post.slug}`}
          className="text-2xl font-semibold leading-snug tracking-tight text-foreground font-serif"
        >
          {post.title}
        </Link>
        <p className="text-sm text-secondary">{post.excerpt}</p>
        <AuthorBadge author={post.author} publishedAt={post.publishedAt} />
      </div>
    </article>
  );
}
