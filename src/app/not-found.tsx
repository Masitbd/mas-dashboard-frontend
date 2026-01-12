import Link from 'next/link';
import { Container } from '@/components/layout/container';

export default function NotFound() {
  return (
    <div className="py-20">
      <Container className="max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">404</p>
        <h1 className="mt-4 text-4xl font-semibold font-serif">Page not found</h1>
        <p className="mt-4 text-sm text-secondary">
          The page you are looking for doesn&apos;t exist. Let&apos;s get you back home.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full border border-border px-6 py-2 text-xs"
        >
          Back to home
        </Link>
      </Container>
    </div>
  );
}
