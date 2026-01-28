"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Form, SelectPicker, TagPicker, Textarea } from "rsuite";
import { PostEditor } from "@/components/blog/post-editor";
import {
  useGetPostByIdPopulatedQuery,
  useGetPostByIdQuery,
  useUpdatePostMutation,
} from "@/redux/api/posts/post.api";
import { useGetCategoriesQuery } from "@/redux/api/categories/category.api";
import { useGetTagsQuery } from "@/redux/api/tags/tags.api";

interface PageProps {
  params: { id: string };
}

export default function EditPostPage({ params }: PageProps) {
  const { data: post } = useGetPostByIdQuery(params?.id, { skip: !params.id });
  const [formValue, setFormValue] = useState({
    title: "",
    category: "",
    excerpt: "",
    coverImage: "",
    tags: [] as string[],
  });
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [updatePost] = useUpdatePostMutation();

  useEffect(() => {
    if (post) {
      setFormValue({
        title: post?.data?.title,
        category: post?.data?.category,
        excerpt: post?.data?.excerpt,
        coverImage: post?.data?.coverImage,
        tags: post?.data?.tags || [],
      });
      setContent(post?.data?.content);
    }
  }, [post]);

  const handleSave = async () => {
    await updatePost({
      id: params.id,
      body: { ...formValue, content },
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
        <h1 className="text-2xl font-semibold">Edit post</h1>
        <div className="flex gap-3">
          <Button
            appearance="ghost"
            onClick={() => setPreview((value) => !value)}
          >
            {preview ? "Edit" : "Preview"}
          </Button>
          <Button appearance="primary" onClick={handleSave}>
            Save changes
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
          <PostEditor
            content={content}
            onChange={setContent}
            defaultContent={post?.data?.content}
          />
        </Form>
      )}
    </div>
  );
}
