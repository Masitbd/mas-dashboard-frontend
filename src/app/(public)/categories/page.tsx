import { Camera, HeartPulse, Leaf, Plane, Shirt, UtensilsCrossed, Cpu } from 'lucide-react';
import { Container } from '@/components/layout/container';

const categories = [
  { label: 'Environment & Nature', icon: Leaf },
  { label: 'Technology', icon: Cpu },
  { label: 'Lifestyle & Fashion', icon: Shirt },
  { label: 'Photography', icon: Camera },
  { label: 'Food', icon: UtensilsCrossed },
  { label: 'Holiday & Travel', icon: Plane, featured: true },
  { label: 'Healthcare', icon: HeartPulse }
];

export default function CategoriesPage() {
  return (
    <div className="py-12">
      <Container className="text-center">
        <h1 className="text-4xl font-semibold text-foreground">Categories</h1>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.label}
                className={`rounded-2xl border border-border p-6 text-center ${
                  category.featured ? 'bg-brand text-white' : 'bg-accent text-foreground'
                }`}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <Icon size={24} />
                </div>
                <p className="mt-4 text-sm font-semibold">{category.label}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
