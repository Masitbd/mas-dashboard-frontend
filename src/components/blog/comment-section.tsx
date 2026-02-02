"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Form,
  Link,
  Message,
  Modal,
  Placeholder,
  Textarea,
} from "rsuite";
import { useSession } from "next-auth/react";
import { Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsByPostQuery,
  useUpdateCommentMutation,
} from "@/redux/api/comments/comment.api";

type UiComment = {
  _id: string;
  content: string;
  createdAt: string;
  status?: string;
  repliesCount?: number;
  authorName?: string;
  authorUuid?: string | null;
};

type EditState = {
  open: boolean;
  id: string | null;
  content: string;
};

const PRIMARY = "#0a7f79";

export function CommentSection({ postId }: { postId: string }) {
  const session = useSession();
  const sessionUuid = (session?.data?.user as any)?.uuid as string | undefined;

  const [formValue, setFormValue] = useState<{ message: string }>({
    message: "",
  });

  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  const [edit, setEdit] = useState<EditState>({
    open: false,
    id: null,
    content: "",
  });

  const [editError, setEditError] = useState<string | null>(null);

  const {
    data: commentsRes,
    isLoading,
    isFetching,
    error: listError,
    refetch,
  } = useGetCommentsByPostQuery(
    {
      postId,
      page: 1,
      limit: 50,
      includeReplies: false,
      sortOrder: "asc",
    },
    { skip: !postId },
  );

  const [createComment, { isLoading: creating }] = useCreateCommentMutation();
  const [updateComment, { isLoading: updating }] = useUpdateCommentMutation();
  const [deleteComment, { isLoading: deleting }] = useDeleteCommentMutation();

  const { comments, total } = useMemo(() => {
    const raw: any = commentsRes;

    const payload =
      raw?.data?.data && Array.isArray(raw?.data?.data)
        ? raw?.data
        : raw?.data?.data?.data && Array.isArray(raw?.data?.data?.data)
          ? raw?.data?.data
          : raw?.data && Array.isArray(raw?.data)
            ? { data: raw?.data, meta: null }
            : raw?.data?.data && Array.isArray(raw?.data?.data)
              ? raw?.data
              : raw?.data?.data?.data
                ? raw?.data?.data
                : null;

    const list =
      raw?.data?.data?.data ??
      raw?.data?.data ??
      raw?.data ??
      payload?.data ??
      [];

    const meta =
      raw?.data?.data?.meta ?? raw?.data?.meta ?? payload?.meta ?? null;

    const normalized: UiComment[] = (list || []).map((c: any) => ({
      _id: c?._id,
      content: c?.content ?? "",
      createdAt: c?.createdAt,
      status: c?.status,
      repliesCount: c?.repliesCount,
      authorName:
        c?.author?.displayName ||
        c?.author?.name ||
        c?.author?.username ||
        "Anonymous",
      authorUuid: c?.author?.uuid ?? null,
    }));

    return {
      comments: normalized,
      total: meta?.total ?? normalized.length ?? 0,
    };
  }, [commentsRes]);

  const showLoading = isLoading || isFetching;

  const canEdit = (c: UiComment) =>
    !!sessionUuid && !!c.authorUuid && sessionUuid === c.authorUuid;

  const openEdit = (c: UiComment) => {
    setEditError(null);
    setEdit({ open: true, id: c._id, content: c.content || "" });
  };

  const closeEdit = () => {
    setEdit({ open: false, id: null, content: "" });
    setEditError(null);
  };

  const handleSubmit = async () => {
    setLocalError(null);
    setLocalSuccess(null);

    const message = (formValue.message || "").trim();
    if (!message) {
      setLocalError("Please write a comment first.");
      return;
    }

    try {
      await createComment({ postId, content: message }).unwrap();
      setFormValue({ message: "" });
      setLocalSuccess("Comment submitted! It may appear after approval.");
      refetch();
      setTimeout(() => setLocalSuccess(null), 2500);
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.error ||
        "Failed to submit comment. Please try again.";
      setLocalError(msg);
    }
  };

  const handleUpdate = async () => {
    setEditError(null);

    const content = (edit.content || "").trim();
    if (!edit.id) return;

    if (!content) {
      setEditError("Comment cannot be empty.");
      return;
    }

    const confirm = await Swal.fire({
      title: "Update comment?",
      text: "Your changes will be saved.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
      cancelButtonText: "Cancel",
      confirmButtonColor: PRIMARY,
      focusCancel: true,
    });

    if (!confirm.isConfirmed) return;

    Swal.fire({
      title: "Updating...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
      confirmButtonColor: PRIMARY,
    });

    try {
      await updateComment({ id: edit.id, content }).unwrap();
      Swal.close();
      await Swal.fire({
        title: "Updated!",
        text: "Your comment has been updated.",
        icon: "success",
        confirmButtonColor: PRIMARY,
        timer: 1200,
        showConfirmButton: false,
      });
      refetch();
      closeEdit();
    } catch (err: any) {
      Swal.close();
      const msg =
        err?.data?.message ||
        err?.error ||
        "Failed to update comment. Please try again.";
      setEditError(msg);
      await Swal.fire({
        title: "Update failed",
        text: msg,
        icon: "error",
        confirmButtonColor: PRIMARY,
      });
    }
  };

  const handleDelete = async (id: string) => {
    setLocalError(null);
    setLocalSuccess(null);

    const confirm = await Swal.fire({
      title: "Delete comment?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      focusCancel: true,
    });

    if (!confirm.isConfirmed) return;

    Swal.fire({
      title: "Deleting...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await deleteComment(id).unwrap();
      Swal.close();
      await Swal.fire({
        title: "Deleted!",
        text: "Your comment has been deleted.",
        icon: "success",
        confirmButtonColor: PRIMARY,
        timer: 1200,
        showConfirmButton: false,
      });
      refetch();
    } catch (err: any) {
      Swal.close();
      const msg =
        err?.data?.message ||
        err?.error ||
        "Failed to delete comment. Please try again.";
      setLocalError(msg);
      await Swal.fire({
        title: "Delete failed",
        text: msg,
        icon: "error",
        confirmButtonColor: PRIMARY,
      });
    }
  };

  return (
    <>
      <section className="mt-12 border-t border-border pt-8">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl font-semibold font-serif">
            Comments{typeof total === "number" ? ` (${total})` : ""}
          </h3>

          <Button
            appearance="ghost"
            size="xs"
            className="text-xs uppercase tracking-[0.2em]"
            onClick={() => refetch()}
            disabled={showLoading}
          >
            Refresh
          </Button>
        </div>

        {localError ? (
          <Message className="mt-4" type="error" bordered>
            {localError}
          </Message>
        ) : null}

        {localSuccess ? (
          <Message className="mt-4" type="success" bordered>
            {localSuccess}
          </Message>
        ) : null}

        <div className="mt-6 space-y-6">
          {showLoading ? (
            <div className="rounded-lg border border-border bg-card p-4">
              <Placeholder.Paragraph rows={3} active />
            </div>
          ) : listError ? (
            <Message type="error" bordered>
              Failed to load comments.
            </Message>
          ) : comments.length === 0 ? (
            <p className="text-sm text-muted">
              No comments yet. Be the first to share your thoughts.
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="rounded-lg border border-border bg-card p-4"
              >
                {/* Header row (name/date left, actions right) */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {comment.authorName}
                    </p>
                    <p className="text-xs text-muted">
                      {comment.createdAt
                        ? new Date(comment.createdAt).toLocaleDateString()
                        : ""}
                      {typeof comment.repliesCount === "number" &&
                      comment.repliesCount > 0
                        ? ` • ${comment.repliesCount} repl${
                            comment.repliesCount === 1 ? "y" : "ies"
                          }`
                        : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {comment.status && comment.status !== "approved" ? (
                      <span className="text-[10px] uppercase tracking-[0.18em] text-muted">
                        {comment.status}
                      </span>
                    ) : null}

                    {canEdit(comment) ? (
                      <div className="flex items-center gap-1">
                        <Button
                          appearance="subtle"
                          size="xs"
                          onClick={() => openEdit(comment)}
                          className="!p-1"
                          disabled={updating || deleting}
                        >
                          <Pencil size={16} />
                        </Button>

                        <Button
                          appearance="subtle"
                          size="xs"
                          onClick={() => handleDelete(comment._id)}
                          className="!p-1"
                          disabled={deleting || updating}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>

                <p className="mt-2 text-sm text-secondary whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          {session?.data?.user?._id ? (
            <>
              <h4 className="text-lg font-semibold font-serif">
                Leave a comment
              </h4>

              <Form
                fluid
                formValue={formValue}
                onChange={(v: any) => setFormValue(v)}
                className="mt-4"
              >
                <Form.Group controlId="message">
                  <Form.ControlLabel>Message</Form.ControlLabel>
                  <Form.Control
                    name="message"
                    rows={4}
                    accepter={Textarea}
                    placeholder="Write your thoughts..."
                    disabled={creating}
                  />
                </Form.Group>

                <Button
                  appearance="primary"
                  className="mt-4 text-xs uppercase tracking-[0.2em]"
                  onClick={handleSubmit}
                  loading={creating}
                  disabled={creating}
                >
                  Submit comment
                </Button>
              </Form>

              <p className="mt-3 text-xs text-muted">
                Your comment may be reviewed before it appears publicly.
              </p>
            </>
          ) : (
            <h2 className="text-sm text-secondary">
              <Link className="text-[color:var(--primary)]" href="/login">
                Login
              </Link>{" "}
              or{" "}
              <Link className="text-[color:var(--primary)]" href="/sign-up">
                Register
              </Link>{" "}
              to comment
            </h2>
          )}
        </div>
      </section>

      {/* EDIT MODAL */}
      <Modal open={edit.open} onClose={closeEdit} size="sm">
        <Modal.Header>
          <Modal.Title className="font-serif">Edit comment</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {editError ? (
            <Message type="error" bordered className="mb-4">
              {editError}
            </Message>
          ) : null}

          <Form fluid formValue={{ content: edit.content }}>
            <Form.Group controlId="content">
              <Form.ControlLabel>Comment</Form.ControlLabel>
              <Form.Control
                name="content"
                accepter={Textarea}
                rows={5}
                value={edit.content}
                onChange={(val) =>
                  setEdit((prev) => ({ ...prev, content: String(val) }))
                }
                disabled={updating}
                placeholder="Update your comment..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button appearance="subtle" onClick={closeEdit} disabled={updating}>
            Cancel
          </Button>
          <Button
            appearance="primary"
            onClick={handleUpdate}
            loading={updating}
            disabled={updating}
          >
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
