"use client";

import { Button, Divider, Form, Message } from "rsuite";
import { getSession, signIn } from "next-auth/react";
import { useState } from "react";
import { NavLink } from "@/components/layout/Navlink";
import { useRouter } from "next/navigation";

type ILoginData = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const [formValue, setFormValue] = useState<ILoginData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLogin(credentials: ILoginData) {
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: credentials.email,
        password: credentials.password,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.ok) {
        const updatedSession = await getSession();
        const role = updatedSession?.user?.role;

        if (role && role !== "viewer") router.push("/dashboard");
        else router.push("/");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (e) {
      console.error("Login failed:", e);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-subtle">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="mt-2 text-sm text-secondary">
        Continue to your dashboard to manage posts and comments.
      </p>

      {error && (
        <div className="mt-4">
          <Message
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
          >
            {error}
          </Message>
        </div>
      )}

      <Form
        fluid
        formValue={formValue}
        onChange={(nextValue) => {
          setFormValue(nextValue as ILoginData);
          if (error) setError(null);
        }}
        onSubmit={() => handleLogin(formValue)}
      >
        <Form.Group controlId="email">
          <Form.ControlLabel>Email</Form.ControlLabel>
          <Form.Control
            name="email"
            type="email"
            placeholder="you@example.com"
            disabled={loading}
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.ControlLabel>Password</Form.ControlLabel>
          <Form.Control
            name="password"
            type="password"
            placeholder="••••••••"
            disabled={loading}
          />
        </Form.Group>

        {/* Forgot password */}
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => router.push("/forget-password")}
            disabled={loading}
            className="text-sm text-primary underline-offset-4 hover:underline disabled:opacity-50"
          >
            Forgot password?
          </button>
        </div>

        <Button
          appearance="primary"
          className="mt-4 w-full"
          type="submit"
          loading={loading}
          disabled={loading || !formValue.email || !formValue.password}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </Form>

      <Divider className="my-6">or</Divider>

      <Button
        appearance="primary"
        className="mt-2 w-full"
        as={NavLink}
        href="/sign-up"
        disabled={loading}
      >
        Register
      </Button>
    </div>
  );
}
