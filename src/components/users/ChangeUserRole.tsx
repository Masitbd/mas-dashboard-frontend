"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Message, Modal, SelectPicker } from "rsuite";

export type UserRole = "active" | "disabled";

type ChangeUserRoleButtonProps = {
  userUuid?: string | null;
  currentRole?: UserRole | null;

  /**
   * Provide your redux callback (RTK Query mutation via unwrap() or any async function)
   * Must throw/reject on error so we can show it inside the modal.
   */
  onUpdateRole: (args: { uuid: string; role: UserRole }) => Promise<unknown>;

  buttonLabel?: string;
  disabled?: boolean;

  /** Optional: run after a successful update */
  onSuccess?: (newRole: UserRole) => void;
};

function getErrorMessage(err: unknown) {
  const e = err as any;
  if (!e) return "Something went wrong.";

  // RTK Query common shapes:
  if (typeof e?.data?.message === "string") return e.data.message;
  if (Array.isArray(e?.data?.message)) return e.data.message.join(", ");
  if (typeof e?.error === "string") return e.error;
  if (typeof e?.message === "string") return e.message;

  try {
    return JSON.stringify(e);
  } catch {
    return "Something went wrong.";
  }
}

export function ChangeUserRoleButton({
  userUuid,
  currentRole,
  onUpdateRole,
  buttonLabel = "Change Status",
  disabled = false,
  onSuccess,
}: ChangeUserRoleButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(
    currentRole ?? null,
  );

  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const closeTimerRef = useRef<number | null>(null);

  const rolesData = useMemo(
    () =>
      (["active", "disabled"] as UserRole[]).map((r) => ({
        label: r.charAt(0).toUpperCase() + r.slice(1),
        value: r,
      })),
    [],
  );

  const canOpen = !!userUuid && !disabled;
  const confirmDisabled =
    submitting ||
    !userUuid ||
    !selectedRole ||
    (currentRole ? selectedRole === currentRole : false);

  const resetModalState = () => {
    setModalError(null);
    setSuccess(null);
    setSubmitting(false);
    setSelectedRole(currentRole ?? null);
  };

  const handleOpen = () => {
    if (!canOpen) return;
    resetModalState();
    setOpen(true);
  };

  const handleClose = () => {
    if (submitting) return; // prevent closing while updating (edge case)
    setOpen(false);
  };

  const handleConfirm = async () => {
    setModalError(null);
    setSuccess(null);

    if (!userUuid) {
      setModalError("User UUID is missing.");
      return;
    }
    if (!selectedRole) {
      setModalError("Please select a status.");
      return;
    }
    if (currentRole && selectedRole === currentRole) {
      setModalError("Selected status is the same as the current status.");
      return;
    }

    setSubmitting(true);
    try {
      await onUpdateRole({ uuid: userUuid, role: selectedRole });

      setSuccess("Status updated successfully.");
      onSuccess?.(selectedRole);

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
    // If parent updates currentRole, reflect it when modal isn't open
    if (!open) setSelectedRole(currentRole ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRole]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <>
      <Button appearance="ghost" onClick={handleOpen} disabled={!canOpen}>
        {buttonLabel}
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        size="sm"
        backdrop="static"
        keyboard={!submitting}
      >
        <Modal.Header>
          <Modal.Title>Change user role</Modal.Title>
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
            <div className="mb-1 text-xs uppercase text-muted">Select role</div>

            <SelectPicker
              data={rolesData}
              value={selectedRole ?? undefined}
              onChange={(v) => {
                setModalError(null);
                setSuccess(null);
                setSelectedRole((v as UserRole) ?? null);
              }}
              placeholder="Choose a role"
              searchable={false}
              cleanable={false}
              disabled={submitting || !userUuid}
              block
              // dropdown background white (matches your theme request)
              menuStyle={{ background: "#ffffff" }}
            />

            <div className="mt-2 text-sm text-secondary">
              Current:{" "}
              <span className="capitalize font-medium">
                {currentRole ?? "—"}
              </span>
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
            disabled={confirmDisabled}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
