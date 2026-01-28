"use client";

import { NavLink } from "@/components/layout/Navlink";
import { PostStatus, StatusTag } from "@/components/layout/Status";
import { confirmDeleteById } from "@/components/layout/SwalConfiramation";
import {
  useDeletePostMutation,
  useGetPostsPopulatedQuery,
} from "@/redux/api/posts/post.api";
import { Eye, Pencil, PencilLineIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button, ButtonToolbar, IconButton } from "rsuite";

export default function DashboardPostsPage() {
  const { data: postData } = useGetPostsPopulatedQuery({ page: 1, limit: 10 });
  const [deletePost, { isLoading: deleteLoading }] = useDeletePostMutation();

  const handleDelete = async (id: string | number) => {
    const result = await deletePost(id as string).unwrap();
    if (result?.success) {
      return result?.data;
    }
  };

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
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(postData?.data?.data || []).map((post) => (
              <tr key={post._id} className="border-b border-border">
                <td className="px-6 py-4 font-medium">{post.title}</td>
                <td className="px-6 py-4 text-secondary">
                  {post.category?.name}
                </td>
                <td className="px-6 py-4 text-secondary">
                  <StatusTag status={post.status as PostStatus} />
                </td>
                <td className="px-6 py-4">
                  <ButtonToolbar>
                    <IconButton
                      size="sm"
                      appearance="ghost"
                      aria-label="Update"
                      icon={<Pencil size={16} />}
                      as={NavLink}
                      href={`/dashboard/posts/${post._id}/edit`}
                    />
                    <IconButton
                      size="sm"
                      appearance="ghost"
                      aria-label="View"
                      icon={<Eye size={16} />}
                      as={Link}
                      href={`/dashboard/posts/${post._id}/view`}
                    />
                    <IconButton
                      size="sm"
                      appearance="ghost"
                      color="red"
                      aria-label="Delete"
                      icon={<Trash2 size={16} />}
                      onClick={async () =>
                        await confirmDeleteById(
                          post._id as string,
                          handleDelete,
                          {
                            successText: "Post has been deleted.",
                          },
                        )
                      }
                    />
                  </ButtonToolbar>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
