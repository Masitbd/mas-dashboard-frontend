"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Form,
  Message,
  SelectPicker,
  TagPicker,
  Textarea,
  useToaster,
} from "rsuite";
import { PostEditor } from "@/components/blog/post-editor";
import {
  useGetPostByIdQuery,
  useUpdatePostMutation,
} from "@/redux/api/posts/post.api";
import { useGetCategoriesQuery } from "@/redux/api/categories/category.api";
import { useGetTagsQuery } from "@/redux/api/tags/tags.api";
import {
  useUploadAssetMutation,
  useDeleteAssetMutation,
  useDeleteAssetByUrlMutation,
} from "@/redux/api/assets/asset.api";
import { useRouter } from "next/navigation";

interface PageProps {
  params: { id: string };
}

type LocalImage = {
  file: File;
  localUrl: string; // blob url
};

function getErrorMessage(err: unknown): string {
  const anyErr = err as any;
  return (
    anyErr?.data?.message ||
    anyErr?.error ||
    anyErr?.message ||
    "Something went wrong."
  );
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function extractImgSrcs(html: string): string[] {
  if (!html) return [];
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return Array.from(doc.querySelectorAll("img"))
      .map((img) => img.getAttribute("src"))
      .filter(Boolean) as string[];
  } catch {
    return [];
  }
}

function replaceImgSrcs(html: string, map: Record<string, string>): string {
  if (!html) return html;
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    doc.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (src && map[src]) img.setAttribute("src", map[src]);
    });
    return doc.body.innerHTML;
  } catch {
    return html;
  }
}

// Keep this – works whether upload returns axios response, wrapped response, or direct Asset
function pickAssetFromUploadResponse(res: any) {
  const payload = res?.data ?? res;
  const asset = payload?.data ?? payload;
  return asset;
}

function isImageFile(file: File) {
  return !!file?.type?.startsWith("image/");
}

function isCloudinaryUrl(url: string) {
  return (
    typeof url === "string" &&
    url.startsWith("http") &&
    url.includes("res.cloudinary.com")
  );
}

function extractRemoteCloudinaryImgUrls(html: string): string[] {
  return uniq(extractImgSrcs(html).filter((src) => isCloudinaryUrl(src)));
}

export default function EditPostPage({ params }: PageProps) {
  const router = useRouter();
  const toaster = useToaster();

  const { data: post, isLoading: postLoading } = useGetPostByIdQuery(
    params?.id,
    { skip: !params.id },
  );

  const [updatePost, { isLoading: updateLoading }] = useUpdatePostMutation();
  const [uploadAsset] = useUploadAssetMutation();
  const [deleteAsset] = useDeleteAssetMutation(); // rollback for newly uploaded assets
  const [deleteAssetByUrl] = useDeleteAssetByUrlMutation(); // ✅ delete old images by URL

  const [formValue, setFormValue] = useState({
    title: "",
    category: "",
    excerpt: "",
    coverImage: "", // remote url OR blob url
    tags: [] as string[],
  });

  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);

  // cover image (only when user picks a new file)
  const [coverImageFile, setCoverImageFile] = useState<LocalImage | null>(null);

  // editor images stored by blob url
  const [editorImages, setEditorImages] = useState<Record<string, LocalImage>>(
    {},
  );

  const [isSaving, setIsSaving] = useState(false);

  // ✅ Baseline refs (what the server currently has) so we can delete removed images after a successful update
  const baselineCoverUrlRef = useRef<string>("");
  const baselineContentCloudinaryUrlsRef = useRef<string[]>([]);
  const baselineInitializedRef = useRef(false);

  // ---- load post into state ----
  useEffect(() => {
    if (post?.data) {
      setFormValue({
        title: post.data.title ?? "",
        category: post.data.category ?? "",
        excerpt: post.data.excerpt ?? "",
        coverImage: post.data.coverImage ?? "",
        tags: post.data.tags ?? [],
      });
      setContent(post.data.content ?? "");

      // ✅ set baseline for deletion (only when loading the post)
      baselineCoverUrlRef.current = post.data.coverImage ?? "";
      baselineContentCloudinaryUrlsRef.current = extractRemoteCloudinaryImgUrls(
        post.data.content ?? "",
      );
      baselineInitializedRef.current = true;

      // cleanup any local selections
      setCoverImageFile((prev) => {
        if (prev?.localUrl) URL.revokeObjectURL(prev.localUrl);
        return null;
      });
      setEditorImages((prev) => {
        Object.keys(prev).forEach((u) => URL.revokeObjectURL(u));
        return {};
      });
    }
  }, [post]);

  // ---- categories/tags ----
  const {
    data: categories,
    isLoading: categoryLoading,
    isFetching: categoryFetching,
  } = useGetCategoriesQuery({ limit: "100", page: "1" });

  const {
    data: tags,
    isLoading: tagLoading,
    isFetching: tagFetching,
  } = useGetTagsQuery({ limit: "100", page: "1" });

  const categoriesData = useMemo(
    () =>
      categories?.data?.data?.map((cat: any) => ({
        label: cat.name,
        value: cat._id,
      })) || [],
    [categories],
  );

  const tagsData = useMemo(
    () =>
      tags?.data?.data?.map((t: any) => ({ label: t.name, value: t._id })) ||
      [],
    [tags],
  );

  // ---- cover pick/remove ----
  const onPickCover = (file: File) => {
    if (!isImageFile(file)) {
      toaster.push(
        <Message type="error" closable>
          Only image files are allowed.
        </Message>,
        { placement: "topEnd" },
      );
      return;
    }

    // revoke old local cover if any
    setCoverImageFile((prev) => {
      if (prev?.localUrl) URL.revokeObjectURL(prev.localUrl);
      return prev;
    });

    const localUrl = URL.createObjectURL(file);
    setCoverImageFile({ file, localUrl });
    setFormValue((prev) => ({ ...prev, coverImage: localUrl }));
  };

  const removeCover = () => {
    setCoverImageFile((prev) => {
      if (prev?.localUrl) URL.revokeObjectURL(prev.localUrl);
      return null;
    });
    setFormValue((prev) => ({ ...prev, coverImage: "" }));
  };

  // ---- editor image pick (returns blob url) ----
  const handleEditorPickImageFile = (file: File) => {
    if (!isImageFile(file)) {
      toaster.push(
        <Message type="error" closable>
          Only image files are allowed.
        </Message>,
        { placement: "topEnd" },
      );
      return "";
    }

    const localUrl = URL.createObjectURL(file);
    setEditorImages((prev) => ({ ...prev, [localUrl]: { file, localUrl } }));
    return localUrl;
  };

  // prune unused blob images if user removes them from content
  useEffect(() => {
    const used = new Set(
      extractImgSrcs(content).filter((src) => src.startsWith("blob:")),
    );
    setEditorImages((prev) => {
      const next: Record<string, LocalImage> = {};
      for (const [localUrl, meta] of Object.entries(prev)) {
        if (used.has(localUrl)) next[localUrl] = meta;
        else URL.revokeObjectURL(localUrl);
      }
      return next;
    });
  }, [content]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (coverImageFile?.localUrl)
        URL.revokeObjectURL(coverImageFile.localUrl);
      Object.keys(editorImages).forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (isSaving || updateLoading) return;
    if (!baselineInitializedRef.current) return;

    const originalContent = content;
    const originalCover = formValue.coverImage;

    const usedSrcs = Array.from(new Set(extractImgSrcs(content)));
    const usedInlineBlobSrcs = usedSrcs.filter((src) =>
      src.startsWith("blob:"),
    );

    // Track uploaded assets for rollback (only the NEW ones in this save attempt)
    const uploaded: Array<{ assetId: string }> = [];
    const replaceMap: Record<string, string> = {};

    // Snapshot baseline (what we should delete AFTER success)
    const baselineCover = baselineCoverUrlRef.current;
    const baselineInlineCloudinary = baselineContentCloudinaryUrlsRef.current;

    try {
      setIsSaving(true);

      // 1) Upload cover only if user selected a new file
      let finalCoverUrl = formValue.coverImage;

      if (coverImageFile?.file && coverImageFile.localUrl) {
        const res = await uploadAsset({ file: coverImageFile.file }).unwrap();
        const asset = pickAssetFromUploadResponse(res);

        const assetId = asset?._id || asset?.id;
        const remoteUrl = asset?.url;

        if (!assetId || !remoteUrl) throw new Error("Cover upload failed");

        uploaded.push({ assetId });
        replaceMap[coverImageFile.localUrl] = remoteUrl;

        finalCoverUrl = remoteUrl;
      }

      // 2) Upload inline blob images still in content
      for (const localUrl of usedInlineBlobSrcs) {
        const meta = editorImages[localUrl];
        if (!meta?.file) continue;

        const res = await uploadAsset({ file: meta.file }).unwrap();
        const asset = pickAssetFromUploadResponse(res);

        const assetId = asset?._id || asset?.id;
        const remoteUrl = asset?.url;

        if (!assetId || !remoteUrl)
          throw new Error("Inline image upload failed");

        uploaded.push({ assetId });
        replaceMap[localUrl] = remoteUrl;
      }

      // 3) Replace blob URLs in HTML
      const finalContent = replaceImgSrcs(originalContent, replaceMap);

      // 4) Update post
      const result = await updatePost({
        id: params.id,
        body: {
          ...formValue,
          coverImage: finalCoverUrl,
          content: finalContent,
        },
      }).unwrap();

      if (result?.success === false) {
        throw new Error(result?.message || "Post update failed");
      }

      // ✅ 5) After SUCCESS: delete old remote images that are no longer used
      const newInlineCloudinary = extractRemoteCloudinaryImgUrls(finalContent);

      const removedInline = baselineInlineCloudinary.filter(
        (u) => !newInlineCloudinary.includes(u),
      );

      const removedCover =
        isCloudinaryUrl(baselineCover) && baselineCover !== finalCoverUrl
          ? [baselineCover]
          : [];

      const toDelete = uniq([...removedInline, ...removedCover]).filter(
        isCloudinaryUrl,
      );

      if (toDelete.length > 0) {
        const delResults = await Promise.allSettled(
          toDelete.map((url) => deleteAssetByUrl({ url }).unwrap()),
        );

        const failed = delResults.filter((r) => r.status === "rejected");
        if (failed.length > 0) {
          toaster.push(
            <Message type="warning" closable>
              Post updated, but {failed.length} old image(s) could not be
              deleted. You can retry later from cleanup.
            </Message>,
            { placement: "topEnd" },
          );
        }
      }

      // ✅ update baseline so subsequent edits delete correctly
      baselineCoverUrlRef.current = finalCoverUrl;
      baselineContentCloudinaryUrlsRef.current = newInlineCloudinary;

      // 6) Update UI + cleanup local blobs
      setContent(finalContent);
      setFormValue((prev) => ({ ...prev, coverImage: finalCoverUrl }));

      if (coverImageFile?.localUrl)
        URL.revokeObjectURL(coverImageFile.localUrl);
      Object.keys(editorImages).forEach((u) => URL.revokeObjectURL(u));

      setCoverImageFile(null);
      setEditorImages({});

      toaster.push(
        <Message type="success" closable>
          Post updated successfully!
        </Message>,
        { placement: "topEnd" },
      );
      router.push(`/dashboard/posts/${result?.data?._id}/view`);
    } catch (err) {
      // Rollback: delete newly uploaded assets from this attempt so nothing is orphaned
      await Promise.allSettled(
        uploaded.map((u) => deleteAsset({ id: u.assetId }).unwrap()),
      );

      // Restore local UI state
      setContent(originalContent);
      setFormValue((prev) => ({ ...prev, coverImage: originalCover }));

      toaster.push(
        <Message type="error" closable>
          {getErrorMessage(err)} (Uploads rolled back)
        </Message>,
        { placement: "topEnd" },
      );
    } finally {
      setIsSaving(false);
    }
  };

  const saving = isSaving || updateLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit post</h1>

        <div className="flex gap-3">
          <Button
            appearance="ghost"
            onClick={() => setPreview((v) => !v)}
            disabled={saving}
          >
            {preview ? "Edit" : "Preview"}
          </Button>
          <Button
            appearance="primary"
            onClick={handleSave}
            loading={saving}
            disabled={postLoading}
          >
            Save changes
          </Button>
        </div>
      </div>

      {preview ? (
        <article className="rounded-xl border border-border bg-card p-8">
          {formValue.coverImage ? (
            <img
              src={formValue.coverImage}
              alt="Cover"
              className="mb-6 w-full max-h-[320px] object-cover rounded-xl border border-border"
            />
          ) : null}

          <h2 className="text-2xl font-semibold">
            {formValue.title || "Untitled post"}
          </h2>
          <p className="mt-2 text-sm text-secondary">{formValue.excerpt}</p>

          <div
            className="prose-content mt-6"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </article>
      ) : (
        <Form fluid formValue={formValue} onChange={setFormValue}>
          <Form.Group controlId="title">
            <Form.ControlLabel>Title</Form.ControlLabel>
            <Form.Control name="title" placeholder="Post title" />
          </Form.Group>

          <Form.Group controlId="excerpt">
            <Form.ControlLabel>Excerpt</Form.ControlLabel>
            <Form.Control
              name="excerpt"
              accepter={Textarea}
              rows={3}
              placeholder="Short summary"
            />
          </Form.Group>

          {/* Cover image: file input + preview */}
          <Form.Group controlId="coverImage">
            <Form.ControlLabel>Cover Image</Form.ControlLabel>

            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                disabled={saving}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  e.target.value = "";
                  onPickCover(file);
                }}
              />

              {formValue.coverImage ? (
                <div className="rounded-xl border border-border bg-card p-3">
                  <img
                    src={formValue.coverImage}
                    alt="Cover preview"
                    className="w-full max-h-[260px] object-cover rounded-lg border border-border"
                  />
                  <div className="mt-3 flex justify-end">
                    <Button
                      appearance="ghost"
                      color="red"
                      onClick={removeCover}
                      disabled={saving}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card p-4 text-sm text-secondary">
                  No cover selected.
                </div>
              )}
            </div>
          </Form.Group>

          <Form.Group controlId="category">
            <Form.ControlLabel>Category</Form.ControlLabel>
            <Form.Control
              name="category"
              placeholder="Lifestyle"
              accepter={SelectPicker}
              block
              loading={categoryLoading || categoryFetching}
              data={categoriesData}
            />
          </Form.Group>

          <Form.Group controlId="tags">
            <Form.ControlLabel>Tags</Form.ControlLabel>
            <Form.Control
              name="tags"
              placeholder="Tags"
              accepter={TagPicker}
              block
              loading={tagLoading || tagFetching}
              data={tagsData}
            />
          </Form.Group>

          <PostEditor
            content={content}
            onChange={setContent}
            defaultContent={post?.data?.content}
            onPickImageFile={handleEditorPickImageFile}
          />
        </Form>
      )}
    </div>
  );
}
