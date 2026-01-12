'use client';

import { useState } from 'react';
import { Button, Form } from 'rsuite';
import { useSubscribeNewsletterMutation } from '@/store/api';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [subscribe] = useSubscribeNewsletterMutation();

  const handleSubmit = async () => {
    if (!email) {
      return;
    }
    await subscribe({ email });
    setEmail('');
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">Newsletter</p>
      <h3 className="mt-2 text-3xl font-semibold font-serif">Stay in the loop</h3>
      <p className="mt-2 text-sm text-secondary">
        Get our latest essays and quiet reading recommendations in your inbox.
      </p>
      <Form fluid className="mt-4">
        <Form.Group controlId="email">
          <Form.Control
            name="email"
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(value) => setEmail(value)}
          />
        </Form.Group>
        <Button
          appearance="primary"
          className="mt-2 text-xs uppercase tracking-[0.2em]"
          onClick={handleSubmit}
        >
          Subscribe
        </Button>
      </Form>
    </div>
  );
}
