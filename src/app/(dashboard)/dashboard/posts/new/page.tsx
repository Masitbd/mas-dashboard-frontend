"use client";

import { useEffect, useMemo, useState } from "react";
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
import { useGetCategoriesQuery } from "@/redux/api/categories/category.api";
import { useCreatePostMutation } from "@/redux/api/posts/post.api";
import { useGetTagsQuery } from "@/redux/api/tags/tags.api";
import {
  useDeleteAssetMutation,
  useUploadAssetMutation,
} from "@/redux/api/assets/asset.api";
import { useRouter } from "next/navigation";

type LocalImage = {
  file: File;
  localUrl: string; // blob url
  uploadedAssetId?: string;
  uploadedUrl?: string; // cloudinary url
};

function getErrorMessage(err: unknown): string {
  // RTKQ errors can vary (fetchBaseQueryError/serializedError)
  const anyErr = err as any;
  return (
    anyErr?.data?.message ||
    anyErr?.error ||
    anyErr?.message ||
    "Something went wrong."
  );
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

export default function NewPostPage() {
  const router = useRouter();
  const toaster = useToaster();

  const [createPost, { isLoading: createPostLoading }] =
    useCreatePostMutation();
  const [uploadAsset] = useUploadAssetMutation();
  const [deleteAsset] = useDeleteAssetMutation();

  const [formValue, setFormValue] = useState({
    title: "",
    category: "",
    excerpt: "",
    coverImage: "", // will hold local blob url during editing; remote url on success
    tags: [] as string[],
  });

  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);

  // Cover image state (file + local preview)
  const [coverImage, setCoverImage] = useState<LocalImage | null>(null);

  // Inline editor images (keyed by localUrl)
  const [editorImages, setEditorImages] = useState<Record<string, LocalImage>>(
    {},
  );

  // publishing state
  const [isPublishing, setIsPublishing] = useState(false);

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
      categories?.data?.data.map((cat: any) => ({
        label: cat.name,
        value: cat._id,
      })) || [],
    [categories],
  );

  const tagsData = useMemo(
    () =>
      tags?.data?.data.map((t: any) => ({ label: t.name, value: t._id })) || [],
    [tags],
  );

  const onPickCover = (file: File) => {
    if (!file.type?.startsWith("image/")) {
      toaster.push(
        <Message type="error" closable>
          Only image files are allowed.
        </Message>,
        { placement: "topEnd" },
      );
      return;
    }

    const localUrl = URL.createObjectURL(file);

    setCoverImage({ file, localUrl });
    setFormValue((prev) => ({ ...prev, coverImage: localUrl })); // show preview + will rollback easily
  };

  const removeCover = () => {
    setCoverImage((prev) => {
      if (prev?.localUrl) URL.revokeObjectURL(prev.localUrl);
      return null;
    });
    setFormValue((prev) => ({ ...prev, coverImage: "" }));
  };

  // Called by editor when user picks an image
  const handleEditorPickImageFile = (file: File) => {
    const localUrl = URL.createObjectURL(file);

    setEditorImages((prev) => ({
      ...prev,
      [localUrl]: { file, localUrl },
    }));

    return localUrl;
  };

  // cleanup all blob urls on unmount (safety)
  useEffect(() => {
    return () => {
      if (coverImage?.localUrl) URL.revokeObjectURL(coverImage.localUrl);
      Object.keys(editorImages).forEach((localUrl) =>
        URL.revokeObjectURL(localUrl),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (isPublishing || createPostLoading) return;

    const originalContent = content;
    const originalCover = formValue.coverImage; // local blob url (or empty)

    // Collect only images currently used in content
    const usedSrcs = Array.from(new Set(extractImgSrcs(content)));
    const usedLocalInlineSrcs = usedSrcs.filter((src) =>
      src.startsWith("blob:"),
    );

    // We'll upload assets, track their ids for rollback
    const uploaded: Array<{
      assetId: string;
      localUrl: string;
      remoteUrl: string;
    }> = [];
    const replaceMap: Record<string, string> = {};

    try {
      setIsPublishing(true);

      // 1) Upload cover if a file is selected
      let finalCoverUrl = formValue.coverImage;
      if (coverImage?.file && coverImage.localUrl) {
        const res = await uploadAsset({ file: coverImage.file }).unwrap();
        const assetId = res.data._id;
        const remoteUrl = res.data.url;

        uploaded.push({ assetId, localUrl: coverImage.localUrl, remoteUrl });
        replaceMap[coverImage.localUrl] = remoteUrl;

        finalCoverUrl = remoteUrl;
      }

      // 2) Upload inline images used in editor content (blob urls)
      for (const localUrl of usedLocalInlineSrcs) {
        const entry = editorImages[localUrl];
        if (!entry?.file) continue; // if missing, skip safely

        const res = await uploadAsset({ file: entry.file }).unwrap();
        const assetId = res.data._id;
        const remoteUrl = res.data.url;

        uploaded.push({ assetId, localUrl, remoteUrl });
        replaceMap[localUrl] = remoteUrl;
      }

      // 3) Replace local blob URLs inside the HTML content with remote URLs
      const finalContent = replaceImgSrcs(originalContent, replaceMap);

      // 4) Create post with final payload
      // NOTE: currently your API expects coverImage as string URL.
      // Later, switch to coverImageAssetId / contentAssetIds for full tracking.
      const payload = {
        title: formValue.title,
        excerpt: formValue.excerpt,
        category: formValue.category,
        content: finalContent,
        coverImage: finalCoverUrl,
        tagIds: formValue.tags || [],
      };

      const result = await createPost(payload).unwrap();

      // If your backend returns {success:false} without throwing, handle it:
      if (!result?.success) {
        throw new Error(result?.message || "Post creation failed");
      }

      // 5) Success: update UI to remote URLs & cleanup local blobs
      setContent(finalContent);
      setFormValue((prev) => ({ ...prev, coverImage: finalCoverUrl }));

      // revoke local blobs (they’re replaced by remote URLs now)

      if (coverImage?.localUrl) URL.revokeObjectURL(coverImage.localUrl);
      Object.keys(editorImages).forEach((localUrl) =>
        URL.revokeObjectURL(localUrl),
      );

      setCoverImage(null);
      setEditorImages({});

      toaster.push(
        <Message type="success" closable>
          Post published successfully!
        </Message>,
        { placement: "topEnd" },
      );
      router.push(`/dashboard/posts/${result?.data?._id}/view`);
    } catch (err) {
      // Rollback: delete uploaded assets to avoid orphans
      await Promise.allSettled(
        uploaded.map((u) => deleteAsset({ id: u.assetId }).unwrap()),
      );

      // Restore local state/UI
      setContent(originalContent);
      setFormValue((prev) => ({ ...prev, coverImage: originalCover }));

      toaster.push(
        <Message type="error" closable>
          {getErrorMessage(err)} (Uploads rolled back)
        </Message>,
        { placement: "topEnd" },
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const publishLoading = isPublishing || createPostLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New post</h1>

        <div className="flex gap-3">
          <Button
            appearance="ghost"
            onClick={() => setPreview((value) => !value)}
            disabled={publishLoading}
          >
            {preview ? "Edit" : "Preview"}
          </Button>

          <Button
            appearance="primary"
            onClick={handleSave}
            loading={publishLoading}
          >
            Publish
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

          {/* Cover Image: file input + preview */}
          <Form.Group controlId="coverImage">
            <Form.ControlLabel>Cover Image</Form.ControlLabel>

            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                disabled={publishLoading}
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
                      disabled={publishLoading}
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
            onPickImageFile={handleEditorPickImageFile}
          />
        </Form>
      )}
    </div>
  );
}
