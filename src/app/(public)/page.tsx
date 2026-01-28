"use client";
import { Container } from "@/components/layout/container";
import { AuthorBadge } from "@/components/blog/author-badge";
import { BlogPagination } from "@/components/ui/pagination";

import { PostCardSkeleton } from "@/components/ui/skeletons";
import Image from "next/image";
import { useState } from "react";
import { useGetPostsQuery } from "@/redux/api/suppliers/supplier.api";
import PopularPostHompage from "@/components/blog/FeaturedPost";
import FeaturedPost from "@/components/blog/FeaturedPost";
import PopularPosts from "@/components/blog/PopularPosts";

export default function HomePage() {
  const search = "";
  const [page, setPage] = useState(1);
  const { data } = useGetPostsQuery({
    search,
    page: String(page),
    limit: "6",
  });

  const posts = data?.data || [];
  const featured = posts.slice(0, 2);
  const popular = posts.slice(2, 6);
  const recent = posts.slice(0, 8);

  const sidebarAuthors = [
    { name: "Jenny Kia", role: "Fashion Designer, Blogger, Activist" },
    { name: "Andress Rasel", role: "Blogger, Activist, Content Creator" },
    { name: "Jenny Kia", role: "Fashion Designer, Blogger, Activist" },
  ];
  const sidebarCategories = [
    { label: "Lifestyle", count: 9 },
    { label: "Travel", count: 5 },
    { label: "Food", count: 9 },
    { label: "Healthcare", count: 10 },
    { label: "Technology", count: 3 },
  ];
  const sidebarTags = [
    "Travel",
    "Lifestyle",
    "Fashion",
    "Technology",
    "Business",
    "Design",
    "Health",
    "Food",
  ];

  return (
    <div className="py-12">
      <Container>
        <section className="grid gap-10 lg:grid-cols-[2.2fr,1fr]">
          <FeaturedPost />
          {/* <div className="space-y-8">
            <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
              <span className="rounded bg-brand px-2 py-1 text-xs uppercase tracking-[0.2em] text-white">
                Featured
              </span>
              <span>This Month</span>
            </div>
            <div className="space-y-6">
              {data
                ? featured.map((post) => (
                    <article
                      key={post.id}
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
                          {post.category}
                        </span>
                        <h3 className="text-lg font-semibold text-foreground">
                          {post.title}
                        </h3>
                        <p className="text-sm text-secondary">{post.excerpt}</p>
                        <AuthorBadge
                          author={post.author}
                          publishedAt={post.publishedAt}
                        />
                      </div>
                    </article>
                  ))
                : Array.from({ length: 2 }).map((_, index) => (
                    <PostCardSkeleton key={index} />
                  ))}
            </div>
          </div> */}
          {/* <div className="space-y-6">
            <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
              <span className="rounded bg-brand px-2 py-1 text-xs uppercase tracking-[0.2em] text-white">
                Popular
              </span>
              <span>Posted</span>
            </div>
            <div className="space-y-4">
              {data
                ? popular.map((post) => (
                    <article
                      key={post.id}
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
                          {post.category}
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
          </div> */}
          <PopularPosts />
        </section>

        <section className="mt-16 grid gap-10 lg:grid-cols-[2.2fr,1fr]">
          <div>
            <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
              <span className="rounded bg-brand px-2 py-1 text-xs uppercase tracking-[0.2em] text-white">
                Recently
              </span>
              <span>Posted</span>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {data
                ? recent.map((post) => (
                    <article
                      key={post.id}
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
                        {post.category}
                      </span>
                      <h3 className="text-base font-semibold text-foreground">
                        {post.title}
                      </h3>
                      <p className="text-sm text-secondary">{post.excerpt}</p>
                      <div className="text-[11px] text-muted">
                        {post.author.name} · {post.publishedAt} ·{" "}
                        {post.readingTime}
                      </div>
                    </article>
                  ))
                : Array.from({ length: 6 }).map((_, index) => (
                    <PostCardSkeleton key={index} />
                  ))}
            </div>
            <div className="mt-8">
              <BlogPagination
                page={page}
                total={data?.total || 0}
                limit={6}
                onChange={setPage}
              />
            </div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-semibold text-foreground">
                <span className="rounded bg-brand px-2 py-1 text-xs uppercase tracking-[0.2em] text-white">
                  Top
                </span>{" "}
                Authors
              </p>
              <div className="mt-4 space-y-4">
                {sidebarAuthors.map((author) => (
                  <div key={author.name} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {author.name}
                      </p>
                      <p className="text-xs text-muted">{author.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-brand p-5 text-white">
              <p className="text-sm font-semibold">
                Want To Travel Sikkim By Car?
              </p>
              <p className="mt-2 text-xs text-white/80">
                Did you come here for something in particular or just general
                Riker-bashing?
              </p>
              <button className="mt-4 rounded-full border border-white px-4 py-1 text-xs uppercase tracking-[0.2em]">
                Visit Us
              </button>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-semibold text-foreground">
                <span className="rounded bg-brand px-2 py-1 text-xs uppercase tracking-[0.2em] text-white">
                  Categories
                </span>
              </p>
              <div className="mt-4 space-y-3 text-sm">
                {sidebarCategories.map((category) => (
                  <div
                    key={category.label}
                    className="flex items-center justify-between"
                  >
                    <span>{category.label}</span>
                    <span className="text-muted">
                      {String(category.count).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-semibold text-foreground">
                <span className="rounded bg-brand px-2 py-1 text-xs uppercase tracking-[0.2em] text-white">
                  Today&apos;s
                </span>{" "}
                Update
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                {[
                  { label: "New Posts", value: 14 },
                  { label: "Total Visitors", value: 480 },
                  { label: "New Subscribers", value: 29 },
                  { label: "Blog Read", value: 138 },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-accent p-4">
                    <p className="text-lg font-semibold text-brand">
                      {item.value}
                    </p>
                    <p className="text-xs text-muted">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-semibold text-foreground">
                <span className="rounded bg-brand px-2 py-1 text-xs uppercase tracking-[0.2em] text-white">
                  Instagram
                </span>{" "}
                Posts
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="h-16 rounded-lg bg-accent" />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-semibold text-foreground">
                <span className="rounded bg-brand px-2 py-1 text-xs uppercase tracking-[0.2em] text-white">
                  Search
                </span>{" "}
                With Tags
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {sidebarTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-3 py-1 text-xs text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </Container>
    </div>
  );
}
