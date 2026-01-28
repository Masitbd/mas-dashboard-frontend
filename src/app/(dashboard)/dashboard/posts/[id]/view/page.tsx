"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  ButtonToolbar,
  Divider,
  IconButton,
  Message,
  Modal,
  Panel,
  Placeholder,
  Tag,
  useToaster,
} from "rsuite";
import {
  ArrowLeft,
  Clock3,
  Eye,
  Pencil,
  RefreshCw,
  Trash2,
  UserCircle2,
} from "lucide-react";
import { useGetPostByIdPopulatedQuery } from "@/redux/api/posts/post.api";

type PostStatus = "draft" | "published" | "archived" | string;

type Post = {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  category?: { _id: string; name: string } | null;
  tags?: Array<{ _id: string; name: string }>;
  author?: {
    _id: string;
    uuid?: string;
    name?: string;
    avatarUrl?: string;
  } | null;
  readingTime?: string;
  status?: PostStatus;
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function statusStyles(status?: PostStatus) {
  const s = (status || "draft").toLowerCase();
  if (s === "published")
    return "bg-[var(--rs-primary-100)] text-[var(--rs-primary-800)] border-[var(--rs-primary-200)]";
  if (s === "archived")
    return "bg-[var(--accent)] text-[var(--secondary)] border-[var(--border)]";
  // draft/default
  return "bg-white text-[var(--muted)] border-[var(--border)]";
}

function formatNumber(n?: number) {
  const v = typeof n === "number" ? n : 0;
  return v.toLocaleString();
}

function LoadingState() {
  return (
    <div className="min-h-[calc(100vh-24px)] bg-[var(--bg)] text-[var(--fg)]">
      <div className="mx-auto py-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="w-full md:w-[55%]">
              <Placeholder.Paragraph rows={1} active />
              <div className="mt-2 w-[70%]">
                <Placeholder.Paragraph rows={1} active />
              </div>
            </div>
            <div className="w-full md:w-[40%]">
              <Placeholder.Paragraph rows={1} active />
            </div>
          </div>

          <Divider className="!my-5" />

          <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
              <Placeholder.Graph active height={260} />
              <div className="mt-4">
                <Placeholder.Paragraph rows={5} active />
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
              <Placeholder.Paragraph rows={10} active />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPostViewPage() {
  const router = useRouter();
  const params = useParams();
  const postId =
    (Array.isArray((params as any)?.id)
      ? (params as any).id[0]
      : (params as any)?.id) ||
    (Array.isArray((params as any)?.slug)
      ? (params as any).slug[0]
      : (params as any)?.slug) ||
    "";
  const toaster = useToaster();

  const { data, isLoading, isError, error, refetch } =
    useGetPostByIdPopulatedQuery(postId, { skip: !postId });
  const post = data?.data as Post | undefined;

  // Demo-only state so your "Change Status" button looks real.
  const [demoStatus, setDemoStatus] = React.useState<PostStatus>("draft");
  React.useEffect(() => {
    if (post?.status) setDemoStatus(post.status);
  }, [post?.status]);

  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const toast = (
    type: "info" | "success" | "warning" | "error",
    msg: string,
  ) => {
    toaster.push(
      <Message showIcon type={type} closable>
        {msg}
      </Message>,
      { placement: "topEnd", duration: 2400 },
    );
  };

  if (isLoading) return <LoadingState />;

  if (isError || !post) {
    return (
      <div className="min-h-[calc(100vh-24px)] bg-[var(--bg)] text-[var(--fg)]">
        <div className="mx-auto py-10">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <Message showIcon type="error">
              Failed to load the post.{" "}
              {error ? "Check console / API error." : ""}
            </Message>
            <div className="mt-4 flex gap-2">
              <Button appearance="primary" onClick={() => refetch()}>
                Try again
              </Button>
              <Button appearance="subtle" onClick={() => router.back()}>
                Go back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const onBack = () => {
    router.back();
  };

  const onEdit = () => {
    router.push(`/dashboard/posts/${post._id}/edit`);
  };

  const onChangeStatus = () => {
    const current = (demoStatus || "draft").toLowerCase();
    const next =
      current === "draft"
        ? "published"
        : current === "published"
          ? "archived"
          : "draft";
    setDemoStatus(next);
    toast(
      "success",
      `Demo: Status changed to "${next}". (Wire mutation later)`,
    );
  };

  //   Handling delete post

  const onDelete = async () => {
    setDeleteOpen(false);
    toast("warning", "Demo: Delete requested. (Wire delete mutation later)");
  };

  return (
    <div className="min-h-[calc(100vh-24px)] bg-[var(--bg)] text-[var(--fg)]">
      <h1 className="text-2xl font-semibold my-3">View post</h1>
      <div className="mx-auto ">
        {/* Top card */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          {/* Header */}
          <div className="sticky top-0 z-10 rounded-t-2xl border-b border-[var(--border)] bg-[var(--card)]/90 p-4 backdrop-blur">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cx(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
                      statusStyles(demoStatus),
                    )}
                    title="Post status"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                    {(demoStatus || "draft").toString().toUpperCase()}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs text-[var(--muted)]">
                    <Eye size={14} />
                    {formatNumber(post.viewCount)} views
                  </span>

                  {post.readingTime ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs text-[var(--muted)]">
                      <Clock3 size={14} />
                      {post.readingTime}
                    </span>
                  ) : null}
                </div>

                <h1 className="mt-2 line-clamp-2 text-xl font-semibold leading-tight md:text-2xl">
                  {post.title}
                </h1>

                <p className="mt-1 line-clamp-1 text-sm text-[var(--muted)]">
                  <span className="font-medium text-[var(--secondary)]">
                    Slug:
                  </span>{" "}
                  <span className="font-mono">{post.slug}</span>
                </p>
              </div>

              <ButtonToolbar className="flex flex-wrap gap-2 md:justify-end">
                <IconButton
                  appearance="subtle"
                  icon={<ArrowLeft size={18} />}
                  onClick={onBack}
                  className="!rounded-xl !border !border-[var(--border)] !bg-white hover:!bg-[var(--accent)]"
                >
                  Back
                </IconButton>

                <Button
                  appearance="primary"
                  startIcon={<Pencil size={18} />}
                  onClick={onEdit}
                  className="!rounded-xl !bg-[var(--primary)] hover:!bg-[var(--rs-primary-700)]"
                >
                  Edit
                </Button>

                <Button
                  appearance="ghost"
                  startIcon={<RefreshCw size={18} />}
                  onClick={onChangeStatus}
                  className="!rounded-xl !border !border-[var(--border)] !bg-[var(--accent)] hover:!bg-white"
                >
                  Change status
                </Button>

                <Button
                  appearance="ghost"
                  startIcon={<Trash2 size={18} />}
                  onClick={() => setDeleteOpen(true)}
                  className="!rounded-xl !border !border-red-200 !bg-white hover:!bg-red-50 !text-red-600"
                >
                  Delete
                </Button>
              </ButtonToolbar>
            </div>
          </div>

          {/* Body */}
          <div className="grid gap-5 p-5 lg:grid-cols-[1.6fr_1fr]">
            {/* Main */}
            <div className="space-y-5">
              {/* Cover */}
              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
                {post.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-[240px] w-full object-cover md:h-[300px]"
                  />
                ) : (
                  <div className="flex h-[240px] items-center justify-center bg-[var(--accent)] text-[var(--muted)] md:h-[300px]">
                    No cover image
                  </div>
                )}

                <div className="p-4">
                  {post.excerpt ? (
                    <p className="text-sm leading-6 text-[var(--secondary)]">
                      {post.excerpt}
                    </p>
                  ) : (
                    <p className="text-sm text-[var(--muted)]">
                      No excerpt provided.
                    </p>
                  )}
                </div>
              </div>

              {/* Content */}
              <Panel
                bordered
                className="!rounded-2xl !border-[var(--border)] !bg-white"
                header={
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Post content</span>
                    <span className="text-xs text-[var(--muted)]">
                      (Rendered from HTML)
                    </span>
                  </div>
                }
              >
                <div
                  className={cx(
                    "text-[15px] leading-7 text-[var(--fg)]",
                    // lightweight “prose-like” styling without requiring typography plugin
                    "[&_p]:my-3 [&_strong]:font-semibold [&_em]:italic",
                    "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6",
                    "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6",
                    "[&_a]:text-[var(--primary)] [&_a]:underline",
                  )}
                  // NOTE: If your dashboard can contain untrusted HTML, sanitize before rendering.
                  dangerouslySetInnerHTML={{ __html: post.content || "" }}
                />
              </Panel>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <UserCircle2 size={18} className="text-[var(--primary)]" />
                  <h3 className="text-sm font-semibold">Author</h3>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--accent)]">
                    {post.author?.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.author.avatarUrl}
                        alt={post.author?.name || post.author?.uuid || "Author"}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--fg)]">
                      {post.author?.name || "Author"}
                    </p>
                    <p className="truncate text-xs text-[var(--muted)]">
                      {post.author?.uuid || post.author?._id || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold">Classification</h3>

                <div className="mt-3 space-y-4">
                  <div>
                    <p className="text-xs font-medium text-[var(--muted)]">
                      Category
                    </p>
                    <div className="mt-2">
                      {post.category?.name ? (
                        <Tag className="!rounded-full !border-[var(--border)] !bg-[var(--accent)] !text-[var(--secondary)]">
                          {post.category.name}
                        </Tag>
                      ) : (
                        <span className="text-sm text-[var(--muted)]">—</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-[var(--muted)]">
                      Tags
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {post.tags?.length ? (
                        post.tags.map((t) => (
                          <Tag
                            key={t._id}
                            className="!rounded-full !border-[var(--border)] !bg-white !text-[var(--secondary)]"
                          >
                            {t.name}
                          </Tag>
                        ))
                      ) : (
                        <span className="text-sm text-[var(--muted)]">—</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold">Details</h3>
                <dl className="mt-3 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[var(--muted)]">Post ID</dt>
                    <dd className="font-mono text-xs text-[var(--secondary)]">
                      {post._id}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[var(--muted)]">Slug</dt>
                    <dd className="font-mono text-xs text-[var(--secondary)]">
                      {post.slug}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[var(--muted)]">Status</dt>
                    <dd className="text-[var(--secondary)]">{demoStatus}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[var(--muted)]">Views</dt>
                    <dd className="text-[var(--secondary)]">
                      {formatNumber(post.viewCount)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Delete confirm modal */}
        <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} size="xs">
          <Modal.Header>
            <Modal.Title>Delete post?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-sm text-[var(--secondary)]">
              This is a demo dialog. Later you’ll call your delete mutation
              here.
            </p>
            <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--accent)] p-3">
              <p className="text-xs text-[var(--muted)]">Post</p>
              <p className="mt-1 text-sm font-medium">{post.title}</p>
              <p className="mt-1 text-xs text-[var(--muted)] font-mono">
                {post._id}
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button appearance="subtle" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button appearance="primary" color="red" onClick={onDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
