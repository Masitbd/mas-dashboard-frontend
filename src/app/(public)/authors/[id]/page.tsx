import { Container } from '@/components/layout/container';
import { PostCard } from '@/components/blog/post-card';
import { posts } from '@/mock/posts';

interface PageProps {
  params: { id: string };
}

export default function AuthorPage({ params }: PageProps) {
  const filtered = posts.filter((post) => post.author.id === params.id);
  const author = filtered[0]?.author;

  return (
    <div className="py-12">
      <Container>
        <h1 className="text-4xl font-semibold font-serif">{author?.name || 'Author'}</h1>
        <p className="mt-2 text-sm text-secondary">{author?.bio}</p>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </div>
  );
}
