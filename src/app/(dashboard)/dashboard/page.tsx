"use client";
import { posts, comments, subscribers } from "@/mock/posts";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Overview</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-xs uppercase text-muted">Posts</p>
          <p className="mt-2 text-3xl font-semibold">{posts.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-xs uppercase text-muted">Comments</p>
          <p className="mt-2 text-3xl font-semibold">{comments.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-xs uppercase text-muted">Subscribers</p>
          <p className="mt-2 text-3xl font-semibold">{subscribers.length}</p>
        </div>
      </div>
    </div>
  );
}
