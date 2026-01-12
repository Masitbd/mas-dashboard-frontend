'use client';

import { Container } from '@/components/layout/container';
import { Button, Form, Textarea } from 'rsuite';

export default function ContactPage() {
  return (
    <div className="py-12">
      <Container className="max-w-6xl">
        <div className="text-center">
          <h1 className="text-4xl font-semibold">
            <span className="rounded bg-brand px-2 text-white">Contact</span> Us
          </h1>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[2fr,1fr]">
          <Form fluid>
            <div className="grid gap-4 md:grid-cols-2">
              <Form.Group controlId="name">
                <Form.Control name="name" placeholder="Name" />
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Control name="email" type="email" placeholder="Email" />
              </Form.Group>
            </div>
            <Form.Group controlId="subject" className="mt-4">
              <Form.Control name="subject" placeholder="Subject" />
            </Form.Group>
            <Form.Group controlId="message" className="mt-4">
              <Form.Control
                name="message"
                accepter={Textarea}
                rows={8}
                placeholder="Type your message"
              />
            </Form.Group>
            <Button appearance="primary" className="mt-4 px-6">
              Send message
            </Button>
          </Form>
          <div className="space-y-4 text-sm text-secondary">
            <p>
              Dynamically underwhelm integrated outsourcing via timely models. Rapidiously
              reconceptualize visionary imperatives without.
            </p>
            <p>blog.notebook@gmail.com</p>
            <p>+886554 654654</p>
            <p>9567 Turner Trace Apt. BC C3G8A4</p>
            <div className="pt-4">
              <p className="text-sm font-semibold text-foreground">Follow on:</p>
              <div className="mt-2 flex gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded border border-border text-brand">
                  T
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded border border-border text-secondary">
                  F
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded border border-border text-secondary">
                  P
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded border border-border text-secondary">
                  I
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
