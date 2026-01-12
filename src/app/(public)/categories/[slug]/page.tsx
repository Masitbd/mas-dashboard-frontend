import { Container } from '@/components/layout/container';
import { PostCard } from '@/components/blog/post-card';
import { posts } from '@/mock/posts';

interface PageProps {
  params: { slug: string };
}

export default function CategoryPage({ params }: PageProps) {
  const category = params.slug.replace('-', ' ');
  const filtered = posts.filter((post) =>
    post.category.toLowerCase().includes(category.toLowerCase())
  );

  return (
    <div className="py-12">
      <Container>
        <h1 className="text-4xl font-semibold font-serif">Category: {category}</h1>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </div>
  );
}
