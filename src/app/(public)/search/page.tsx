"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Search, X } from "lucide-react";

import { Container } from "@/components/layout/container";
import { PostCardSkeleton } from "@/components/ui/skeletons";
import { useGetPostsPopulatedQuery } from "@/redux/api/posts/post.api";
import Link from "next/link";

export default function SearchPage() {
  const router = useRouter();
  const params = useSearchParams();

  // initial value from URL: /search?q=Travel
  const initialQ = params.get("q") ?? "";
  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [debouncedTerm, setDebouncedTerm] = useState(initialQ);

  // keep input in sync if user navigates with back/forward
  useEffect(() => {
    setSearchTerm(initialQ);
    setDebouncedTerm(initialQ);
  }, [initialQ]);

  // debounce effect
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, 400);

    return () => clearTimeout(t);
  }, [searchTerm]);

  // update URL only when debounced term changes
  useEffect(() => {
    const q = debouncedTerm.trim();
    router.replace(q ? `?q=${encodeURIComponent(q)}` : `?`, { scroll: false });
  }, [debouncedTerm, router]);

  const shouldSearch = debouncedTerm.length > 0;

  const {
    data: postData,
    isLoading,
    isFetching,
    isError,
  } = useGetPostsPopulatedQuery(
    {
      limit: "10",
      page: 1,
      searchTerm: debouncedTerm,
    },
    {
      // don't query until user types something
      skip: !shouldSearch,
    },
  );

  const posts = useMemo(() => postData?.data?.data ?? [], [postData]);
  const showLoading = shouldSearch && (isLoading || isFetching);
  const showEmpty =
    shouldSearch && !showLoading && !isError && posts.length === 0;

  return (
    <div className="py-12">
      <Container>
        {/* Header */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col gap-4 ">
            <div>
              <p className="text-sm text-secondary my-2">Search posts</p>
              <div className="w-full">
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-accent px-4 py-3">
                  <Search className="h-4 w-4 text-muted" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, tag, category..."
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
                  />
                  {searchTerm.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="rounded-lg p-1 text-muted transition hover:bg-card hover:text-foreground"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Inline loading indicator */}
                {showLoading && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-brand" />
                    Searching…
                  </div>
                )}
              </div>
            </div>

            {/* Search input */}
          </div>
        </div>

        {/* Body */}
        <div className="mt-10 space-y-6">
          {!shouldSearch && (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <p className="text-sm text-secondary">
                Start typing to search posts by title, category, or tags.
              </p>
            </div>
          )}

          {isError && shouldSearch && (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <p className="text-sm text-secondary">
                Something went wrong while searching. Please try again.
              </p>
            </div>
          )}

          {showLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}

          {showEmpty && (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <p className="text-sm text-secondary">No post found for</p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                “{debouncedTerm}”
              </p>
              <p className="mt-2 text-sm text-muted">
                Try a different keyword, or check spelling.
              </p>
            </div>
          )}

          {!showLoading &&
            shouldSearch &&
            !isError &&
            posts.length > 0 &&
            posts.map((post: any) => {
              const categoryLabel =
                post?.category?.name ?? post?.category ?? "Uncategorized";
              const authorName = post?.author?.displayName ?? "Unknown";
              const publishedAt = post?.createdAt
                ? new Date(post.publishedAt).toLocaleDateString()
                : "";

              return (
                <Link href={`/posts/${post?.slug}`}>
                  <article
                    key={post?._id ?? post?.id}
                    className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 md:flex-row my-4"
                  >
                    <div className="relative h-40 w-full overflow-hidden rounded-xl bg-accent md:w-64">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <span className="inline-flex rounded bg-accent px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-brand">
                        {categoryLabel}
                      </span>

                      <h2 className="text-xl font-semibold text-foreground">
                        {post.title}
                      </h2>

                      <div className="text-xs text-muted">
                        {authorName}
                        {publishedAt ? ` · ${publishedAt}` : ""}{" "}
                        {post.readingTime ? ` · ${post.readingTime}` : ""}
                      </div>

                      <p className="text-sm text-secondary">{post.excerpt}</p>
                    </div>
                  </article>
                </Link>
              );
            })}
        </div>
      </Container>
    </div>
  );
}
