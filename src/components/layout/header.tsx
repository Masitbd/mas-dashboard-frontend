"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, PenSquare, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Container } from "./container";
import { useSession, signOut } from "next-auth/react";
import { Button } from "rsuite";
import { NavLink } from "./Navlink";

const navLinks = [
  { label: "Homepages", href: "/", hasMenu: false },
  { label: "About", href: "/about" },
  { label: "Categories", href: "/categories", hasMenu: false },
  { label: "Faq", href: "/faq", hasMenu: false },
];

function getInitials(name?: string | null) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data } = useSession();

  const [scrolled, setScrolled] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

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

  // close dropdown on outside click / esc
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const user = data?.user as
    | { name?: string | null; image?: string | null }
    | undefined;

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full",
        "transition-all duration-300",
        "bg-card/60 supports-[backdrop-filter]:bg-card/35",
        "supports-[backdrop-filter]:backdrop-blur-xl",
        "border-b",
        scrolled ? "border-border/70" : "border-border/40",
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
              className="group flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <span className="relative">
                {link.label}
                <span className="pointer-events-none absolute -bottom-2 left-0 h-[1px] w-0 bg-brand/70 transition-all duration-300 group-hover:w-full" />
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

          {data?.user?.role == "admin" ||
          data?.user?.role == "super-admin" ||
          data?.user?.role == "editor" ? (
            <Link
              href="/dashboard/posts"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/40 supports-[backdrop-filter]:bg-card/25 supports-[backdrop-filter]:backdrop-blur-lg transition hover:text-foreground hover:border-border"
              aria-label="Write"
            >
              <PenSquare size={16} />
            </Link>
          ) : (
            <></>
          )}

          <Link
            href="/contact"
            className="text-xs font-medium hover:text-foreground transition"
          >
            Contact
          </Link>

          {/* Auth area */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className={[
                  "group inline-flex items-center gap-2",
                  "rounded-full border border-border/70",
                  "bg-card/40 supports-[backdrop-filter]:bg-card/25 supports-[backdrop-filter]:backdrop-blur-lg",
                  "px-2 py-1.5 transition hover:border-border",
                ].join(" ")}
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                <span className="relative h-8 w-8 overflow-hidden rounded-full border border-border bg-accent">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name ?? "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-brand">
                      {getInitials(user.name)}
                    </span>
                  )}
                </span>

                <ChevronDown
                  size={14}
                  className={[
                    "opacity-70 transition-transform",
                    profileOpen ? "rotate-180" : "rotate-0",
                  ].join(" ")}
                />
              </button>

              {/* Dropdown (white bg) */}
              <div
                className={[
                  "absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-border",
                  "bg-white",
                  "shadow-[0_18px_45px_rgba(0,0,0,0.12)]",
                  "transition-[transform,opacity] duration-200",
                  profileOpen
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0",
                ].join(" ")}
              >
                <div className="border-b border-border/60 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
                    Signed in as
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-foreground">
                    {user.name ?? "User"}
                  </p>
                </div>

                <div className="p-2">
                  <Link
                    href="/profile"
                    className="block rounded-xl px-3 py-2 text-sm text-secondary transition hover:bg-accent hover:text-foreground"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm text-secondary transition hover:bg-accent hover:text-foreground"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                appearance="ghost"
                className="rounded-full border border-border/70 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-secondary !text-[#00a59b] !border-[#00a59b] hover:!bg-[#00a59b]/10"
                size="lg"
                as={NavLink}
                href="/login"
              >
                Sign in / Register
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
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

      {/* Mobile Menu */}
      <div
        className={[
          "md:hidden overflow-hidden border-t",
          scrolled ? "border-border/70" : "border-border/40",
          "bg-card/50 supports-[backdrop-filter]:bg-card/30 supports-[backdrop-filter]:backdrop-blur-xl",
          "transition-[max-height,opacity] duration-300",
          mobileOpen ? "max-h-[560px] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <Container className="flex flex-col gap-4 py-6 text-xs uppercase tracking-[0.2em] text-secondary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-3 py-2 text-[11px] supports-[backdrop-filter]:bg-card/25 supports-[backdrop-filter]:backdrop-blur-lg transition hover:border-border hover:text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            <Search size={14} />
            Search
          </Link>

          {data?.user?.role == "admin" ||
          data?.user?.role == "super-admin" ||
          data?.user?.role == "editor" ? (
            <Link
              href="/dashboard/posts"
              className="inline-flex items-center gap-2 hover:text-foreground transition"
              onClick={() => setMobileOpen(false)}
            >
              Write on Notebook
            </Link>
          ) : (
            <></>
          )}

          {/* Mobile Auth */}
          <div className="pt-2">
            {user ? (
              <div className="rounded-2xl border border-border/70 bg-card/40 p-4 supports-[backdrop-filter]:bg-card/25 supports-[backdrop-filter]:backdrop-blur-lg">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
                  Signed in as
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {user.name ?? "User"}
                </p>

                <div className="mt-4 grid gap-2">
                  <Link
                    href="/profile"
                    className="rounded-xl border border-border/70 bg-accent px-4 py-2 text-center text-[11px] tracking-[0.2em] text-secondary transition hover:bg-card hover:text-foreground"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="rounded-xl border border-border/70 bg-accent px-4 py-2 text-[11px] tracking-[0.2em] text-secondary transition hover:bg-card hover:text-foreground"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-2">
                <Button
                  appearance="ghost"
                  className="w-full rounded-full border border-border/70 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-secondary !text-[#00a59b] !border-[#00a59b] hover:!bg-[#00a59b]/10"
                  size="lg"
                  as={NavLink}
                  href="/login"
                >
                  Sign in
                </Button>

                <Link
                  href="/register"
                  className="w-full rounded-full border border-border/70 bg-card/40 px-4 py-2 text-center text-[11px] uppercase tracking-[0.2em] text-secondary transition hover:text-foreground supports-[backdrop-filter]:bg-card/25 supports-[backdrop-filter]:backdrop-blur-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </Container>
      </div>
    </header>
  );
}
