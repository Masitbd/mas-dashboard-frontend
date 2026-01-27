"use client";

import { useState } from "react";
import { Button, Form, SelectPicker, TagPicker, Textarea } from "rsuite";
import { PostEditor } from "@/components/blog/post-editor";
import { useGetCategoriesQuery } from "@/redux/api/categories/category.api";
import { useCreatePostMutation } from "@/redux/api/posts/post.api";
import { useGetTagsQuery } from "@/redux/api/tags/tags.api";

export default function NewPostPage() {
  const [createPost, { isLoading: createPostLoading }] =
    useCreatePostMutation();
  const [formValue, setFormValue] = useState({
    title: "",
    category: "",
    excerpt: "",
    coverImage: "",
    tags: [] as string[],
  });
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);

  const handleSave = async () => {
    await createPost({
      title: formValue.title,
      excerpt: formValue.excerpt,
      category: formValue.category,
      content: content,
      coverImage: formValue.coverImage,
      tagIds: formValue.tags || [],
    });
  };

  const {
    data: categories,
    isLoading: categoryLoading,
    isFetching: categoryFetching,
  } = useGetCategoriesQuery({
    limit: "100",
    page: "1",
  });

  const {
    data: tags,
    isLoading: tagLoading,
    isFetching: tagFetching,
  } = useGetTagsQuery({
    limit: "100",
    page: "1",
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New post</h1>
        <div className="flex gap-3">
          <Button
            appearance="ghost"
            onClick={() => setPreview((value) => !value)}
          >
            {preview ? "Edit" : "Preview"}
          </Button>
          <Button appearance="primary" onClick={handleSave}>
            Publish
          </Button>
        </div>
      </div>
      {preview ? (
        <article className="rounded-xl border border-border bg-card p-8">
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
          <Form.Group controlId="coverImage">
            <Form.ControlLabel>Cover Image</Form.ControlLabel>
            <Form.Control
              name="coverImage"
              rows={3}
              placeholder="Cover Image"
            />
          </Form.Group>
          <Form.Group controlId="category">
            <Form.ControlLabel>Category</Form.ControlLabel>
            <Form.Control
              name="category"
              placeholder="Lifestyle"
              accepter={SelectPicker}
              block
              loading={categoryLoading || categoryFetching}
              data={
                categories?.data?.data.map((cat) => ({
                  label: cat.name,
                  value: cat._id,
                })) || []
              }
            />
          </Form.Group>
          <Form.Group controlId="tags">
            <Form.ControlLabel>Tags</Form.ControlLabel>
            <Form.Control
              name="tags"
              placeholder="Lifestyle"
              accepter={TagPicker}
              block
              loading={tagLoading || tagFetching}
              data={
                tags?.data?.data.map((cat) => ({
                  label: cat.name,
                  value: cat._id,
                })) || []
              }
            />
          </Form.Group>
          <PostEditor content={content} onChange={setContent} />
        </Form>
      )}
    </div>
  );
}
