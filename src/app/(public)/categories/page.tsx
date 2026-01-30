"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { useGetCategoriesQuery } from "@/redux/api/categories/category.api";
import {
  Tag,
  Megaphone,
  LineChart,
  Briefcase,
  Cpu,
  Leaf,
  Camera,
  Shirt,
  UtensilsCrossed,
  Plane,
  HeartPulse,
  BookOpen,
  PenLine,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

type Category = {
  _id: string;
  name: string;
  description?: string;
  postCount?: number;
};

function getCategoryIcon(name: string) {
  const n = name.toLowerCase();

  if (/(marketing|brand|campaign|ads|advert)/.test(n)) return Megaphone;
  if (/(economics|economic|finance|money|market|trading)/.test(n))
    return LineChart;
  if (/(business|startup|entrepreneur|company|corporate)/.test(n))
    return Briefcase;
  if (/(tech|technology|ai|software|coding|computer|dev)/.test(n)) return Cpu;
  if (/(environment|nature|climate|eco|sustain)/.test(n)) return Leaf;
  if (/(photo|photography|camera)/.test(n)) return Camera;
  if (/(fashion|style|lifestyle)/.test(n)) return Shirt;
  if (/(food|recipe|cooking|kitchen)/.test(n)) return UtensilsCrossed;
  if (/(travel|holiday|trip|tour)/.test(n)) return Plane;
  if (/(health|medical|wellness|fitness)/.test(n)) return HeartPulse;
  if (/(book|reading|literature)/.test(n)) return BookOpen;
  if (/(writing|opinion|editorial|essay)/.test(n)) return PenLine;

  return Tag;
}

function CategoryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 animate-pulse rounded-2xl bg-accent" />
        <div className="flex-1">
          <div className="h-4 w-40 animate-pulse rounded bg-accent" />
          <div className="mt-3 h-3 w-full animate-pulse rounded bg-accent" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-accent" />
        </div>
      </div>
      <div className="mt-5 h-8 w-24 animate-pulse rounded-xl bg-accent" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-border bg-card p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent">
        <Sparkles className="text-primary" size={22} />
      </div>
      <p className="mt-4 text-lg font-semibold text-foreground">
        No categories found
      </p>
      <p className="mt-1 text-sm text-muted">
        Try changing the filters or create a new category from your dashboard.
      </p>
    </div>
  );
}

export default function CategoriesPage() {
  const {
    data: categoryData,
    isLoading,
    isFetching,
    isError,
  } = useGetCategoriesQuery({ limit: "100", page: "1" });

  // Works whether your API returns an array directly or wraps it in {data: []} / {categories: []}
  const categories: Category[] = (categoryData?.data?.data as Category[]) || [];

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold text-foreground">Categories</h1>
          <p className="mt-2 text-sm text-muted">
            Browse topics and find posts you’ll enjoy.{" "}
            {isFetching && !isLoading ? (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs text-secondary">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
                Updating
              </span>
            ) : null}
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))
          ) : isError ? (
            <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-10 text-center">
              <p className="text-lg font-semibold text-foreground">
                Couldn’t load categories
              </p>
              <p className="mt-2 text-sm text-muted">
                Please refresh the page or check your network connection.
              </p>
            </div>
          ) : categories.length === 0 ? (
            <div className="lg:col-span-3">
              <EmptyState />
            </div>
          ) : (
            categories.map((cat) => {
              const Icon = getCategoryIcon(cat.name);

              return (
                <Link
                  key={cat._id}
                  href={`/categories/${cat?.name?.toLowerCase().split(" ").join("-")}`} // change to `/category/${cat.slug}` if you use slugs
                  className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary ring-1 ring-border transition group-hover:bg-brand/10">
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-foreground">
                          {cat.name}
                        </p>
                        {cat.description ? (
                          <p className="mt-1 line-clamp-2 text-sm text-muted">
                            {cat.description}
                          </p>
                        ) : (
                          <p className="mt-1 text-sm text-muted">
                            Explore posts in this category.
                          </p>
                        )}
                      </div>
                    </div>

                    <ArrowUpRight
                      className="mt-1 shrink-0 text-muted transition group-hover:text-primary"
                      size={18}
                    />
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-xs font-medium text-secondary">
                      <Tag size={14} className="text-primary" />
                      View posts
                    </span>

                    {typeof cat.postCount === "number" ? (
                      <span className="text-xs text-muted">
                        {cat.postCount} posts
                      </span>
                    ) : null}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </Container>
    </div>
  );
}
