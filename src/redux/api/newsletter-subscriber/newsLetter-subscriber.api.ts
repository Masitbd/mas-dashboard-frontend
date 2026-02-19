// redux/api/newsletter-subscriber/newsletterSubscriber.api.ts
"use client";

import { baseApi } from "../baseApi";

/** ✅ Types (move these to /types if you prefer) */
export type NewsletterSubscriber = {
  _id: string;
  email: string;
  subscribed: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type SingleResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type PaginatedResult<T> = {
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
  data: T[];
};

export type CreateNewsletterSubscriberPayload = {
  email: string;
  subscribed: boolean;
};

export type NewsletterSubscriberQuery = {
  page?: number | string;
  limit?: number | string;
  searchTerm?: string;

  // filters
  email?: string;
  subscribed?: boolean | "true" | "false";

  // sort
  sort?: "newest" | "oldest" | "emailAsc" | "emailDesc";
};

const newsletterSubscriberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * 1) POST /newsletter-subscriber (Public)
     * body: { email, subscribed }
     */
    createNewsletterSubscriber: builder.mutation<
      SingleResponse<NewsletterSubscriber>,
      CreateNewsletterSubscriberPayload
    >({
      query: (body) => ({
        url: "/newsletter-subscriber",
        method: "POST",
        body,
        data: body, // keeps compatibility if your baseQuery uses axios
      }),
      invalidatesTags: ["NewsletterSubscribers"],
    }),

    /**
     * 2) GET /newsletter-subscriber (Admin, Super Admin)
     * query: page, limit, searchTerm, filters, sort
     */
    getNewsletterSubscribers: builder.query<
      SingleResponse<PaginatedResult<NewsletterSubscriber>>,
      NewsletterSubscriberQuery | void
    >({
      query: (params) => ({
        url: "/newsletter-subscriber",
        method: "GET",
        params,
      }),
      providesTags: ["NewsletterSubscribers"],
    }),

    /**
     * 3) GET /newsletter-subscriber/:id (Admin, Super Admin)
     */
    getNewsletterSubscriberById: builder.query<
      SingleResponse<NewsletterSubscriber>,
      string
    >({
      query: (id) => ({
        url: `/newsletter-subscriber/${id}`,
        method: "GET",
      }),
      providesTags: ["NewsletterSubscribers"],
    }),
  }),
});

export const {
  useCreateNewsletterSubscriberMutation,

  useGetNewsletterSubscribersQuery,
  useLazyGetNewsletterSubscribersQuery,

  useGetNewsletterSubscriberByIdQuery,
  useLazyGetNewsletterSubscriberByIdQuery,
} = newsletterSubscriberApi;

export default newsletterSubscriberApi;
