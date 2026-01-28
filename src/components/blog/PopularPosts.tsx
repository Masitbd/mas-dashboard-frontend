import { useGetPostsPopulatedQuery } from "@/redux/api/posts/post.api";
import React from "react";
import Image from "next/image";
import { PostCardSkeleton } from "../ui/skeletons";

const PopularPosts = () => {
  const { data: postData } = useGetPostsPopulatedQuery({
    page: 1,
    limit: 10,
    placement: "popular",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
        <span className="rounded bg-brand px-2 py-1 text-xs uppercase tracking-[0.2em] text-white">
          Popular
        </span>
        <span>Posted</span>
      </div>
      <div className="space-y-4">
        {postData?.data?.data
          ? postData?.data?.data?.map((post) => (
              <article
                key={post._id}
                className="flex gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-accent">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="rounded bg-accent px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-brand">
                    {post.category?.name}
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {post.title}
                  </p>
                  <div className="text-[11px] text-muted">
                    {post.author.name} · {post.readingTime}
                  </div>
                </div>
              </article>
            ))
          : Array.from({ length: 4 }).map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}
      </div>
    </div>
  );
};

export default PopularPosts;
