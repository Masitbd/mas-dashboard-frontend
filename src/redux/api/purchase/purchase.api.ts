import { baseApi } from "../baseApi";

const purchaseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createPurchase: build.mutation({
      query: (data) => ({
        url: "/purchases/create-purchase",
        method: "POST",
        body: data,
        data: data,
      }),
      invalidatesTags: ["purchase-list"],
    }),
    getPurchases: build.query({
      query: (query) => ({
        url: "/purchases",
        method: "GET",
        params: query,
      }),
      providesTags: ["purchase-list"],
    }),
    getSinglePurchases: build.query({
      query: (id: string) => ({
        url: `/purchases/${id}`,
        method: "GET",
      }),
      providesTags: ["single-purchase"],
    }),
    getPurchasesQuery: build.query({
      query: (id: string) => ({
        url: `/purchases/${id}`,
        method: "GET",
      }),
      providesTags: ["purchase-list"],
    }),
    updatePurchases: build.mutation({
      query: ({ id, data }) => ({
        url: `/purchases/${id}`,
        method: "PATCH",
        body: data,
        data: data,
      }),
      invalidatesTags: ["purchase-list"],
    }),
    deletePurchases: build.mutation({
      query: (id: string) => ({
        url: `/purchases/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["purchase-list"],
    }),
    getPurchaseItemsForSinglePurchase: build.query({
      query: (id: string) => ({
        url: `/purchase-items/single-purchase/${id}`,
        method: "GET",
      }),
      providesTags: ["single-medicine"],
    }),

    getPurchaseInvoice: build.query({
      query: (id: string) => ({
        url: `/purchases/purchase-invoice/${id}`,
        method: "GET",
      }),
      providesTags: ["single-purchase"],
    }),
  }),
});

export const {
  useCreatePurchaseMutation,
  useGetPurchasesQuery,
  useGetPurchasesQueryQuery,
  useGetSinglePurchasesQuery,
  useLazyGetSinglePurchasesQuery,
  useLazyGetPurchaseItemsForSinglePurchaseQuery,
  useLazyGetPurchaseInvoiceQuery,
  useGetPurchaseInvoiceQuery,
  useUpdatePurchasesMutation,
} = purchaseApi;
