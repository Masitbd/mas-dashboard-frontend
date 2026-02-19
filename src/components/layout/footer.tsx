"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Loader2, Twitter } from "lucide-react";
import { Message, useToaster } from "rsuite";

import { Container } from "./container";
import { useCreateNewsletterSubscriberMutation } from "@/redux/api/newsletter-subscriber/newsLetter-subscriber.api";

function isValidEmail(email: string) {
  // simple + reliable enough for UI validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function Footer() {
  const toaster = useToaster();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const [createSubscriber, { isLoading }] =
    useCreateNewsletterSubscriberMutation();

  const emailError = useMemo(() => {
    if (!touched) return null;
    const v = email.trim();
    if (!v) return "Email is required.";
    if (!isValidEmail(v)) return "Please enter a valid email address.";
    return null;
  }, [email, touched]);

  const canSubmit = useMemo(() => {
    const v = email.trim();
    return v.length > 0 && isValidEmail(v) && !isLoading;
  }, [email, isLoading]);

  const notify = (type: "success" | "error", text: string) => {
    toaster.push(
      <Message showIcon type={type} closable>
        {text}
      </Message>,
      { placement: "topEnd", duration: 3000 },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const v = email.trim();
    if (!v || !isValidEmail(v)) return;

    try {
      const res = await createSubscriber({
        email: v.toLowerCase(),
        subscribed: true,
      }).unwrap();

      notify("success", res?.message || "Subscribed successfully!");
      setEmail("");
      setTouched(false);
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Failed to subscribe. Please try again.";
      notify("error", msg);
    }
  };

  return (
    <footer className="border-t border-border bg-card">
      <Container className="grid gap-10 py-12 text-sm text-secondary md:grid-cols-[1.2fr,1fr,1fr,1.6fr]">
        <div className="space-y-3">
          <p className="text-lg font-semibold">
            <span className="rounded bg-brand px-1 text-white">Note</span>Book.
          </p>
          <p>
            Did you come here for something in particular or just general Riker
          </p>
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
          <p className="text-sm font-semibold text-foreground">
            Subscribe For Newsletter
          </p>

          <form onSubmit={handleSubmit} className="mt-3">
            <div
              className={[
                "flex items-center overflow-hidden rounded-lg border bg-white",
                emailError ? "border-red-400" : "border-border",
              ].join(" ")}
            >
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                disabled={isLoading}
                type="email"
                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none disabled:opacity-60"
                placeholder="Your Email"
                aria-label="Email address"
              />

              <button
                type="submit"
                disabled={!canSubmit}
                className="flex items-center justify-center gap-2 bg-brand px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>

            {emailError ? (
              <p className="mt-2 text-xs text-red-500">{emailError}</p>
            ) : (
              <p className="mt-2 text-xs text-muted">
                We’ll never share your email.
              </p>
            )}
          </form>

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
        Designed By Maruf Ahmed &amp; Developed By MasIt Solution
      </div>
    </footer>
  );
}
