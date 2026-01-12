import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Container } from './container';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <Container className="grid gap-10 py-12 text-sm text-secondary md:grid-cols-[1.2fr,1fr,1fr,1.6fr]">
        <div className="space-y-3">
          <p className="text-lg font-semibold">
            <span className="rounded bg-brand px-1 text-white">Note</span>Book.
          </p>
          <p>Did you come here for something in particular or just general Riker</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Blogs</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Travel</li>
            <li>Technology</li>
            <li>Lifestyle</li>
            <li>Fashion</li>
            <li>Business</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/terms">Terms &amp; Conditions</Link>
            </li>
            <li>Support</li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Subscribe For Newsletter</p>
          <div className="mt-3 flex items-center overflow-hidden rounded-lg border border-border bg-white">
            <input
              className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
              placeholder="Your Email"
            />
            <button className="bg-brand px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white">
              Subscribe
            </button>
          </div>
          <div className="mt-4">
            <p className="text-sm font-semibold text-foreground">Follow On:</p>
            <div className="mt-2 flex gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded border border-border text-brand">
                <Twitter size={14} />
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded border border-border text-secondary">
                <Facebook size={14} />
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded border border-border text-secondary">
                <Linkedin size={14} />
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded border border-border text-secondary">
                <Instagram size={14} />
              </span>
            </div>
          </div>
        </div>
      </Container>
      <div className="border-t border-border py-6 text-center text-xs text-muted">
        Designed By Themefisher &amp; Developed By Gethugothemes
      </div>
    </footer>
  );
}
