"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Message, Modal, Input, InputGroup } from "rsuite";
import { Eye, EyeOff, KeyRound } from "lucide-react";

type AdminChangePasswordButtonProps = {
  userUuid?: string | null;

  /**
   * Redux callback (RTK Query mutation via unwrap() or any async function)
   * Must reject/throw on error so we can show it inside the modal.
   */
  onAdminChangePassword: (args: {
    uuid: string;
    newPassword: string;
  }) => Promise<unknown>;

  buttonLabel?: string;
  disabled?: boolean;

  /** Optional: run after success */
  onSuccess?: () => void;

  /** Optional: basic validation config */
  minLength?: number;
};

function getErrorMessage(err: unknown) {
  const e = err as any;
  if (!e) return "Something went wrong.";
  if (typeof e?.data?.message === "string") return e.data.message;
  if (Array.isArray(e?.data?.message)) return e.data.message.join(", ");
  if (typeof e?.error === "string") return e.error;
  if (typeof e?.message === "string") return e.message;
  return "Something went wrong.";
}

export function AdminChangePasswordButton({
  userUuid,
  onAdminChangePassword,
  buttonLabel = "Change Password",
  disabled = false,
  onSuccess,
  minLength = 8,
}: AdminChangePasswordButtonProps) {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const closeTimerRef = useRef<number | null>(null);

  const canOpen = !!userUuid && !disabled;

  const resetModalState = () => {
    setNewPassword("");
    setShowPassword(false);
    setModalError(null);
    setSuccess(null);
    setSubmitting(false);
  };

  const handleOpen = () => {
    if (!canOpen) return;
    resetModalState();
    setOpen(true);
  };

  const handleClose = () => {
    if (submitting) return; // prevent closing during request
    setOpen(false);
  };

  const validate = () => {
    const pwd = newPassword.trim();
    if (!userUuid) return "User UUID is missing.";
    if (!pwd) return "Please enter a new password.";
    if (pwd.length < minLength)
      return `Password must be at least ${minLength} characters.`;
    // Optional: add more checks if you want (uppercase, number, etc.)
    return null;
  };

  const handleConfirm = async () => {
    setModalError(null);
    setSuccess(null);

    const validationError = validate();
    if (validationError) {
      setModalError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await onAdminChangePassword({
        uuid: userUuid as string,
        newPassword: newPassword.trim(),
      });

      setSuccess("Password updated successfully.");
      onSuccess?.();

      // Auto-close after showing success
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = window.setTimeout(() => {
        setOpen(false);
        setSubmitting(false);
      }, 900);
    } catch (err) {
      setModalError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <>
      <Button appearance="default" onClick={handleOpen} disabled={!canOpen}>
        <span className="inline-flex items-center gap-2">
          <KeyRound size={16} />
          {buttonLabel}
        </span>
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        size="sm"
        backdrop="static"
        keyboard={!submitting}
      >
        <Modal.Header>
          <Modal.Title>Change password</Modal.Title>
        </Modal.Header>

        <Modal.Body className="space-y-3">
          {!userUuid ? (
            <Message type="error" showIcon>
              User UUID is missing. Close this modal and try again.
            </Message>
          ) : null}

          {success ? (
            <Message type="success" showIcon>
              {success}
            </Message>
          ) : null}

          {modalError ? (
            <Message type="error" showIcon>
              {modalError}
            </Message>
          ) : null}

          <div>
            <div className="mb-1 text-xs uppercase text-muted">
              New password
            </div>

            <InputGroup inside>
              <Input
                value={newPassword}
                onChange={(v) => {
                  setModalError(null);
                  setSuccess(null);
                  setNewPassword(v);
                }}
                type={showPassword ? "text" : "password"}
                placeholder={`Enter new password (min ${minLength} chars)`}
                autoComplete="new-password"
                disabled={submitting || !userUuid}
              />
              <InputGroup.Button
                onClick={() => setShowPassword((s) => !s)}
                disabled={submitting || !userUuid}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </InputGroup.Button>
            </InputGroup>

            <div className="mt-2 text-xs text-secondary">
              Tip: use a strong password (letters + numbers + symbols).
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={handleClose}
            appearance="subtle"
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirm}
            appearance="primary"
            loading={submitting}
            disabled={submitting || !userUuid || !newPassword.trim()}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
