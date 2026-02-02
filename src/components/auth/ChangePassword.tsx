"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Modal, Form, Message, InputGroup } from "rsuite";
import { Eye, EyeOff } from "lucide-react";
import { useChangePasswordMutation } from "@/redux/api/auth/auth.api";

type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

type ChangePasswordButtonProps = {
  asLink?: boolean;
  href?: string;
  label?: string;
};

export function ChangePasswordButton({
  asLink = false,
  href = "/dashboard/users",
  label = "Change Password",
}: ChangePasswordButtonProps) {
  const [open, setOpen] = useState(false);
  const [formValue, setFormValue] = useState<ChangePasswordPayload>({
    oldPassword: "",
    newPassword: "",
  });

  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const resetState = () => {
    setFormValue({ oldPassword: "", newPassword: "" });
    setLocalError(null);
    setLocalSuccess(null);
    setShowOld(false);
    setShowNew(false);
  };

  const handleOpen = () => {
    resetState();
    setOpen(true);
  };

  const handleClose = () => {
    if (isLoading) return;
    setOpen(false);
  };

  const submit = async () => {
    setLocalError(null);
    setLocalSuccess(null);

    if (!formValue.oldPassword || !formValue.newPassword) {
      setLocalError("Please fill in both old and new password.");
      return;
    }

    try {
      await changePassword(formValue).unwrap();
      setLocalSuccess("Password updated successfully.");
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.error ||
        err?.toString() ||
        "Failed to change password.";
      setLocalError(msg);
    }
  };

  return (
    <>
      <Button
        appearance="ghost"
        {...(asLink
          ? ({
              as: Link,
              href,
            } as any)
          : {})}
        onClick={(e) => {
          if (asLink) e.preventDefault();
          handleOpen();
        }}
      >
        <span className="inline-flex items-center gap-2">{label}</span>
      </Button>

      <Modal open={open} onClose={handleClose} size="sm" backdrop="static">
        <Modal.Header>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {localError && (
            <div className="mb-3">
              <Message
                type="error"
                showIcon
                closable
                onClose={() => setLocalError(null)}
              >
                {localError}
              </Message>
            </div>
          )}

          {localSuccess && (
            <div className="mb-3">
              <Message
                type="success"
                showIcon
                closable
                onClose={() => setLocalSuccess(null)}
              >
                {localSuccess}
              </Message>
            </div>
          )}

          <Form
            fluid
            formValue={formValue}
            onChange={(v) => {
              setFormValue(v as ChangePasswordPayload);
              if (localError) setLocalError(null);
              if (localSuccess) setLocalSuccess(null);
            }}
          >
            <Form.Group controlId="oldPassword">
              <Form.ControlLabel>Old password</Form.ControlLabel>

              <InputGroup inside>
                <Form.Control
                  name="oldPassword"
                  type={showOld ? "text" : "password"}
                  placeholder="Enter old password"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <InputGroup.Button
                  tabIndex={-1}
                  disabled={isLoading}
                  onClick={() => setShowOld((s) => !s)}
                  aria-label={
                    showOld ? "Hide old password" : "Show old password"
                  }
                  title={showOld ? "Hide" : "Show"}
                >
                  {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                </InputGroup.Button>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="newPassword">
              <Form.ControlLabel>New password</Form.ControlLabel>

              <InputGroup inside>
                <Form.Control
                  name="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <InputGroup.Button
                  tabIndex={-1}
                  disabled={isLoading}
                  onClick={() => setShowNew((s) => !s)}
                  aria-label={
                    showNew ? "Hide new password" : "Show new password"
                  }
                  title={showNew ? "Hide" : "Show"}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </InputGroup.Button>
              </InputGroup>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            appearance="primary"
            loading={isLoading}
            disabled={isLoading}
            onClick={submit}
          >
            Save
          </Button>
          <Button
            appearance="subtle"
            disabled={isLoading}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
