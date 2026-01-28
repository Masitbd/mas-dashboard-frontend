import { PostPopulated } from "@/types/posts";
import { RefreshCw } from "lucide-react";
import React from "react";
import { Button } from "rsuite";
import Swal from "sweetalert2";

const StatusChangingButton = (post: PostPopulated) => {
  const [updatePostStatus] = useUpdatePostStatusMutation();

  // optional helper (recommended) for nicer error messages
  const getApiErrorMessage = (err: any) => {
    if (!err) return "Something went wrong.";
    if (typeof err === "string") return err;
    if (err?.data?.message) return err.data.message;
    if (err?.error) return err.error;
    return "Request failed. Please try again.";
  };

  // ✅ NEW handler for Change Status button
  const onChangeStatus = async () => {
    const currentStatus = (post.status || "draft").toString().toLowerCase();

    const statusOptions: Record<string, string> = {
      draft: "Draft",
      published: "Published",
      archived: "Archived",
    };

    // 1) Select popup
    const selectRes = await Swal.fire({
      title: "Change post status",
      text: "Select what the current status should be.",
      input: "select",
      inputOptions: statusOptions,
      inputValue: statusOptions[currentStatus] ? currentStatus : "draft",
      showCancelButton: true,
      confirmButtonText: "Next",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) return "Please select a status.";
        return null;
      },
    });

    if (!selectRes.isConfirmed) return;

    const nextStatus = (selectRes.value || "").toString().toLowerCase();

    if (!nextStatus || nextStatus === currentStatus) {
      toast("info", "No status change selected.");
      return;
    }

    // 2) Confirmation popup
    const confirmRes = await Swal.fire({
      title: "Confirm status change",
      icon: "warning",
      html: `Change status from <b>${statusOptions[currentStatus] || currentStatus}</b> to <b>${
        statusOptions[nextStatus] || nextStatus
      }</b>?`,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      focusCancel: true,
    });

    if (!confirmRes.isConfirmed) return;

    // 3) Loading popup + API call
    Swal.fire({
      title: "Updating status…",
      text: "Please wait",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      // ✅ adjust payload shape to your API
      // e.g. { id: post._id, status: nextStatus }
      await updatePostStatus({ id: post._id, status: nextStatus }).unwrap();

      Swal.close();

      // ✅ React Suite success message
      toast("success", `Status updated to "${nextStatus}".`);

      // optional: refetch post if your query doesn't auto-update
      // refetch();
    } catch (err) {
      Swal.close();

      // ✅ React Suite error message
      toast("error", getApiErrorMessage(err));
    }
  };
  return (
    <Button
      appearance="ghost"
      startIcon={<RefreshCw size={18} />}
      onClick={onChangeStatus}
      className="!rounded-xl !border !border-[var(--border)] !bg-[var(--accent)] hover:!bg-white"
    >
      Change status
    </Button>
  );
};

export default StatusChangingButton;
function toast(arg0: string, arg1: string) {
  throw new Error("Function not implemented.");
}
