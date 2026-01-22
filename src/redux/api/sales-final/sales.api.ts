import { baseApi } from "../baseApi";

/* =========================
 * Types (adjust if you already have these elsewhere)
 * ========================= */

export type PaymentMethod = "cash" | "card" | "bank";
export type CustomerMode = "registered" | "unregistered";
export type PatientType = "outdoor" | "indoor";

export type SaleUpsertDTO = {
  customer: {
    mode: CustomerMode;
    customerId: string | null;

    name: string;
    field: string;
    address: string;
    contactNo: string;

    patientType: PatientType;
    bedNo?: string | null;
    indoorBillNo?: string | null;
  };

  items: Array<{
    medicineObjectId: string;
    stockId: string;
    qty: number;
    rate: number;
    discountPct: number;
    vatPct: number;
    stockUpdatedAt?: string | null;
  }>;

  finance: {
    extraDiscount: number; // amount
    paymentMethod: PaymentMethod;
    paid: number; // amount
  };

  note?: string | null;
};

export type SaleWriteResult = {
  saleId: string;
  invoiceNo: string;
  version: number;
};

export type SaleInvoiceResponse = any; // replace with your invoice DTO if you want strict typing
export type SaleUiResponse = any; // replace with your UI DTO if you want strict typing

/* =========================
 * API
 * ========================= */

export const salesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSale: build.mutation<SaleWriteResult, SaleUpsertDTO>({
      query: (payload) => ({
        url: "/sales-v2/create-sale",
        method: "POST",
        body: payload,
        // some projects keep this; harmless if ignored by fetchBaseQuery
        data: payload as any,
      }),
      invalidatesTags: [
        "sale",
        "sale-ui",
        "sale-invoice",
        "sales-list",
        "all-sales",
      ],
    }),

    updateSale: build.mutation<
      SaleWriteResult,
      { saleId: string; payload: SaleUpsertDTO }
    >({
      query: ({ saleId, payload }) => ({
        url: `/sales-v2/${saleId}`,
        method: "PATCH",
        body: payload,
        data: payload as any,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "sale", id: arg.saleId },
        { type: "sale-ui", id: arg.saleId },
        { type: "sale-invoice", id: arg.saleId },
        "sales-list",
      ],
    }),

    getSaleInvoice: build.query<
      SaleInvoiceResponse,
      { id: string; version?: number }
    >({
      query: ({ id, version }) => ({
        url: `/sales-v2/sale-invoice/${id}`,
        method: "GET",
        params: version ? { version } : undefined,
      }),
      providesTags: (_r, _e, arg) => [{ type: "sale-invoice", id: arg.id }],
    }),

    getSaleUi: build.query<SaleUiResponse, string>({
      query: (id) => ({
        url: `/sales-v2/sale-ui/${id}`,
        method: "GET",
      }),
      providesTags: (_r, _e, id) => [{ type: "sale-ui", id }],
    }),
    getAllSales: build.query<SaleUiResponse, string>({
      query: (params: any) => ({
        url: `/sales-v2`,
        method: "GET",
        params: params,
      }),
      providesTags: (_r, _e, id) => [{ type: "all-sales", id }],
    }),
    getSaleUpdate: build.query<SaleUiResponse, string>({
      query: (id) => ({
        url: `/sales-v2/sale-update/${id}`,
        method: "GET",
      }),
      providesTags: (_r, _e, id) => [{ type: "sale-ui", id }],
    }),
  }),
});

/* =========================
 * Hooks
 * ========================= */

export const {
  useCreateSaleMutation,
  useUpdateSaleMutation,
  useGetSaleInvoiceQuery,
  useLazyGetSaleInvoiceQuery,
  useGetSaleUiQuery,
  useLazyGetSaleUiQuery,
  useLazyGetSaleUpdateQuery,
  useGetSaleUpdateQuery,
  useGetAllSalesQuery,
} = salesApi;
