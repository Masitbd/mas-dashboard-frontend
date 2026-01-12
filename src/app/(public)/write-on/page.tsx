import { Container } from '@/components/layout/container';

export default function WriteOnPage() {
  return (
    <div className="py-12">
      <Container className="space-y-16">
        <section className="rounded-2xl bg-accent p-10 text-center">
          <h1 className="text-3xl font-semibold">
            <span className="rounded bg-brand px-2 text-white">✎ Write On</span> Notebook
          </h1>
          <p className="mt-4 text-sm text-secondary">Write On Notebook Is Very Simple</p>
          <p className="mt-2 text-xs text-muted">
            Go to your mail and start typing your article with title & categories, attached your
            image/video file (if have).
          </p>
          <p className="mt-4 text-xs text-muted">
            Type your personal information. (Name, Occupation, Address, Social media links)
          </p>
          <p className="mt-3 text-xs text-muted">Send it on: blog.notebook@gmail.com</p>
          <button className="mt-6 rounded-full border border-brand px-6 py-2 text-xs font-semibold text-brand">
            Go To Your Mail
          </button>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold">
            <span className="rounded bg-brand px-2 text-white">How Can You Earn</span> By Writing
            On Medium
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-foreground">By Ad Revinue</p>
              <p className="mt-3 text-xs text-muted">
                Dynamically underwhelm integrated outsourcing via timely models. Rapidiously
                reconceptualize visionary imperatives without 24/365 catalysts for change.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">By Affiliate Programme</p>
              <p className="mt-3 text-xs text-muted">
                Dynamically underwhelm integrated outsourcing via timely models. Rapidiously
                reconceptualize visionary imperatives without 24/365 catalysts for change.
              </p>
            </div>
          </div>
          <div className="mt-10 text-sm font-semibold text-foreground">Want To Know More?</div>
          <button className="mt-3 text-xs text-brand">Go to FEQ Page →</button>
        </section>
      </Container>
    </div>
  );
}
