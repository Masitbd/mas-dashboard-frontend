'use client';

import { useState } from 'react';
import { Button, Form, Textarea } from 'rsuite';
import { useAddCommentMutation, useGetCommentsQuery } from '@/store/api';

export function CommentSection({ postId }: { postId: string }) {
  const { data = [] } = useGetCommentsQuery(postId);
  const [addComment] = useAddCommentMutation();
  const [formValue, setFormValue] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async () => {
    if (!formValue.name || !formValue.email || !formValue.message) {
      return;
    }
    await addComment({
      postId,
      ...formValue
    });
    setFormValue({ name: '', email: '', message: '' });
  };

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h3 className="text-2xl font-semibold font-serif">Comments</h3>
      <div className="mt-6 space-y-6">
        {data.map((comment) => (
          <div key={comment.id} className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-semibold text-foreground">{comment.name}</p>
            <p className="text-xs text-muted">{new Date(comment.createdAt).toLocaleDateString()}</p>
            <p className="mt-2 text-sm text-secondary">{comment.message}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <h4 className="text-lg font-semibold font-serif">Leave a comment</h4>
        <Form fluid className="mt-4" formValue={formValue} onChange={setFormValue}>
          <div className="grid gap-4 md:grid-cols-2">
            <Form.Group controlId="name">
              <Form.ControlLabel>Name</Form.ControlLabel>
              <Form.Control name="name" placeholder="Your name" />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Form.Control name="email" type="email" placeholder="you@example.com" />
            </Form.Group>
          </div>
          <Form.Group controlId="message" className="mt-4">
            <Form.ControlLabel>Message</Form.ControlLabel>
            <Form.Control name="message" rows={4} accepter={Textarea} placeholder="Write your thoughts..." />
          </Form.Group>
          <Button
            appearance="primary"
            className="mt-4 text-xs uppercase tracking-[0.2em]"
            onClick={handleSubmit}
          >
            Submit comment
          </Button>
        </Form>
      </div>
    </section>
  );
}
