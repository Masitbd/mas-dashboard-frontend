"use client";

import { Container } from "@/components/layout/container";
import { Accordion } from "rsuite";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const faqs = [
  {
    question: "Is There Have Any Option For Write Blog?",
    answer:
      "Did you come here for something in particular or just general Riker-bashing? And blowing into maximum warp speed, you appeared for an instant.",
  },
  {
    question: "Can I Change My Plan Later?",
    answer:
      "Yes. You can update your plan anytime from your account settings. Changes will take effect from the next billing cycle.",
  },
  {
    question: "Did You Come Here For Something In Particular?",
    answer:
      "This FAQ helps users quickly find answers. If you need more help, reach out via the contact page.",
  },
  {
    question: "Is There Have Any Option For Write Blog?",
    answer:
      "Absolutely—create posts, manage drafts, and publish when ready. You can also organize posts by categories and tags.",
  },
  {
    question: "Something In Particular Or Just General Riker-Bashing?",
    answer:
      "If you can’t find what you’re looking for, contact support and we’ll help you out.",
  },
];

export default function FaqPage() {
  // keep first open by default (like your current UI)
  const [activeKey, setActiveKey] = useState<number | null>(0);

  return (
    <div className="py-12">
      <Container className="max-w-3xl">
        <div className="text-center">
          <h1 className="text-4xl font-semibold">
            <span className="rounded bg-brand px-2 text-white">Frequently</span>{" "}
            Asked Question
          </h1>
          <p className="mt-3 text-sm text-muted">
            Did you come here for something in particular or just general
            Riker-bashing? And blowing.
          </p>
        </div>

        <div className="mt-10">
          <Accordion
            bordered={false}
            activeKey={activeKey as any}
            onSelect={(key) => setActiveKey((key as number) ?? null)}
            className="space-y-4"
          >
            {faqs.map((faq, index) => {
              const isOpen = activeKey === index;

              return (
                <Accordion.Panel
                  key={`${faq.question}-${index}`}
                  eventKey={index}
                  header={
                    <div className="flex w-full items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-foreground">
                        {faq.question}
                      </p>
                      {isOpen ? (
                        <Minus size={16} className="text-brand" />
                      ) : (
                        <Plus size={16} className="text-brand" />
                      )}
                    </div>
                  }
                  className="rounded-2xl border border-border bg-accent"
                >
                  <div className="px-5 pb-5 pt-2">
                    <p className="text-xs text-secondary">
                      {faq.answer || "—"}
                    </p>
                  </div>
                </Accordion.Panel>
              );
            })}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm font-semibold text-foreground">
            Can&apos;t Find An Answer To Your Question?
          </p>

          <Link
            href="/contact"
            className="mt-4 inline-flex rounded-full border border-brand px-6 py-2 text-xs font-semibold text-brand hover:bg-accent"
          >
            Contact us →
          </Link>
        </div>
      </Container>
    </div>
  );
}
