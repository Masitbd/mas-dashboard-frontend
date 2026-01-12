import { Container } from '@/components/layout/container';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Container className="py-16">{children}</Container>
    </div>
  );
}
