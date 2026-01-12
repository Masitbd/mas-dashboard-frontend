import { Container } from '@/components/layout/container';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'Is There Have Any Option For Write Blog?',
    answer:
      'Did you come here for something in particular or just general Riker-bashing? And blowing into maximum warp speed, you appeared for an instant.'
  },
  { question: 'Can I Change My Plan Later?' },
  { question: 'Did You Come Here For Something In Particular?' },
  { question: 'Is There Have Any Option For Write Blog?' },
  { question: 'Something In Particular Or Just General Riker-Bashing?' }
];

export default function FaqPage() {
  return (
    <div className="py-12">
      <Container className="max-w-3xl">
        <div className="text-center">
          <h1 className="text-4xl font-semibold">
            <span className="rounded bg-brand px-2 text-white">Frequently</span> Asked Question
          </h1>
          <p className="mt-3 text-sm text-muted">
            Did you come here for something in particular or just general Riker-bashing? And
            blowing.
          </p>
        </div>
        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.question} className="rounded-2xl bg-accent p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{faq.question}</p>
                {index === 0 ? <Minus size={16} className="text-brand" /> : <Plus size={16} className="text-brand" />}
              </div>
              {faq.answer && <p className="mt-3 text-xs text-secondary">{faq.answer}</p>}
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-sm font-semibold text-foreground">Can&apos;t Find An Answer To Your Question?</p>
          <button className="mt-4 rounded-full border border-brand px-6 py-2 text-xs font-semibold text-brand">
            Contact us →
          </button>
        </div>
      </Container>
    </div>
  );
}
