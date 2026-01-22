import { baseApi } from "../baseApi";

const medicineApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createMedicine: build.mutation({
      query: (data) => ({
        url: "/medicines/create-medicine",
        method: "POST",
        body: data,
        data: data,
      }),
      invalidatesTags: ["medicine-list"],
    }),
    getMedicines: build.query({
      query: (query) => ({
        url: "/medicines",
        method: "GET",
        params: query,
      }),
      providesTags: ["medicine-list"],
    }),
    getMedicinesWithStock: build.query({
      query: (query) => ({
        url: "/medicines/with-stock",
        method: "GET",
        params: query,
      }),
      providesTags: ["medicine-list"],
    }),
    getSingleMedicine: build.query({
      query: (id: string) => ({
        url: `/medicines/${id}`,
        method: "GET",
      }),
      providesTags: ["single-medicine"],
    }),
    getMedicineForSales: build.query({
      query: (query) => ({
        url: `/medicines/sales`,
        method: "GET",
        params: query,
      }),
      providesTags: ["single-medicine"],
    }),
    updateMedicine: build.mutation({
      query: (data) => ({
        url: `/medicines/${data._id}`,
        method: "PATCH",
        body: data,
        data: data,
      }),
      invalidatesTags: ["medicine-list", "single-medicine"],
    }),
    deleteMedicine: build.mutation({
      query: (id: string) => ({
        url: `/medicines/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["medicine-list"],
    }),
  }),
});

export const {
  useCreateMedicineMutation,
  useGetMedicinesQuery,
  useGetMedicinesWithStockQuery,
  useGetSingleMedicineQuery,
  useUpdateMedicineMutation,
  useDeleteMedicineMutation,
  useLazyGetSingleMedicineQuery,
  useGetMedicineForSalesQuery,
  useLazyGetMedicineForSalesQuery,
} = medicineApi;
