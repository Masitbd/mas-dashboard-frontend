"use client";

import { Button, Divider, Form } from "rsuite";
import { getSession, signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { NavLink } from "@/components/layout/Navlink";
import { useRouter } from "next/navigation";
import { ENUM_USER } from "@/enums/EnumUser";
type ILoginData = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const [formValue, setFormValue] = useState({ email: "", password: "" });
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const route = useRouter();
  const session = useSession();

  const handleChange = () => {
    setVisible(!visible);
  };

  const formSubmitHandler = (payload: ILoginData) => {
    handleLogin(payload);
  };

  async function handleLogin(credentials: ILoginData) {
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        email: credentials.email,
        password: credentials.password,
      });
      // console.log(result, "login rest");
      if (result?.error) {
        setError(result.error);
      }
      if (result?.ok) {
        setLoading(false);
        const updatedSession = await getSession();
        if (updatedSession?.user?.role !== "viewer") {
          route.push("/dashboard");
        } else if (updatedSession?.user?.role == "viewer") {
          route.push("/");
        } else {
          route.push("/");
        }
      }
    } catch (error) {
      if (error) {
        console.error("Login failed:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleCredentials = async () => {
    const result = await signIn("credentials", {
      redirect: false,
      email: formValue.email,
      password: formValue.password,
    });
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-subtle">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="mt-2 text-sm text-secondary">
        Continue to your dashboard to manage posts and comments.
      </p>

      <Form fluid formValue={formValue} onChange={setFormValue}>
        <Form.Group controlId="email">
          <Form.ControlLabel>Email</Form.ControlLabel>
          <Form.Control
            name="email"
            type="email"
            placeholder="you@example.com"
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.ControlLabel>Password</Form.ControlLabel>
          <Form.Control
            name="password"
            type="password"
            placeholder="••••••••"
          />
        </Form.Group>
        <Button
          appearance="primary"
          className="mt-4 w-full"
          onClick={() => handleLogin(formValue)}
        >
          Sign in
        </Button>
      </Form>
      <Divider className="my-6">or</Divider>
      <Button
        appearance="primary"
        className="mt-2 w-full"
        as={NavLink}
        href="/sign-up"
      >
        Register
      </Button>
    </div>
  );
}
