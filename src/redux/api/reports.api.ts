import { baseApi } from "./baseApi";

const reportsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMedicinesSalesReports: build.query({
      query: (query: Record<string, string>) => ({
        url: "/reports/medicine-sales-statement",
        method: "GET",
        params: query,
      }),
      providesTags: ["reports"],
    }),
    getDueCollectionReports: build.query({
      query: (args) => ({
        url: "/reports/due-collection",
        method: "GET",
        params: args,
      }),
      providesTags: ["single-medicine"],
    }),
    getDueCollectionSummeryReports: build.query({
      query: (args) => ({
        url: "/reports/due-collection-summery",
        method: "GET",
        params: args,
      }),
      providesTags: ["single-medicine"],
    }),
    getPatientDueReports: build.query({
      query: (args) => ({
        url: "/reports/patient-due-list",
        method: "GET",
        params: args,
      }),
      providesTags: ["single-medicine"],
    }),
    getMedicineStockOverview: build.query({
      query: (args) => ({
        url: "/reports/medicine-stock",
        method: "GET",
        params: args,
      }),
    }),
    getMedicineProfitOverview: build.query({
      query: (args) => ({
        url: "/reports/medicine-profit-loss",
        method: "GET",
        params: args,
      }),
    }),
  }),
});

export const {
  useGetDueCollectionReportsQuery,
  useGetDueCollectionSummeryReportsQuery,
  useGetMedicinesSalesReportsQuery,
  useGetPatientDueReportsQuery,
  useGetMedicineStockOverviewQuery,
  useGetMedicineProfitOverviewQuery,
} = reportsApi;
