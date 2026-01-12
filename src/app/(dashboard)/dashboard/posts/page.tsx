'use client';

import Link from 'next/link';
import { Button } from 'rsuite';
import { useGetPostsQuery } from '@/store/api';

export default function DashboardPostsPage() {
  const { data } = useGetPostsQuery({ page: '1', limit: '10' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <Button appearance="primary" as={Link} href="/dashboard/posts/new">
          New post
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-xs uppercase text-muted">
            <tr>
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Published</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data?.data || []).map((post) => (
              <tr key={post.id} className="border-b border-border">
                <td className="px-6 py-4 font-medium">{post.title}</td>
                <td className="px-6 py-4 text-secondary">{post.category}</td>
                <td className="px-6 py-4 text-secondary">{post.publishedAt}</td>
                <td className="px-6 py-4">
                  <Link href={`/dashboard/posts/${post.id}/edit`} className="text-xs text-primary">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
