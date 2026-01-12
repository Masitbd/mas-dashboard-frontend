import { Container } from '@/components/layout/container';

export const metadata = {
  title: 'Terms'
};

export default function TermsPage() {
  return (
    <div className="py-12">
      <Container className="max-w-3xl space-y-4">
        <h1 className="text-4xl font-semibold font-serif">Terms of Service</h1>
        <p className="text-sm text-secondary">
          These terms are placeholders for the demo application.
        </p>
      </Container>
    </div>
  );
}
