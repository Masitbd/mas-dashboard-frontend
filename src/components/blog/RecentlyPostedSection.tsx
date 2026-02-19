"use client";

import React, { useMemo, useRef, useState } from "react";
import { useGetPostsPopulatedQuery } from "@/redux/api/posts/post.api";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { PostCardSkeleton } from "../ui/skeletons";

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

const RecentlyPostedSection = () => {
  const LIMIT = 6;
  const [page, setPage] = useState(1);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const {
    data: pd,
    isLoading,
    isFetching,
    isError,
  } = useGetPostsPopulatedQuery({
    page: String(page),
    limit: String(LIMIT),
    status: "published",
    // you can add sort if your API supports it, e.g. sortBy: "createdAt", sortOrder: "desc"
  });

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
      : posts.length === LIMIT;

  const showSkeletonGrid = isLoading || (!isLoading && isFetching);

  const handlePageChange = (p: number) => {
    const next =
      typeof computedTotalPages === "number"
        ? Math.max(1, Math.min(computedTotalPages, p))
        : Math.max(1, p);

    if (next === page) return;
    setPage(next);

    // scroll back to this section (nicer than window top for homepage)
    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <div ref={sectionRef}>
      <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
        <span className="rounded bg-brand px-2 py-1 text-xs uppercase tracking-[0.2em] text-white">
          Recently
        </span>
        <span>Posted</span>
      </div>

      <div className="mt-6">
        {isError ? (
          <EmptyState
            title="Couldn’t load recent posts"
            subtitle="Please refresh the page or check your network connection."
          />
        ) : showSkeletonGrid ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: LIMIT }).map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            title="No recent posts"
            subtitle="Check back later — new posts will appear here."
          />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <Link key={post._id} href={`/posts/${post?.slug}`}>
                  <article className="space-y-3 rounded-2xl border border-border bg-card p-4 transition hover:bg-accent/30">
                    <div className="relative h-40 overflow-hidden rounded-xl bg-accent">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {post?.category?.name ? (
                      <span className="inline-block rounded bg-accent px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-brand">
                        {post.category.name}
                      </span>
                    ) : null}

                    <h3 className="text-base font-semibold text-foreground">
                      {post.title}
                    </h3>

                    <p className="text-sm text-secondary">{post.excerpt}</p>

                    <div className="text-[11px] text-muted">
                      {post?.author?.displayName ?? "Unknown"} ·{" "}
                      {new Date(
                        post?.createdAt ?? new Date(),
                      ).toLocaleDateString("en-GB")}{" "}
                      · {post?.readingTime ?? ""}
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            <PaginationBar
              page={page}
              totalPages={computedTotalPages}
              hasNext={hasNext}
              isFetching={isFetching}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default RecentlyPostedSection;
