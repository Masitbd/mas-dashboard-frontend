"use client";

import Link from "next/link";
import { ChevronDown, Menu, PenSquare, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleMobileMenu } from "@/features/ui/ui-slice";
import { Container } from "./container";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Button } from "rsuite";
import { NavLink } from "./Navlink";

const navLinks = [
  { label: "Homepages", href: "/", hasMenu: false },
  { label: "About", href: "/about" },
  { label: "Categories", href: "/categories", hasMenu: false },
  { label: "Faq", href: "/faq", hasMenu: false },
];

export function Header() {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useSession();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full",
        "transition-all duration-300",
        // Glass base (works even without backdrop-filter)
        "bg-card/60 supports-[backdrop-filter]:bg-card/35",
        "supports-[backdrop-filter]:backdrop-blur-xl",
        // Subtle border
        "border-b",
        scrolled ? "border-border/70" : "border-border/40",
        // Depth when scrolled
        scrolled ? "shadow-[0_10px_30px_rgba(0,0,0,0.08)]" : "shadow-none",
      ].join(" ")}
    >
      <Container className="flex items-center justify-between py-5">
        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-xs font-medium text-secondary md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "group flex items-center gap-1",
                "transition-colors",
                "hover:text-foreground",
              ].join(" ")}
            >
              <span className="relative">
                {link.label}
                <span
                  className={[
                    "pointer-events-none absolute -bottom-2 left-0 h-[1px] w-0",
                    "bg-brand/70 transition-all duration-300",
                    "group-hover:w-full",
                  ].join(" ")}
                />
              </span>
              {link.hasMenu && <ChevronDown size={12} className="opacity-70" />}
            </Link>
          ))}
        </nav>

        {/* Logo */}
        <Link href="/" className="text-xl font-semibold">
          <span className="rounded bg-brand px-1 text-white">Note</span>Book.
        </Link>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 text-sm text-secondary md:flex">
          <Link
            href="/search"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/40 supports-[backdrop-filter]:bg-card/25 supports-[backdrop-filter]:backdrop-blur-lg transition hover:text-foreground hover:border-border"
            aria-label="Search"
          >
            <Search size={16} />
          </Link>

          <Link
            href="/write-on"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/40 supports-[backdrop-filter]:bg-card/25 supports-[backdrop-filter]:backdrop-blur-lg transition hover:text-foreground hover:border-border"
            aria-label="Write"
          >
            <PenSquare size={16} />
          </Link>

          <Link
            href="/contact"
            className="text-xs font-medium hover:text-foreground transition"
          >
            Contact
          </Link>

          {/* <button
            type="button"
            aria-label="Toggle theme"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-brand/10 text-brand transition hover:bg-brand/15"
          >
            <Sun size={14} />
          </button> */}

          {data?.user ? (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className={[
                "rounded-full border px-4 py-2",
                "text-[11px] uppercase tracking-[0.2em]",
                "transition",
                "border-border/70 bg-card/40 supports-[backdrop-filter]:bg-card/25",
                "hover:border-border hover:text-foreground",
              ].join(" ")}
            >
              Sign out
            </button>
          ) : (
            <Button
              appearance="ghost"
              className="rounded-full border border-border/70 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-secondary !text-[#00a59b] !border-[#00a59b] hover:!bg-[#00a59b]/10"
              size="lg"
              as={NavLink}
              href="/login"
            >
              Sign in
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setIsOpen(!isOpen)}
          className={[
            "inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden",
            "border border-border/70",
            "bg-card/40 supports-[backdrop-filter]:bg-card/25 supports-[backdrop-filter]:backdrop-blur-lg",
            "transition hover:border-border",
          ].join(" ")}
        >
          <Menu size={18} />
        </button>
      </Container>

      {/* Mobile Menu (glass + smooth open) */}
      <div
        className={[
          "md:hidden overflow-hidden border-t",
          scrolled ? "border-border/70" : "border-border/40",
          "bg-card/50 supports-[backdrop-filter]:bg-card/30 supports-[backdrop-filter]:backdrop-blur-xl",
          "transition-[max-height,opacity] duration-300",
          isOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <Container className="flex flex-col gap-4 py-6 text-xs uppercase tracking-[0.2em] text-secondary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition"
              onClick={() => dispatch(toggleMobileMenu())}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-3 py-2 text-[11px] supports-[backdrop-filter]:bg-card/25 supports-[backdrop-filter]:backdrop-blur-lg transition hover:border-border hover:text-foreground"
            onClick={() => dispatch(toggleMobileMenu())}
          >
            <Search size={14} />
            Search
          </Link>

          <Link
            href="/write-on"
            className="inline-flex items-center gap-2 hover:text-foreground transition"
            onClick={() => dispatch(toggleMobileMenu())}
          >
            Write on Notebook
          </Link>
        </Container>
      </div>
    </header>
  );
}
