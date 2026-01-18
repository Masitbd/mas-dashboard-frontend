"use client";

import { useState } from "react";
import { Button, Form, Textarea } from "rsuite";
import { PostEditor } from "@/components/blog/post-editor";
import { useCreatePostMutation } from "@/store/api";

export default function NewPostPage() {
  const [formValue, setFormValue] = useState({
    title: "",
    category: "",
    excerpt: "",
  });
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [createPost] = useCreatePostMutation();

  const handleSave = async () => {
    await createPost({
      title: formValue.title,
      excerpt: formValue.excerpt,
      category: formValue.category,
      content,
    });
  };

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
          <Form.Group controlId="category">
            <Form.ControlLabel>Category</Form.ControlLabel>
            <Form.Control name="category" placeholder="Lifestyle" />
          </Form.Group>
          <PostEditor content={content} onChange={setContent} />
        </Form>
      )}
    </div>
  );
}
