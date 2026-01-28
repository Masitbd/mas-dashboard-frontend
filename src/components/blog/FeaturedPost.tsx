import { useGetPostsPopulatedQuery } from "@/redux/api/posts/post.api";
import Image from "next/image";
import React from "react";
import { AuthorBadge } from "./author-badge";
import { PostCardSkeleton } from "../ui/skeletons";
import { Author } from "@/types/blog";
const FeaturedPost = () => {
  const { data: postData } = useGetPostsPopulatedQuery({
    page: 1,
    limit: 10,
    placement: "featured",
  });
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
        <span className="rounded bg-brand px-2 py-1 text-xs uppercase tracking-[0.2em] text-white">
          Featured
        </span>
        <span>This Month</span>
      </div>
      <div className="space-y-6">
        {postData?.data?.data
          ? postData?.data?.data.map((post) => (
              <article
                key={post._id}
                className="flex gap-6 rounded-2xl border border-border bg-card p-6"
              >
                <div className="relative h-32 w-48 overflow-hidden rounded-xl bg-accent">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <span className="rounded bg-accent px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-brand">
                    {post?.category?.name}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">
                    {post.title}
                  </h3>
                  <p className="text-sm text-secondary">{post.excerpt}</p>
                  <AuthorBadge
                    author={post.author as unknown as Author}
                    publishedAt={post.createdAt as string}
                  />
                </div>
              </article>
            ))
          : Array.from({ length: 2 }).map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}
      </div>
    </div>
  );
};

export default FeaturedPost;
