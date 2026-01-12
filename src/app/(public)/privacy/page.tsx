import { Container } from '@/components/layout/container';

export const metadata = {
  title: 'Privacy'
};

export default function PrivacyPage() {
  return (
    <div className="py-12">
      <Container className="max-w-3xl space-y-4">
        <h1 className="text-4xl font-semibold font-serif">Privacy Policy</h1>
        <p className="text-sm text-secondary">
          We respect your privacy. This is a placeholder policy for the mock blog.
        </p>
      </Container>
    </div>
  );
}
