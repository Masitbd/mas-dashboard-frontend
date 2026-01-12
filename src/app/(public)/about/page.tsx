import { Container } from '@/components/layout/container';

export const metadata = {
  title: 'About'
};

export default function AboutPage() {
  return (
    <div className="py-12">
      <Container className="space-y-16">
        <section className="text-center">
          <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            <span className="rounded bg-brand px-2 text-white">Notebook</span> Is A Place Where You
            Can Find Your Perfect Blogs
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-sm text-secondary">
            Dynamically underwhelm integrated outsourcing via timely models. Rapidiously
            reconceptualize visionary imperatives without 24/365 catalysts for change.
          </p>
          <p className="mt-8 text-sm font-semibold text-foreground">The Best Ideas Can Change Who We Are.</p>
          <p className="mx-auto mt-3 max-w-xl text-xs text-muted">
            Dynamically underwhelm integrated outsourcing via timely models. Rapidiously
            reconceptualize visionary imperatives without 24/365 catalysts.
          </p>
        </section>

        <section className="text-center">
          <h2 className="text-lg font-semibold">
            <span className="rounded bg-brand px-2 py-1 text-xs uppercase tracking-[0.2em] text-white">
              We Are
            </span>{' '}
            Featured On
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-10 text-muted">
            <span className="text-sm font-semibold">Grammarly</span>
            <span className="text-sm font-semibold">Unsplash</span>
            <span className="text-sm font-semibold">WordPress</span>
            <span className="text-sm font-semibold">Medium</span>
            <span className="text-sm font-semibold">Blogger</span>
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={`h-1 w-6 rounded-full ${index === 2 ? 'bg-brand' : 'bg-border'}`}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              <span className="rounded bg-brand px-2 py-1 text-xs uppercase tracking-[0.2em] text-white">
                Meet
              </span>{' '}
              Our Authors
            </h2>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Maria Jenin', posts: 20 },
              { name: 'Asa Agarwal', posts: 13 },
              { name: 'Enna Lee', posts: 19 },
              { name: "Simon D'silva", posts: 7 },
              { name: "Simon D'silva", posts: 11 },
              { name: "Simon D'silva", posts: 23 }
            ].map((author) => (
              <div key={author.name} className="flex gap-4">
                <div className="h-20 w-20 rounded-lg bg-border" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{author.name}</p>
                  <p className="text-xs text-muted">{author.posts} Posts</p>
                  <p className="mt-2 text-xs text-brand">See details about author →</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-accent p-10 text-center">
          <h3 className="text-lg font-semibold text-foreground">Want To Write On Notebook?</h3>
          <p className="mt-3 text-xs text-muted">
            There have some simple steps. By following these steps you can be a regular author in
            Notebook.
          </p>
          <button className="mt-6 rounded-full border border-brand px-6 py-2 text-xs font-semibold text-brand">
            ✎ Write On Notebook
          </button>
        </section>
      </Container>
    </div>
  );
}
