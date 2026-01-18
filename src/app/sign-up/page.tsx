"use client";

import { Eye, EyeClosed, EyeClosedIcon, EyeOff } from "lucide-react";
// RegisterForm.tsx
// Make sure (once) in your app entry: import "rsuite/dist/rsuite.min.css";

import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as RSuite from "rsuite";
import Swal from "sweetalert2";

type RegisterFormValues = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
};

const { Panel, Form, Input, Button, Divider } = RSuite as any;

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const password = watch("password");

  const demoSubmit = async (data: RegisterFormValues) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "validate",
        message: "Passwords do not match.",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("REGISTER DATA:", data);
      // demo delay — remove later
      await new Promise((r) => setTimeout(r, 900));
      Swal.fire({
        toast: true,
        timer: 1000,
        timerProgressBar: true,
        icon: "success",
        text: "Signed up successfully",
        position: "top-end",
        showConfirmButton: false,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // handling the password field visibility
  enum ENUM_VISIBILITY {
    VISIBLE = "text",
    IN_VISIBLE = "password",
  }
  const [visible, setVisible] = useState(ENUM_VISIBILITY.IN_VISIBLE);
  const passwordFieldVisibilityHandler = (data: ENUM_VISIBILITY) => {
    setVisible(data);
  };

  return (
    <div style={{ maxWidth: 520, margin: "48px auto", padding: "0 16px" }}>
      <Panel
        bordered
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
        header={
          <div style={{ padding: "12px 8px" }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>Register</div>
          </div>
        }
      >
        <Form fluid onSubmit={handleSubmit(demoSubmit)}>
          <Form.Group>
            <Form.ControlLabel>Email</Form.ControlLabel>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              }}
              render={({ field }) => (
                <Input
                  type="email"
                  autoComplete="email"
                  disabled={loading}
                  value={field.value}
                  onChange={(v: string) => field.onChange(v)}
                  placeholder="name@domain.com"
                />
              )}
            />
            {errors.email?.message ? (
              <div style={{ color: "#d11a2a", marginTop: 6, fontSize: 12 }}>
                {errors.email.message}
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>Name</Form.ControlLabel>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Name is required.",
                minLength: { value: 2, message: "Minimum 2 characters." },
                maxLength: { value: 50, message: "Maximum 50 characters." },
              }}
              render={({ field }) => (
                <Input
                  disabled={loading}
                  value={field.value}
                  onChange={(v: string) => field.onChange(v)}
                  placeholder="Your name"
                />
              )}
            />
            {errors.name?.message ? (
              <div style={{ color: "#d11a2a", marginTop: 6, fontSize: 12 }}>
                {errors.name.message}
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>Password</Form.ControlLabel>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required.",
                minLength: { value: 8, message: "Minimum 8 characters." },
              }}
              render={({ field }) => (
                <RSuite.InputGroup>
                  <Input
                    type={visible}
                    autoComplete="new-password"
                    disabled={loading}
                    value={field.value}
                    onChange={(v: string) => field.onChange(v)}
                    placeholder="••••••••"
                  />
                  <RSuite.InputGroup.Addon>
                    <Button
                      onClick={() =>
                        setVisible(
                          visible == ENUM_VISIBILITY.VISIBLE
                            ? ENUM_VISIBILITY.IN_VISIBLE
                            : ENUM_VISIBILITY.VISIBLE
                        )
                      }
                    >
                      {visible == ENUM_VISIBILITY.VISIBLE ? (
                        <EyeOff size={"20"} />
                      ) : (
                        <Eye size={"20"} />
                      )}
                    </Button>
                  </RSuite.InputGroup.Addon>
                </RSuite.InputGroup>
              )}
            />
            {errors.password?.message ? (
              <div style={{ color: "#d11a2a", marginTop: 6, fontSize: 12 }}>
                {errors.password.message}
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>Confirm password</Form.ControlLabel>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Please confirm your password.",
                validate: (v) => v === password || "Passwords do not match.",
              }}
              render={({ field }) => (
                <RSuite.InputGroup>
                  <Input
                    type={visible}
                    autoComplete="new-password"
                    disabled={loading}
                    value={field.value}
                    onChange={(v: string) => field.onChange(v)}
                    placeholder="••••••••"
                  />
                  <RSuite.InputGroup.Addon>
                    <Button
                      onClick={() =>
                        setVisible(
                          visible == ENUM_VISIBILITY.VISIBLE
                            ? ENUM_VISIBILITY.IN_VISIBLE
                            : ENUM_VISIBILITY.VISIBLE
                        )
                      }
                    >
                      {visible == ENUM_VISIBILITY.VISIBLE ? (
                        <EyeOff size={"20"} />
                      ) : (
                        <Eye size={"20"} />
                      )}
                    </Button>
                  </RSuite.InputGroup.Addon>
                </RSuite.InputGroup>
              )}
            />
            {errors.confirmPassword?.message ? (
              <div style={{ color: "#d11a2a", marginTop: 6, fontSize: 12 }}>
                {errors.confirmPassword.message}
              </div>
            ) : null}
          </Form.Group>

          <Divider />

          <Button
            type="submit"
            appearance="primary"
            size="lg"
            disabled={loading}
            loading={loading} // RSuite supports this; if your version doesn't, remove this line
            style={{
              width: "100%",
              borderRadius: 12,
              padding: "10px 18px",
              boxShadow: "0 8px 18px rgba(0,0,0,0.10)",
            }}
          >
            Create account
          </Button>
        </Form>
      </Panel>
    </div>
  );
}
