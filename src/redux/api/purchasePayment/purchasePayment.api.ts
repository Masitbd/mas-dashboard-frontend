import { PurchasePayment } from "@/components/medicine-purchese/PurchasePaymentTable";
import { baseApi } from "../baseApi";

const purchasePaymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Create a new purchase payment
    createPurchasePayment: build.mutation({
      query: (data) => ({
        url: "/purchase-payments/create-payment",
        method: "POST",
        body: data,
        data: data,
      }),
      // Invalidate both the payment list and purchases (due/paid totals often change)
      invalidatesTags: [
        "purchase-payment-list",
        "purchase-list",
        "single-purchase",
      ],
    }),

    // Get all purchase payments (supports optional filters/pagination)
    getPurchasePayments: build.query({
      query: (query) => ({
        url: "/purchase-payments",
        method: "GET",
        params: query ?? {},
      }),
      providesTags: ["purchase-payment-list"],
    }),

    // Get a single purchase payment by id
    getSinglePurchasePayment: build.query<{ data: PurchasePayment }, string>({
      query: (id) => ({
        url: `/purchase-payments/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [
        { type: "purchase-payment-list" as const, id },
      ],
    }),

    // Optional: update (PATCH) a purchase payment
    updatePurchasePayment: build.mutation({
      query: ({ id, data }) => ({
        url: `/purchase-payments/${id}`,
        method: "PATCH",
        body: data,
        data: data,
      }),
      invalidatesTags: ["purchase-payment-list", "purchase-list"],
    }),

    // Optional: delete a purchase payment
    deletePurchasePayment: build.mutation({
      query: (id) => ({
        url: `/purchase-payments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["purchase-payment-list", "purchase-list"],
    }),
  }),
});

export const {
  useCreatePurchasePaymentMutation,
  useGetPurchasePaymentsQuery,
  useLazyGetPurchasePaymentsQuery,
  useGetSinglePurchasePaymentQuery,
  useLazyGetSinglePurchasePaymentQuery,
  useUpdatePurchasePaymentMutation,
  useDeletePurchasePaymentMutation,
} = purchasePaymentApi;
