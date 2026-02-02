"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Button,
  ButtonToolbar,
  IconButton,
  Input,
  InputGroup,
  SelectPicker,
  Pagination,
  Loader,
} from "rsuite";
import { Eye, Pencil, Trash2, Search, X } from "lucide-react";

import { NavLink } from "@/components/layout/Navlink";
import { PostStatus, StatusTag } from "@/components/layout/Status";
import { confirmDeleteById } from "@/components/layout/SwalConfiramation";
import {
  useDeletePostMutation,
  useGetPostsPopulatedQuery,
} from "@/redux/api/posts/post.api";

// ✅ Adjust these imports if your project uses different paths/names
import { useGetCategoriesQuery } from "@/redux/api/categories/category.api";
import { useGetUserListQuery } from "@/redux/api/users/user.api";
import { useGetTagsQuery } from "@/redux/api/tags/tags.api";

function useDebouncedValue<T>(value: T, delay = 450) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function DashboardPostsPage() {
  const session = useSession();

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // filters + search
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebouncedValue(searchText, 450);

  const [authorId, setAuthorId] = useState<string | null>(null);
  const [status, setStatus] = useState<PostStatus | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [tagId, setTagId] = useState<string | null>(null);

  // keep existing behavior: default author = logged-in user, but allow changing via filter
  const authorTouchedRef = useRef(false);
  useEffect(() => {
    const me = session?.data?.user?._id as string | undefined;
    if (!authorTouchedRef.current && me && authorId === null) {
      setAuthorId(me);
    }
  }, [session?.data?.user?._id, authorId]);

  // whenever search/filters/limit changes -> reset to page 1
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchText, authorId, status, categoryId, tagId, limit]);

  const query = useMemo(() => {
    const q: Record<string, any> = { page, limit };

    const s = debouncedSearchText?.trim();
    if (s) q.searchTerm = s; // <-- rename if your api expects "search" or "q"

    if (session?.data?.user?.role !== "admin") {
      if (authorId) q.author = authorId;
    }

    if (status) q.status = status;
    if (categoryId) q.category = categoryId;
    if (tagId) q.tag = tagId; // <-- rename if your api expects "tags" etc.

    return q;
  }, [page, limit, debouncedSearchText, authorId, status, categoryId, tagId]);

  console.log(query);
  const {
    data: postData,
    isLoading: postsLoading,
    isFetching: postsFetching,
  } = useGetPostsPopulatedQuery(query);

  const [deletePost] = useDeletePostMutation();

  const handleDelete = async (id: string | number) => {
    const result = await deletePost(id as string).unwrap();
    if (result?.success) return result?.data;
  };

  // Fetch filter lists (adjust to your actual response shapes if needed)
  const { data: categoryData } = useGetCategoriesQuery({
    page: 1 as unknown as string,
    limit: 100 as unknown as string,
  });

  const { data: userListData } = useGetUserListQuery({
    page: "1",
    limit: "200",
  });

  const { data: tagsData } = useGetTagsQuery({
    page: 1 as unknown as string,
    limit: 100 as unknown as string,
  });

  const categoryOptions = useMemo(() => {
    const rows = categoryData?.data?.data ?? categoryData?.data ?? [];
    return (rows || []).map((c: any) => ({ label: c?.name, value: c?._id }));
  }, [categoryData]);

  const authorOptions = useMemo(() => {
    const rows = userListData?.data?.data ?? userListData?.data ?? [];
    return (rows || []).map((u: any) => ({
      label: u?.name || u?.email || u?.uuid,
      value: u?._id || u?.uuid,
    }));
  }, [userListData]);

  const tagOptions = useMemo(() => {
    const rows = tagsData?.data?.data ?? tagsData?.data ?? [];
    return (rows || []).map((t: any) => ({ label: t?.name, value: t?._id }));
  }, [tagsData]);

  const statusOptions = useMemo(
    () =>
      (["draft", "published", "archived"] as PostStatus[]).map((s) => ({
        label: s.charAt(0).toUpperCase() + s.slice(1),
        value: s,
      })),
    [],
  );

  const posts = postData?.data?.data ?? postData?.data ?? [];
  const meta = postData?.data?.meta ?? postData?.meta ?? {};
  const total =
    meta?.total ??
    meta?.totalData ??
    meta?.count ??
    (Array.isArray(posts) ? posts.length : 0);

  const clearFilters = () => {
    setSearchText("");
    setStatus(null);
    setCategoryId(null);
    setTagId(null);

    // keep your original behavior: default back to "my posts"
    const me = session?.data?.user?._id as string | undefined;
    setAuthorId(me ?? null);
    authorTouchedRef.current = false;
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <Button appearance="primary" as={Link} href="/dashboard/posts/new">
          New post
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
          {/* Search */}
          <div className="md:col-span-4">
            <InputGroup inside className="w-full">
              <InputGroup.Addon>
                <Search size={16} />
              </InputGroup.Addon>
              <Input
                value={searchText}
                onChange={(v) => setSearchText(String(v))}
                placeholder="Search posts by title, excerpt, content..."
              />
              {searchText ? (
                <InputGroup.Button
                  onClick={() => setSearchText("")}
                  title="Clear"
                >
                  <X size={16} />
                </InputGroup.Button>
              ) : null}
            </InputGroup>
          </div>

          {/* Author */}
          <div className="md:col-span-2">
            <SelectPicker
              cleanable
              searchable
              block
              placeholder="Author"
              data={authorOptions}
              value={authorId || undefined}
              onChange={(val) => {
                authorTouchedRef.current = true;
                setAuthorId((val as string) ?? null);
              }}
            />
          </div>

          {/* Status */}
          <div className="md:col-span-2">
            <SelectPicker
              cleanable
              searchable={false}
              block
              placeholder="Status"
              data={statusOptions}
              value={status || undefined}
              onChange={(val) => setStatus((val as PostStatus) ?? null)}
            />
          </div>

          {/* Category */}
          <div className="md:col-span-2">
            <SelectPicker
              cleanable
              searchable
              block
              placeholder="Category"
              data={categoryOptions}
              value={categoryId || undefined}
              onChange={(val) => setCategoryId((val as string) ?? null)}
            />
          </div>

          {/* Tag */}
          <div className="md:col-span-2">
            <SelectPicker
              cleanable
              searchable
              block
              placeholder="Tag"
              data={tagOptions}
              value={tagId || undefined}
              onChange={(val) => setTagId((val as string) ?? null)}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-muted">
            {postsFetching ? "Updating..." : " "}
          </div>
          <Button appearance="ghost" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {postsLoading ? (
          <div className="flex items-center gap-2 p-6 text-secondary">
            <Loader size="sm" />
            Loading posts...
          </div>
        ) : (
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
              {(posts || []).map((post: any) => (
                <tr key={post._id} className="border-b border-border">
                  <td className="px-6 py-4 font-medium">{post.title}</td>
                  <td className="px-6 py-4 text-secondary">
                    {post.category?.name ?? "-"}
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

              {!posts?.length ? (
                <tr>
                  <td className="px-6 py-8 text-secondary" colSpan={4}>
                    No posts found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end">
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          activePage={page}
          onChangePage={setPage}
          total={Number(total) || 0}
          limit={limit}
          limitOptions={[10, 20, 30, 50]}
          onChangeLimit={(newLimit) => setLimit(Number(newLimit))}
          layout={["total", "-", "limit", "|", "pager", "skip"]}
        />
      </div>
    </div>
  );
}
