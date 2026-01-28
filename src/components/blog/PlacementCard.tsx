"use client";

import React from "react";
import Swal from "sweetalert2";
import { Button, Message, Tag, useToaster } from "rsuite";
import { Sparkles, TrendingUp, LayoutGrid } from "lucide-react";
import { useChangePostPlacementMutation } from "@/redux/api/posts/post.api";

// ✅ Replace with your real mutation hook
// import { useUpdatePostPlacementMutation } from "@/redux/features/post/postApi";

type Placement = "general" | "featured" | "popular" | string;

type PostLike = {
  _id: string;
  title?: string;
  placement?: Placement; // ✅ add this field in your post model (or map it)
};

type Props = {
  post: PostLike;
  className?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const PLACEMENT_LABEL: Record<string, string> = {
  general: "General",
  featured: "Featured",
  popular: "Popular",
};

function placementPillClass(p?: Placement) {
  const v = (p || "general").toString().toLowerCase();
  if (v === "featured")
    return "bg-[var(--rs-primary-100)] text-[var(--rs-primary-800)] border-[var(--rs-primary-200)]";
  if (v === "popular")
    return "bg-[var(--accent)] text-[var(--secondary)] border-[var(--border)]";
  return "bg-white text-[var(--muted)] border-[var(--border)]";
}

function placementIcon(p?: Placement) {
  const v = (p || "general").toString().toLowerCase();
  if (v === "featured")
    return <Sparkles size={18} className="text-[var(--primary)]" />;
  if (v === "popular")
    return <TrendingUp size={18} className="text-[var(--primary)]" />;
  return <LayoutGrid size={18} className="text-[var(--primary)]" />;
}

// 🔁 SweetAlert2 button colors to match theme
const swalTheme = {
  confirmButtonColor: "#0a7f79",
  cancelButtonColor: "#4d5f5e",
};

export default function PostPlacementCard({ post, className }: Props) {
  const toaster = useToaster();
  const [updatePlacement] = useChangePostPlacementMutation();

  const current = (post?.placement || "general").toString().toLowerCase();

  const toast = (
    type: "info" | "success" | "warning" | "error",
    msg: string,
  ) => {
    toaster.push(
      <Message showIcon type={type} closable>
        {msg}
      </Message>,
      { placement: "topEnd", duration: 2600 },
    );
  };

  const getApiErrorMessage = (err: any) => {
    if (!err) return "Something went wrong.";
    if (typeof err === "string") return err;
    if (err?.data?.message) return err.data.message;
    if (err?.error) return err.error;
    return "Request failed. Please try again.";
  };

  const handleChangePlacement = async () => {
    const options: Record<string, string> = {
      general: "General",
      featured: "Featured",
      popular: "Popular",
    };

    // 1) Select placement popup
    const selectRes = await Swal.fire({
      title: "Post placement",
      text: "Select where this post should appear.",
      input: "select",
      inputOptions: options,
      inputValue: options[current] ? current : "general",
      showCancelButton: true,
      confirmButtonText: "Next",
      cancelButtonText: "Cancel",
      inputValidator: (value) => (!value ? "Please select a placement." : null),
      ...swalTheme,
    });

    if (!selectRes.isConfirmed) return;

    const next = (selectRes.value || "").toString().toLowerCase();
    if (!next || next === current) {
      toast("info", "No placement change selected.");
      return;
    }

    // 2) Confirm
    const confirmRes = await Swal.fire({
      title: "Confirm change",
      icon: "warning",
      html: `Move from <b>${PLACEMENT_LABEL[current] || current}</b> to <b>${
        PLACEMENT_LABEL[next] || next
      }</b>?`,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      focusCancel: true,
      ...swalTheme,
    });

    if (!confirmRes.isConfirmed) return;

    // 3) Loading + API call
    Swal.fire({
      title: "Updating placement…",
      text: "Please wait",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
      ...swalTheme,
    });

    try {
      // ✅ Adjust payload to your API contract
      // e.g. { id: post._id, placement: next }
      await updatePlacement({ id: post._id, placement: next }).unwrap();

      Swal.close();
      toast(
        "success",
        `Placement updated to "${PLACEMENT_LABEL[next] || next}".`,
      );
      // parent should refetch / cache-invalidate; this component stays modular
    } catch (err) {
      Swal.close();
      toast("error", getApiErrorMessage(err));
    }
  };

  return (
    <div
      className={cx(
        "rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {placementIcon(current)}
            <h3 className="text-sm font-semibold text-[var(--fg)]">
              Placement
            </h3>
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">
            Control where the post shows on the public site (home widgets /
            lists).
          </p>
        </div>

        <Button
          appearance="ghost"
          onClick={handleChangePlacement}
          className="!rounded-xl !border !border-[var(--border)] !bg-[var(--accent)] hover:!bg-white"
        >
          Change
        </Button>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-[var(--muted)]">Current placement</p>
            <p className="mt-1 truncate text-sm font-medium text-[var(--secondary)]">
              {post?.title || "Untitled post"}
            </p>
          </div>

          <Tag
            className={cx(
              "!rounded-full !border !px-3 !py-1 !text-xs !font-medium",
              placementPillClass(current),
            )}
          >
            {PLACEMENT_LABEL[current] || current}
          </Tag>
        </div>
      </div>
    </div>
  );
}
