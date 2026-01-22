import { baseApi } from "../baseApi";

const supplierApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postDueCollection: build.mutation({
      query: (data) => ({
        url: "/payments/due-collection",
        method: "POST",
        body: data,
        data: data,
      }),
      invalidatesTags: ["single-medicine"],
    }),
  }),
});

export const { usePostDueCollectionMutation } = supplierApi;
