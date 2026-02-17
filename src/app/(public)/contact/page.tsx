"use client";

import React from "react";
import { Container } from "@/components/layout/container";
import { Button, Form, Message, Textarea, useToaster } from "rsuite";
import { useForm, Controller } from "react-hook-form";
import { useCreateContactMutation } from "@/redux/api/contact/contact.api";

type ContactFormValue = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const defaultValues: ContactFormValue = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const toaster = useToaster();
  const [createContact, { isLoading }] = useCreateContactMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValue>({
    defaultValues,
    mode: "onTouched",
  });

  const showToast = (
    type: "success" | "error",
    title: string,
    desc?: string,
  ) => {
    toaster.push(
      <Message showIcon type={type} closable>
        <p className="font-medium">{title}</p>
        {desc ? <p className="text-sm opacity-80">{desc}</p> : null}
      </Message>,
      { placement: "topEnd", duration: 3500 },
    );
  };

  const onSubmit = async (data: ContactFormValue) => {
    try {
      const res = await createContact({
        name: data.name.trim(),
        email: data.email.trim(),
        subject: data.subject.trim(),
        message: data.message.trim(),
      }).unwrap();

      if (res?.success) {
        showToast("success", "Message sent!", "We’ll get back to you soon.");
        reset(defaultValues);
        return;
      }

      showToast(
        "error",
        "Could not send message",
        res?.message || "Please try again.",
      );
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.error ||
        "Something went wrong. Please try again in a moment.";
      showToast("error", "Could not send message", msg);
    }
  };

  // ✅ Only one toast on validation (no duplicate)
  const onInvalid = () => {
    showToast("error", "Please fix the highlighted fields");
  };

  const disabled = isLoading;

  return (
    <div className="py-12">
      <Container className="max-w-6xl">
        <div className="text-center">
          <h1 className="text-4xl font-semibold">
            <span className="rounded bg-brand px-2 text-white">Contact</span> Us
          </h1>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[2fr,1fr]">
          {/* ✅ react-hook-form submit handler (no onClick => no double toast) */}
          <Form fluid onSubmit={() => void handleSubmit(onSubmit, onInvalid)()}>
            <div className="grid gap-4 md:grid-cols-2">
              <Form.Group controlId="name">
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Name"
                      disabled={disabled}
                    />
                  )}
                />
                {errors.name?.message ? (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.name.message}
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group controlId="email">
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Enter a valid email",
                    },
                  }}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      value={field.value ?? ""}
                      type="email"
                      placeholder="Email"
                      disabled={disabled}
                    />
                  )}
                />
                {errors.email?.message ? (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </div>
                ) : null}
              </Form.Group>
            </div>

            <Form.Group controlId="subject" className="mt-4">
              <Controller
                name="subject"
                control={control}
                rules={{ required: "Subject is required" }}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Subject"
                    disabled={disabled}
                  />
                )}
              />
              {errors.subject?.message ? (
                <div className="mt-1 text-xs text-red-500">
                  {errors.subject.message}
                </div>
              ) : null}
            </Form.Group>

            <Form.Group controlId="message" className="mt-4">
              <Controller
                name="message"
                control={control}
                rules={{
                  required: "Message is required",
                  minLength: {
                    value: 10,
                    message: "Message should be at least 10 characters",
                  },
                }}
                render={({ field }) => (
                  <Form.Control
                    name={field.name}
                    accepter={Textarea}
                    rows={8}
                    placeholder="Type your message"
                    disabled={disabled}
                    value={field.value ?? ""}
                    onChange={(val: string) => field.onChange(val)}
                    onBlur={field.onBlur}
                  />
                )}
              />
              {errors.message?.message ? (
                <div className="mt-1 text-xs text-red-500">
                  {errors.message.message}
                </div>
              ) : null}
            </Form.Group>

            <Button
              appearance="primary"
              className="mt-4 px-6"
              loading={isLoading}
              disabled={disabled}
              type="submit"
            >
              Send message
            </Button>
          </Form>

          <div className="space-y-4 text-sm text-secondary">
            <p>
              Dynamically underwhelm integrated outsourcing via timely models.
              Rapidiously reconceptualize visionary imperatives without.
            </p>
            <p>blog.notebook@gmail.com</p>
            <p>+886554 654654</p>
            <p>9567 Turner Trace Apt. BC C3G8A4</p>

            <div className="pt-4">
              <p className="text-sm font-semibold text-foreground">
                Follow on:
              </p>
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
