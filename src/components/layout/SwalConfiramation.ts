import Swal, { SweetAlertResult } from "sweetalert2";

type Id = string | number;

const swalWithBootstrapButtons = Swal;
export type ConfirmDeleteOptions = {
  title?: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;

  loadingTitle?: string;
  loadingText?: string;

  successTitle?: string;
  successText?: string;

  errorTitle?: string;
  errorText?: string;

  cancelledTitle?: string;
  cancelledText?: string;
};

export type ConfirmDeleteResult<T> =
  | { confirmed: false }
  | { confirmed: true; ok: true; data: T }
  | { confirmed: true; ok: false; error: unknown };

export async function confirmDeleteById<T>(
  id: Id,
  onDelete: (id: Id) => Promise<T>,
  opts: ConfirmDeleteOptions = {},
): Promise<ConfirmDeleteResult<T>> {
  const {
    title = "Are you sure?",
    text = "You won't be able to revert this!",
    confirmButtonText = "Yes, delete it!",
    cancelButtonText = "No, cancel!",

    loadingTitle = "Deleting...",
    loadingText = "Please wait while we process your request.",

    successTitle = "Deleted!",
    successText = "Item has been deleted successfully.",

    errorTitle = "Failed!",
    errorText = "Delete failed. Please try again.",

    cancelledTitle = "Cancelled",
    cancelledText = "Your item is safe.",
  } = opts;

  const result: SweetAlertResult = await swalWithBootstrapButtons.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    cancelButtonColor: "red",
    confirmButtonColor: "#00a59b",
  });

  if (!result.isConfirmed) {
    if (result.dismiss === Swal.DismissReason.cancel) {
      await swalWithBootstrapButtons.fire({
        title: cancelledTitle,
        text: cancelledText,
        icon: "error",
      });
    }
    return { confirmed: false };
  }

  // Loading modal
  Swal.fire({
    title: loadingTitle,
    text: loadingText,
    icon: "info",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const data = await onDelete(id);

    Swal.close();
    await swalWithBootstrapButtons.fire({
      title: successTitle,
      text: successText,
      icon: "success",
    });

    return { confirmed: true, ok: true, data };
  } catch (error) {
    Swal.close();

    const message =
      // axios-style errors
      (error as any)?.response?.data?.message ??
      // native errors
      (error as any)?.message ??
      errorText;

    await swalWithBootstrapButtons.fire({
      title: errorTitle,
      text: String(message),
      icon: "error",
    });

    return { confirmed: true, ok: false, error };
  }
}
