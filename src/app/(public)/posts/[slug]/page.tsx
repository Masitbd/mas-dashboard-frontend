"use client";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { AuthorBadge } from "@/components/blog/author-badge";
import { CommentSection } from "@/components/blog/comment-section";
import { posts } from "@/mock/posts";
import { useGetPostBySlugPopulatedQuery } from "@/redux/api/posts/post.api";

interface PageProps {
  params: { slug: string };
}

// export async function generateMetadata({
//   params,
// }: PageProps): Promise<Metadata> {
//   const post = posts.find((item) => item.slug === params.slug);
//   if (!post) {
//     return { title: "Post not found" };
//   }
//   return {
//     title: post.title,
//     description: post.excerpt,
//     alternates: {
//       canonical: `/posts/${post.slug}`,
//     },
//     openGraph: {
//       title: post.title,
//       description: post.excerpt,
//       images: [post.coverImage],
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: post.title,
//       description: post.excerpt,
//     },
//   };
// }

export default function PostPage({ params }: PageProps) {
  const { data: postData } = useGetPostBySlugPopulatedQuery(params?.slug, {
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

  return (
    <div className="py-12">
      <Container className="grid gap-10 lg:grid-cols-[2.2fr,1fr]">
        <article className="space-y-8">
          <header className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              {post?.category?.name}
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              {post?.title}
            </h1>
            <div className="text-xs text-muted">
              {post?.author?.displayName} ·{" "}
              {new Date(post?.createdAt ?? Date()).toLocaleString()} ·{" "}
              {post?.readingTime}
            </div>
          </header>
          <div className="relative h-80 overflow-hidden rounded-2xl bg-accent">
            <Image
              src={post?.coverImage}
              alt={post?.title}
              fill
              className="object-cover"
            />
          </div>
          <p className="text-sm text-secondary">{post?.excerpt}</p>
          <div
            className="prose-content text-base"
            dangerouslySetInnerHTML={{ __html: post?.content }}
          />
          <div className="rounded-2xl bg-accent p-4">
            <div className="flex items-center gap-4 text-xs text-muted">
              <span className="rounded bg-brand px-2 py-1 text-white">
                Travel
              </span>
              <span className="font-semibold text-foreground">
                {post?.title}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-3 text-center text-[11px] text-muted">
              <span>First</span>
              <span>Last</span>
              <span>Handle</span>
            </div>
            <div className="mt-1 grid grid-cols-3 text-center text-xs text-secondary">
              <span>Row1 Cell1</span>
              <span>Row1 Cell2</span>
              <span>Row1 Cell3</span>
            </div>
          </div>
          {/* <CommentSection postId={post.id} /> */}
          <div className="grid gap-6 md:grid-cols-2">
            {posts.slice(0, 2).map((item) => (
              <article
                key={item.id}
                className="space-y-3 rounded-2xl border border-border bg-card p-4"
              >
                <div className="relative h-40 overflow-hidden rounded-xl bg-accent">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {item.title}
                </p>
              </article>
            ))}
          </div>
        </article>
        <aside className="space-y-8">
          {/* <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-semibold text-foreground">
              <span className="rounded bg-brand px-2 py-1 text-xs uppercase tracking-[0.2em] text-white">
                Top
              </span>{" "}
              Authors
            </p>
            <div className="mt-4 space-y-4">
              {posts.slice(0, 3).map((author) => (
                <div key={author.author.id} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {author.author.name}
                    </p>
                    <p className="text-xs text-muted">
                      Fashion Designer, Blogger, Activist
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
          {/* <div className="rounded-2xl bg-brand p-5 text-white">
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
          </div> */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-semibold text-foreground">
              <span className="rounded bg-brand px-2 py-1 text-xs uppercase tracking-[0.2em] text-white">
                Categories
              </span>
            </p>
            <div className="mt-4 space-y-3 text-sm">
              {["Lifestyle", "Travel", "Food", "Healthcare", "Technology"].map(
                (label, index) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <span>{label}</span>
                    <span className="text-muted">
                      {String(index + 3).padStart(2, "0")}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
          {/* <div className="rounded-2xl border border-border bg-card p-5">
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
          </div> */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-semibold text-foreground">
              <span className="rounded bg-brand px-2 py-1 text-xs uppercase tracking-[0.2em] text-white">
                Search
              </span>{" "}
              With Tags
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Travel", "Lifestyle", "Fashion", "Technology", "Business"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-3 py-1 text-xs text-secondary"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>
        </aside>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
