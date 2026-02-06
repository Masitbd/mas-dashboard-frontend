import { useGetPostsPopulatedQuery } from "@/redux/api/posts/post.api";
import React from "react";
import Image from "next/image";
import { PostCardSkeleton } from "../ui/skeletons";
import Link from "next/link";

const RecentlyPostedSection = () => {
  const { data: postData } = useGetPostsPopulatedQuery({
    page: 1,
    limit: 10,
  });

  return (
    <div>
      <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
        <span className="rounded bg-brand px-2 py-1 text-xs uppercase tracking-[0.2em] text-white">
          Recently
        </span>
        <span>Posted</span>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {postData?.data?.data
          ? postData?.data?.data?.map((post) => (
              <Link href={`/posts/${post?.slug}`}>
                <article
                  key={post._id}
                  className="space-y-3 rounded-2xl border border-border bg-card p-4"
                >
                  <div className="relative h-40 overflow-hidden rounded-xl bg-accent">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="rounded bg-accent px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-brand">
                    {post?.category?.name}
                  </span>
                  <h3 className="text-base font-semibold text-foreground">
                    {post.title}
                  </h3>
                  <p className="text-sm text-secondary">{post.excerpt}</p>
                  <div className="text-[11px] text-muted">
                    {post.author.displayName} ·{" "}
                    {post?.createdAt ?? new Date().toLocaleString()} ·{" "}
                    {post.readingTime}
                  </div>
                </article>
              </Link>
            ))
          : Array.from({ length: 6 }).map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}
      </div>
      {/* <div className="mt-8">
        <BlogPagination
          page={page}
          total={data?.total || 0}
          limit={6}
          onChange={setPage}
        />
      </div> */}
    </div>
  );
};

export default RecentlyPostedSection;
