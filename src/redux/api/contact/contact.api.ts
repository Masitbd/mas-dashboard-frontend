// redux/api/contacts/contact.api.ts
"use client";

import { baseApi } from "../baseApi";

/** ===== Types (you can move these to @/types if you already have common ones) ===== */
export type Contact = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiResponse<T> = {
  statusCode?: number;
  success: boolean;
  message?: string;
  data: T;
};

export type PaginatedResult<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: T[];
};

export type SingleResponse<T> = ApiResponse<T>;
export type PaginatedResponse<T> = ApiResponse<PaginatedResult<T>>;

export type CreateContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactListQuery = {
  page?: number | string;
  limit?: number | string;
  searchTerm?: string;
  name?: string;
  email?: string;
  subject?: string;
  sort?: "newest" | "oldest" | "nameAsc" | "nameDesc";
};

/** ===== API ===== */
const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /contact (Public)
    createContact: builder.mutation<
      SingleResponse<Contact>,
      CreateContactPayload
    >({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
        data: body,
      }),
      invalidatesTags: ["Contacts"],
    }),

    // GET /contact (Admin, Super Admin)
    getContacts: builder.query<PaginatedResponse<Contact>, ContactListQuery>({
      query: (params) => ({
        url: "/contact",
        method: "GET",
        params,
      }),
      providesTags: ["Contacts"],
    }),

    // GET /contact/:id (Admin, Super Admin)
    getContactById: builder.query<SingleResponse<Contact>, string>({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "GET",
      }),
      providesTags: ["Contacts"],
    }),
  }),
});

export const {
  useCreateContactMutation,
  useGetContactsQuery,
  useLazyGetContactsQuery,
  useGetContactByIdQuery,
  useLazyGetContactByIdQuery,
} = contactApi;

export default contactApi;
