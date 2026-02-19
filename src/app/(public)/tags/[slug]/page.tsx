"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/layout/container";
import { PostCard } from "@/components/blog/post-card";
import { useGetTagsQuery } from "@/redux/api/tags/tags.api";
import { useGetPostsPopulatedQuery } from "@/redux/api/posts/post.api";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface PageProps {
  params: { slug: string };
}

function PostCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="h-44 w-full animate-pulse rounded-2xl bg-accent" />
      <div className="mt-4 h-4 w-4/5 animate-pulse rounded bg-accent" />
      <div className="mt-3 h-3 w-full animate-pulse rounded bg-accent" />
      <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-accent" />
      <div className="mt-5 h-9 w-28 animate-pulse rounded-xl bg-accent" />
    </div>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent">
        <Sparkles className="text-primary" size={22} />
      </div>
      <p className="mt-4 text-lg font-semibold text-foreground">{title}</p>
      {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
    </div>
  );
}

/** Simple page number builder with ellipsis */
function buildPageItems(page: number, totalPages: number) {
  const items: (number | "…")[] = [];
  const clamp = (n: number) => Math.max(1, Math.min(totalPages, n));
  const left = clamp(page - 1);
  const right = clamp(page + 1);

  items.push(1);

  if (left > 2) items.push("…");
  for (let p = Math.max(2, left); p <= Math.min(totalPages - 1, right); p++) {
    items.push(p);
  }
  if (right < totalPages - 1) items.push("…");

  if (totalPages > 1) items.push(totalPages);
  return items;
}

function PaginationBar({
  page,
  totalPages,
  hasNext,
  isFetching,
  onPageChange,
}: {
  page: number;
  totalPages?: number;
  hasNext: boolean;
  isFetching: boolean;
  onPageChange: (p: number) => void;
}) {
  const hasPrev = page > 1;

  const pageItems = useMemo(() => {
    if (!totalPages || totalPages <= 1) return [];
    return buildPageItems(page, totalPages);
  }, [page, totalPages]);

  return (
    <div className="mt-10 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <div className="text-sm text-muted">
        {totalPages ? (
          <span>
            Page <span className="font-semibold text-foreground">{page}</span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">{totalPages}</span>
          </span>
        ) : (
          <span>
            Page <span className="font-semibold text-foreground">{page}</span>
          </span>
        )}

        {isFetching ? (
          <span className="ml-2 inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
            <span className="text-xs">Loading…</span>
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev || isFetching}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-secondary shadow-sm transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
          Prev
        </button>

        {totalPages ? (
          <div className="hidden items-center gap-1 sm:flex">
            {pageItems.map((it, idx) =>
              it === "…" ? (
                <span key={`dots-${idx}`} className="px-2 text-muted">
                  …
                </span>
              ) : (
                <button
                  key={it}
                  type="button"
                  onClick={() => onPageChange(it)}
                  disabled={isFetching}
                  className={[
                    "min-w-10 rounded-xl border px-3 py-2 text-sm font-medium shadow-sm transition",
                    it === page
                      ? "border-brand/30 bg-brand/10 text-primary"
                      : "border-border bg-card text-secondary hover:bg-accent",
                    isFetching ? "opacity-60" : "",
                  ].join(" ")}
                  aria-current={it === page ? "page" : undefined}
                >
                  {it}
                </button>
              ),
            )}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext || isFetching}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-secondary shadow-sm transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Next page"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default function TagPage({ params }: PageProps) {
  const LIMIT = 9;
  const [page, setPage] = useState(1);

  const slug = params?.slug ?? "";
  const searchTerm = useMemo(
    () => decodeURIComponent(slug).split("-").join(" "),
    [slug],
  );

  const {
    data: td,
    isLoading: tagLoading,
    isFetching: tagFetching,
    isError: tagError,
  } = useGetTagsQuery({ searchTerm, status: "published" }, { skip: !slug });

  const tag = td?.data?.data?.[0];
  const tagId = tag?._id as string | undefined;

  // reset page when tag changes
  useEffect(() => {
    setPage(1);
  }, [tagId]);

  const {
    data: pd,
    isLoading: postsLoading,
    isFetching: postsFetching,
    isError: postsError,
  } = useGetPostsPopulatedQuery(
    { tag: tagId, page: String(page), limit: String(LIMIT) },
    { skip: !tagId },
  );

  const posts = (pd?.data?.data as any[]) || [];

  // best-effort pagination meta (supports common shapes)
  const meta =
    pd?.data?.meta || pd?.meta || pd?.data?.pagination || pd?.pagination;

  const totalFromApi: number | undefined =
    meta?.total ||
    meta?.totalDocs ||
    meta?.count ||
    meta?.totalCount ||
    undefined;

  const totalPagesFromApi: number | undefined =
    meta?.totalPage || meta?.totalPages || meta?.pageCount || undefined;

  const computedTotalPages =
    totalPagesFromApi ||
    (typeof totalFromApi === "number"
      ? Math.max(1, Math.ceil(totalFromApi / LIMIT))
      : undefined);

  const hasNext =
    typeof computedTotalPages === "number"
      ? page < computedTotalPages
      : posts.length === LIMIT; // fallback if totals not returned

  const showSkeletonGrid =
    postsLoading || (!postsLoading && postsFetching) || (tagLoading && !tagId);

  const handlePageChange = (p: number) => {
    const next =
      typeof computedTotalPages === "number"
        ? Math.max(1, Math.min(computedTotalPages, p))
        : Math.max(1, p);

    if (next === page) return;
    setPage(next);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="py-12">
      <Container>
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-semibold font-serif text-foreground">
              {tagLoading ? (
                <span className="inline-block h-10 w-56 animate-pulse rounded bg-accent align-middle" />
              ) : tagError ? (
                "Tag"
              ) : tag?.name ? (
                <>
                  Tag: <span className="text-primary">{tag.name}</span>
                </>
              ) : (
                "Tag"
              )}
            </h1>

            <p className="mt-2 text-sm text-muted">
              {tagFetching || postsFetching ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
                  Updating…
                </span>
              ) : (
                "Browse the posts published under this tag."
              )}
            </p>
          </div>
        </div>

        <div className="mt-8">
          {tagLoading ? null : !tagId ? (
            <EmptyState
              title="Tag not found"
              subtitle="Please check the URL or try a different tag."
            />
          ) : postsError ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <p className="text-lg font-semibold text-foreground">
                Couldn’t load posts
              </p>
              <p className="mt-2 text-sm text-muted">
                Please refresh the page or check your network connection.
              </p>
            </div>
          ) : showSkeletonGrid ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: LIMIT }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <EmptyState
              title="No posts in this tag"
              subtitle="Check back later — new posts will appear here."
            />
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>

              <PaginationBar
                page={page}
                totalPages={computedTotalPages}
                hasNext={hasNext}
                isFetching={postsFetching}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
