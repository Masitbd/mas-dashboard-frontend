'use client';
import { Container } from '@/components/layout/container';
import { useGetPostsQuery } from '@/store/api';
import { PostCardSkeleton } from '@/components/ui/skeletons';
import Image from 'next/image';

export default function SearchPage() {
  const search = 'Travel';
  const { data } = useGetPostsQuery({ search, page: '1', limit: '9' });

  return (
    <div className="py-12">
      <Container>
        <div className="border-b border-border pb-4">
          <p className="text-sm text-secondary">Search Result For</p>
          <h1 className="mt-2 inline-block border-b-2 border-brand pb-2 text-2xl font-semibold">
            {search}
          </h1>
        </div>
        <div className="mt-10 space-y-6">
          {data
            ? data.data.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 md:flex-row"
                >
                  <div className="relative h-40 w-full overflow-hidden rounded-xl bg-accent md:w-64">
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <span className="rounded bg-accent px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-brand">
                      {post.category}
                    </span>
                    <h2 className="text-xl font-semibold text-foreground">{post.title}</h2>
                    <div className="text-xs text-muted">
                      {post.author.name} · {post.publishedAt} · {post.readingTime}
                    </div>
                    <p className="text-sm text-secondary">{post.excerpt}</p>
                  </div>
                </article>
              ))
            : Array.from({ length: 4 }).map((_, index) => <PostCardSkeleton key={index} />)}
        </div>
      </Container>
    </div>
  );
}
