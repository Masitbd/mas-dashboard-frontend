"use client";
import { Container } from "@/components/layout/container";
import { PostCard } from "@/components/blog/post-card";
import { posts } from "@/mock/posts";
import { useGetTagsQuery } from "@/redux/api/tags/tags.api";
import { useGetPostsPopulatedQuery } from "@/redux/api/posts/post.api";

interface PageProps {
  params: { slug: string };
}

export default function TagPage({ params }: PageProps) {
  const tag = params.slug.replace("-", " ");
  const { data: tagData } = useGetTagsQuery(
    { searchTerm: tag },
    { skip: !tag },
  );
  const { data: postData } = useGetPostsPopulatedQuery(
    { tag: tagData?.data?.data[0]?._id },
    { skip: !tagData?.data?.data[0]?._id },
  );
  return (
    <div className="py-12">
      <Container>
        <h1 className="text-4xl font-semibold font-serif">
          Tag: {tagData?.data?.data[0].name}
        </h1>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {postData?.data?.data?.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </Container>
    </div>
  );
}
