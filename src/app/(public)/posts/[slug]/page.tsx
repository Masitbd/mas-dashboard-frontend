"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { CommentSection } from "@/components/blog/comment-section";
import { useGetPostBySlugPopulatedQuery } from "@/redux/api/posts/post.api";
import { Calendar, Clock, Folder, Hash, User2 } from "lucide-react";

interface PageProps {
  params: { slug: string };
}

function formatDate(date?: string) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function PostPage({ params }: PageProps) {
  const {
    data: postData,
    isLoading,
    isFetching,
    isError,
  } = useGetPostBySlugPopulatedQuery(params?.slug, {
    skip: !params?.slug,
  });

  const post = postData?.data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post?.title,
    image: post?.coverImage,
    datePublished: post?.createdAt,
    author: {
      "@type": "Person",
      name: post?.author?.displayName,
    },
  };

  const tags = (post?.tags ?? []) as Array<{ _id?: string; name?: string }>;

  // placeholders (you'll add real href later)
  const authorHref = "#";
  const categoryHref = "#";
  const tagHref = (tagId?: string) => "#";

  const showLoading = isLoading || isFetching;

  return (
    <div className="py-12">
      <Container>
        {showLoading && (
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="h-4 w-40 animate-pulse rounded bg-accent" />
            <div className="mt-4 h-10 w-3/4 animate-pulse rounded bg-accent" />
            <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-accent" />
            <div className="mt-8 h-80 animate-pulse rounded-2xl bg-accent" />
            <div className="mt-8 space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-accent" />
              <div className="h-4 w-11/12 animate-pulse rounded bg-accent" />
              <div className="h-4 w-10/12 animate-pulse rounded bg-accent" />
            </div>
          </div>
        )}

        {!showLoading && isError && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-sm text-secondary">
              Something went wrong while loading this post.
            </p>
          </div>
        )}

        {!showLoading && !isError && post && (
          <article className="mx-auto max-w-7xl rounded-2xl border border-border bg-card p-6 md:p-10">
            {/* Header */}
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {post?.category?.name && (
                  <Link
                    href={categoryHref}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-accent px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-brand transition hover:bg-card"
                  >
                    <Folder className="h-3.5 w-3.5" />
                    {post.category.name}
                  </Link>
                )}

                {post?.readingTime && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] text-muted">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readingTime}
                  </span>
                )}

                {post?.createdAt && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] text-muted">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(post.createdAt)}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-semibold leading-tight text-foreground md:text-5xl">
                {post?.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
                <User2 className="h-4 w-4" />
                <Link
                  href={authorHref}
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {post?.author?.displayName ?? "Unknown author"}
                </Link>
                {post?.createdAt && (
                  <>
                    <span className="text-muted">·</span>
                    <span className="text-secondary">
                      {formatDate(post.createdAt)}
                    </span>
                  </>
                )}
              </div>

              {post?.excerpt && (
                <p className="text-base leading-relaxed text-secondary">
                  {post.excerpt}
                </p>
              )}
            </header>

            {/* Cover */}
            {post?.coverImage && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-accent">
                <div className="relative h-64 w-full md:h-[420px]">
                  <Image
                    src={post.coverImage as string}
                    alt={(post?.title as string) ?? "Cover image"}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div
              className="prose-content mt-10 text-base"
              dangerouslySetInnerHTML={{ __html: post?.content as string }}
            />

            {/* Footer */}
            <footer className="mt-12 space-y-8">
              {/* Tags */}
              <section className="rounded-2xl border border-border bg-accent p-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                  <Hash className="h-4 w-4" />
                  Tags
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.length > 0 ? (
                    tags.map((t) => (
                      <Link
                        key={t?._id ?? t?.name}
                        href={tagHref(t?._id)}
                        className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-secondary transition hover:border-brand hover:text-foreground"
                      >
                        {t?.name}
                      </Link>
                    ))
                  ) : (
                    <span className="text-sm text-secondary">No tags</span>
                  )}
                </div>
              </section>

              {/* Author Info */}
              <section className="rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <Link
                      href={authorHref}
                      className="relative h-14 w-14 overflow-hidden rounded-2xl border border-border bg-accent"
                      aria-label="Author profile"
                    >
                      <Image
                        src={
                          (post?.author?.avatarUrl as string) ||
                          "/images/avatar-placeholder.png"
                        }
                        alt={(post?.author?.displayName as string) || "Author"}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted">
                        Written by
                      </p>

                      <Link
                        href={authorHref}
                        className="mt-1 inline-block text-lg font-semibold text-foreground underline-offset-4 hover:underline"
                      >
                        {post?.author?.displayName ?? "Unknown author"}
                      </Link>

                      <p className="mt-1 text-sm text-secondary">
                        {post?.author?.bio ??
                          "Author bio will appear here. Add a short, professional line about the writer."}
                      </p>
                    </div>
                  </div>

                  {/* Optional actions (href placeholders) */}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={authorHref}
                      className="rounded-xl border border-border bg-accent px-4 py-2 text-sm text-secondary transition hover:bg-card"
                    >
                      View profile
                    </Link>
                    <Link
                      href="#"
                      className="rounded-xl border border-border bg-accent px-4 py-2 text-sm text-secondary transition hover:bg-card"
                    >
                      More posts
                    </Link>
                  </div>
                </div>
              </section>

              <CommentSection postId={post?._id as string} />
            </footer>
          </article>
        )}
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
