// src/redux/features/customer/customerApi.ts
import { baseApi } from "../baseApi";

const customerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createCustomer: build.mutation({
      query: (data) => ({
        url: "/customer",
        method: "POST",
        body: data,
        data,
      }),
      invalidatesTags: ["customer-list"],
    }),

    // Fetch all customers (quick list: uuid, fullName, phone)
    // Supports params: searchTerm, page, limit, onlyActive
    getCustomers: build.query({
      query: (query) => ({
        url: "/customer",
        method: "GET",
        params: query,
      }),
      providesTags: ["customer-list"],
    }),

    // Fetch single customer by uuid
    getSingleCustomer: build.query({
      query: (uuid: string) => ({
        url: `/customer/${uuid}`,
        method: "GET",
      }),
      providesTags: ["single-customer"],
    }),

    // Update customer by uuid
    updateCustomer: build.mutation({
      query: ({ uuid, data }) => ({
        url: `/customer/${uuid}`,
        method: "PATCH",
        body: data,
        data,
      }),
      invalidatesTags: ["customer-list", "single-customer"],
    }),

    // Delete customer by uuid
    deleteCustomer: build.mutation({
      query: (uuid: string) => ({
        url: `/customer/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["customer-list"],
    }),
  }),
});

export const {
  useCreateCustomerMutation,
  useGetCustomersQuery,
  useLazyGetCustomersQuery,
  useGetSingleCustomerQuery,
  useLazyGetSingleCustomerQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;

export default customerApi;
