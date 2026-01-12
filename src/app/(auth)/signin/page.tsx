'use client';

import { Button, Divider, Form } from 'rsuite';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInPage() {
  const [formValue, setFormValue] = useState({ email: '', password: '' });

  const handleCredentials = async () => {
    await signIn('credentials', {
      email: formValue.email,
      password: formValue.password,
      callbackUrl: '/dashboard'
    });
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-subtle">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="mt-2 text-sm text-secondary">
        Continue to your dashboard to manage posts and comments.
      </p>
      <Button
        appearance="primary"
        className="mt-6 w-full"
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
      >
        Continue with Google
      </Button>
      <Divider className="my-6">or</Divider>
      <Form fluid formValue={formValue} onChange={setFormValue}>
        <Form.Group controlId="email">
          <Form.ControlLabel>Email</Form.ControlLabel>
          <Form.Control name="email" type="email" placeholder="you@example.com" />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.ControlLabel>Password</Form.ControlLabel>
          <Form.Control name="password" type="password" placeholder="••••••••" />
        </Form.Group>
        <Button appearance="primary" className="mt-4 w-full" onClick={handleCredentials}>
          Sign in
        </Button>
      </Form>
    </div>
  );
}
