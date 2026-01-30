"use client";
import { Container } from "@/components/layout/container";
import { PostCard } from "@/components/blog/post-card";
import { posts } from "@/mock/posts";
import { useGetCategoriesQuery } from "@/redux/api/categories/category.api";
import { useGetPostsPopulatedQuery } from "@/redux/api/posts/post.api";

interface PageProps {
  params: { slug: string };
}

export default function CategoryPage({ params }: PageProps) {
  const { data: cd } = useGetCategoriesQuery(
    {
      searchTerm: params?.slug?.replace("-", " "),
    },
    { skip: !params?.slug },
  );

  const { data: pd } = useGetPostsPopulatedQuery(
    { category: cd?.data?.data[0]?._id },
    { skip: !cd?.data?.data?.length },
  );

  return (
    <div className="py-12">
      <Container>
        <h1 className="text-4xl font-semibold font-serif">
          Category: {cd?.data?.data[0]?.name}
        </h1>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pd?.data?.data?.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </Container>
    </div>
  );
}
