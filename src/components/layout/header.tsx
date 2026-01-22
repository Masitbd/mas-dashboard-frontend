"use client";

import Link from "next/link";
import { ChevronDown, Menu, PenSquare, Search, Sun } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleMobileMenu } from "@/features/ui/ui-slice";
import { Container } from "./container";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Button } from "rsuite";
import { NavLink } from "./Navlink";

const navLinks = [
  { label: "Homepages", href: "/", hasMenu: true },
  { label: "About", href: "/about" },
  { label: "Categories", href: "/categories", hasMenu: true },
  { label: "Pages", href: "/faq", hasMenu: true },
];

export function Header() {
  const dispatch = useAppDispatch();
  const isOpen = true; //useAppSelector((state) => state.ui.mobileMenuOpen);
  const { data } = useSession();

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur">
      <Container className="flex items-center justify-between py-6">
        <nav className="hidden items-center gap-8 text-xs font-medium text-secondary md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1"
            >
              {link.label}
              {link.hasMenu && <ChevronDown size={12} />}
            </Link>
          ))}
        </nav>
        <Link href="/" className="text-xl font-semibold">
          <span className="rounded bg-brand px-1 text-white">Note</span>Book.
        </Link>
        <div className="hidden items-center gap-5 text-sm text-secondary md:flex">
          <Link href="/search" className="flex items-center gap-2">
            <Search size={16} />
          </Link>
          <Link href="/write-on" className="flex items-center gap-2">
            <PenSquare size={16} />
          </Link>
          <Link href="/contact" className="text-xs font-medium">
            Contact
          </Link>
          <button
            type="button"
            className="flex items-center gap-1 text-xs font-medium"
          >
            En <ChevronDown size={12} />
          </button>
          <button
            type="button"
            aria-label="Toggle theme"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand"
          >
            <Sun size={14} />
          </button>
          {data?.user ? (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-full border border-border px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-secondary"
            >
              Sign out
            </button>
          ) : (
            <Button
              appearance="ghost"
              className="rounded-full border border-border px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-secondary !text-[#00a59b] !border-[#00a59b]"
              size="lg"
              as={NavLink}
              href="/login"
            >
              Sign in
            </Button>
          )}
        </div>
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => dispatch(toggleMobileMenu())}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden"
        >
          <Menu size={18} />
        </button>
      </Container>
      {isOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <Container className="flex flex-col gap-4 py-6 text-xs uppercase tracking-[0.2em] text-secondary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-[11px]"
            >
              <Search size={14} />
              Search
            </Link>
            <Link href="/write-on" className="inline-flex items-center gap-2">
              Write on Notebook
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
