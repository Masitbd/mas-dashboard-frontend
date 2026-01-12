'use client';

import { Button, Form } from 'rsuite';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data } = useSession();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <Form fluid>
        <Form.Group controlId="name">
          <Form.ControlLabel>Name</Form.ControlLabel>
          <Form.Control name="name" defaultValue={data?.user?.name || ''} />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.ControlLabel>Email</Form.ControlLabel>
          <Form.Control name="email" defaultValue={data?.user?.email || ''} />
        </Form.Group>
        <Button appearance="primary">Save changes</Button>
      </Form>
    </div>
  );
}
