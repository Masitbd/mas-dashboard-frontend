import { baseApi } from "../baseApi";

const medicineSalesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createMedicineSales: build.mutation({
      query: (data) => ({
        url: "/sales",
        method: "POST",
        body: data,
        data: data,
      }),
      invalidatesTags: ["medicine-sales"],
    }),
    getMedicinesSales: build.query({
      query: (query: Record<string, string>) => ({
        url: "/sales",
        method: "GET",
        params: query,
      }),
      providesTags: ["medicine-sales"],
    }),
    getSingleMedicineSales: build.query({
      query: (id: string) => ({
        url: `/sales/${id}`,
        method: "GET",
      }),
      providesTags: ["single-medicine"],
    }),
    updateMedicineSales: build.mutation({
      query: ({ id, data }) => ({
        url: `/sales/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["medicine-sales", "single-medicine"],
    }),
    deleteMedicineSales: build.mutation({
      query: (id: string) => ({
        url: `/sales/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["medicine-sales"],
    }),
  }),
});

export const {
  useCreateMedicineSalesMutation,
  useGetMedicinesSalesQuery,
  useUpdateMedicineSalesMutation,
  useDeleteMedicineSalesMutation,
  useGetSingleMedicineSalesQuery,
} = medicineSalesApi;
