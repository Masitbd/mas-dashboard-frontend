"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, IconButton, Message, Modal } from "rsuite";
import { Pencil } from "lucide-react";

/**
 * ✅ IMPORTANT:
 * Replace these imports/hooks with YOUR actual asset + profile RTK Query APIs.
 * Example names used here:
 * - useUploadAssetMutation: uploads image file, returns a URL
 * - useDeleteAssetByUrlMutation: deletes old asset by URL
 * - useUpdateMyProfileMutation: updates profile (avatarUrl)
 */
// TODO: adjust these imports to your project
import {
  useUploadAssetMutation,
  useDeleteAssetByUrlMutation,
} from "@/redux/api/assets/asset.api";
import { useUpdateMyOwnProfileMutation } from "@/redux/api/profile/profile.api";

type AvatarEditProps = {
  avatarUrl?: string | null;
  onUpdated?: (newUrl: string) => void;
  refetchProfile?: () => any; // pass refetch from useGetMyProfileQuery if you want
};

export function AvatarEdit({
  avatarUrl,
  onUpdated,
  refetchProfile,
}: AvatarEditProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  const [uploadAsset, { isLoading: uploading }] = useUploadAssetMutation();
  const [updateMyProfile, { isLoading: updating }] =
    useUpdateMyOwnProfileMutation();
  const [deleteByUrl, { isLoading: deleting }] = useDeleteAssetByUrlMutation();

  const busy = uploading || updating || deleting;

  const previewUrl = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return avatarUrl || null;
  }, [file, avatarUrl]);

  useEffect(() => {
    // cleanup object URL
    if (!file || !previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [file, previewUrl]);

  const close = () => {
    if (busy) return;
    setOpen(false);
    setFile(null);
    setLocalError(null);
    setLocalSuccess(null);
  };

  const handleSubmit = async () => {
    setLocalError(null);
    setLocalSuccess(null);

    if (!file) {
      setLocalError("Please choose an image first.");
      return;
    }

    try {
      // 1) upload new image
      const fd = new FormData();
      fd.append("file", file);

      // Expected upload response examples:
      // - { data: { url: "https://..." } }
      // - { url: "https://..." }
      const uploadRes = await uploadAsset({ file: file }).unwrap();
      const newUrl =
        uploadRes?.data?.url ||
        uploadRes?.data?.secureUrl ||
        uploadRes?.url ||
        uploadRes?.secureUrl;

      if (!newUrl) {
        throw new Error("Upload succeeded but no image URL was returned.");
      }

      // 2) update profile avatarUrl
      await updateMyProfile({ body: { avatarUrl: newUrl } } as any).unwrap();

      // 3) delete old image (best-effort, AFTER profile updated)
      if (avatarUrl && avatarUrl !== newUrl) {
        try {
          await deleteByUrl({ url: avatarUrl } as any).unwrap();
        } catch {
          // ignore delete failures (don’t block user)
        }
      }

      setLocalSuccess("Profile photo updated.");
      onUpdated?.(newUrl);
      if (refetchProfile) await refetchProfile();

      // auto close
      setTimeout(() => {
        close();
      }, 600);
    } catch (e: any) {
      setLocalError(
        e?.data?.message ||
          e?.error ||
          e?.message ||
          "Failed to update profile photo.",
      );
    }
  };

  return (
    <div className="relative inline-flex items-center justify-center overflow-visible">
      {/* Avatar circle (keeps image clipped) */}
      <div className="h-11 w-11 overflow-hidden rounded-full border border-border bg-muted flex items-center justify-center">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs text-secondary">—</span>
        )}
      </div>

      {/* Edit button OUTSIDE the avatar */}
      <IconButton
        size="xs"
        circle
        appearance="primary"
        icon={<Pencil size={12} />}
        onClick={() => setOpen(true)}
        aria-label="Edit avatar"
        className="
        !absolute -right-2 -top-2
        shadow
        ring-2 ring-white
        border border-border
      "
      />

      {/* Modal ... (keep your modal as-is) */}
      <Modal
        open={open}
        onClose={close}
        backdrop="static"
        keyboard={!busy}
        size="xs"
      >
        <Modal.Header>
          <Modal.Title>Change profile photo</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="space-y-4">
            {localError ? (
              <Message type="error" showIcon>
                {localError}
              </Message>
            ) : null}

            {localSuccess ? (
              <Message type="success" showIcon>
                {localSuccess}
              </Message>
            ) : null}

            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-full border border-border bg-muted flex items-center justify-center">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-secondary">No photo</span>
                )}
              </div>

              <div className="min-w-0">
                <div className="text-sm text-foreground font-medium">
                  Upload a new image
                </div>
                <div className="text-xs text-secondary">
                  JPG/PNG/WebP recommended. Square works best.
                </div>

                <input
                  type="file"
                  accept="image/*"
                  disabled={busy}
                  className="mt-2 block w-full text-sm"
                  onChange={(e) => {
                    setLocalError(null);
                    setLocalSuccess(null);
                    const f = e.target.files?.[0] ?? null;
                    setFile(f);
                  }}
                />
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          {/* two buttons: submit + close */}
          <Button
            appearance="primary"
            onClick={handleSubmit}
            loading={busy}
            disabled={busy}
          >
            Submit
          </Button>
          <Button onClick={close} disabled={busy}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
