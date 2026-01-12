import { Container } from '@/components/layout/container';

export default function ElementsPage() {
  return (
    <div className="py-12">
      <Container className="max-w-4xl space-y-10">
        <h1 className="text-3xl font-semibold">Elements</h1>

        <section className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Heading</p>
          <h1 className="text-2xl font-semibold">Heading H1 27px</h1>
          <h2 className="text-xl font-semibold">Heading H2 24px</h2>
          <h3 className="text-lg font-semibold">Heading H3 21px</h3>
          <h4 className="text-base font-semibold">Heading H4 19px</h4>
          <h5 className="text-sm font-semibold">Heading H5 17px</h5>
          <h6 className="text-xs font-semibold">Heading H6 15px</h6>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Paragraph</p>
          <p className="text-sm text-secondary">
            Did you come here for something in particular or just general Riker-bashing? And
            blowing into maximum warp speed, you appeared for an instant.
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Ordered List</p>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-secondary">
            <li>Ut enim ad minim veniam</li>
            <li>Quis nostrud exercitation</li>
            <li>Ullamco laboris nisi ut aliquip</li>
          </ol>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Buttons</p>
          <div className="flex gap-3">
            <button className="rounded bg-brand px-4 py-2 text-xs text-white">Button 1</button>
            <button className="rounded border border-brand px-4 py-2 text-xs text-brand">Button</button>
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Tag</p>
          <div className="flex gap-2">
            <span className="rounded border border-border px-3 py-1 text-xs">Tag1</span>
            <span className="rounded bg-brand px-3 py-1 text-xs text-white">Tag2</span>
            <span className="rounded border border-border px-3 py-1 text-xs">Tag3</span>
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Quote</p>
          <blockquote className="rounded-2xl bg-accent p-5 text-xs text-secondary">
            Did you come here for something in particular or just general Riker-bashing? And blowing
            into maximum warp speed.
          </blockquote>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Notice</p>
          <div className="space-y-3 text-xs text-secondary">
            <div className="rounded bg-accent p-3">This is a simple note.</div>
            <div className="rounded bg-blue-50 p-3">This is a simple tip.</div>
            <div className="rounded bg-green-50 p-3">This is a simple info.</div>
            <div className="rounded bg-red-50 p-3">This is a simple warning.</div>
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Table</p>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-center text-xs">
              <thead className="bg-accent text-xs">
                <tr>
                  <th className="py-2">First</th>
                  <th className="py-2">Last</th>
                  <th className="py-2">Handle</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index} className="border-t border-border">
                    <td className="py-2">Row{index + 1} Cell1</td>
                    <td className="py-2">Row{index + 1} Cell2</td>
                    <td className="py-2">Row{index + 1} Cell3</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Image</p>
          <div className="h-40 w-40 rounded bg-border" />
        </section>

        <section className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Youtube</p>
          <div className="flex h-52 items-center justify-center rounded bg-border text-xs text-muted">
            4k Scenic Relaxation Film
          </div>
        </section>
      </Container>
    </div>
  );
}
