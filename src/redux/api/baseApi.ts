// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { axiosBaseQuery } from "@/axios/axiosBaseQuery";
import config from "@/config";
import { createApi } from "@reduxjs/toolkit/query/react";

// initialize an empty api service that we'll inject endpoints into later as needed
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery({ baseUrl: config.server_url as string }),
  endpoints: () => ({}),
  tagTypes: [
    "user-list",
    "supplier-list",
    "single-supplier",
    "category-list",
    "single-category",
    "generic-list",
    "single-generic",
    "medicine-list",
    "medicine-sales",
    "single-medicine",
    "purchase-list",
    "stock",
    "single-stock",
    "reports",
    "purchase-payment-list",
    "single-purchase",
    "single-profile",
    "single-user",
    "customer-list",
    "single-customer",
    "sale-list",
    "single-sale",
    "stock-list",
    "sale",
    "sale-ui",
    "sale-invoice",
    "sales-list",
    "all-sales",
    "Posts",
    "Comments",
    "Newsletter",
    "Profiles",
    "Categories",
    "Tags",
    "comment",
    "comment-list",
  ],
});
