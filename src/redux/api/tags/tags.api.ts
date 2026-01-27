// redux/features/tag/tagApi.ts
"use client";

import { baseApi } from "../baseApi";

export type Tag = {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PaginatedTagsResponse = {
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    data: Tag[];
  };
  success?: boolean;
  message?: string;
};

export type SingleTagResponse = {
  data: Tag;
  success?: boolean;
  message?: string;
};

export type DeleteTagResponse = {
  data: Tag;
  success?: boolean;
  message?: string;
};

const tagApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /tags?page=&limit=&q=&sort=
    getTags: builder.query<PaginatedTagsResponse, Record<string, string>>({
      query: (params) => ({
        url: "/tags",
        params,
        method: "GET",
      }),
      providesTags: ["Tags"],
    }),

    // GET /tags/:id
    getTagById: builder.query<SingleTagResponse, string>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: "GET",
      }),
      providesTags: ["Tags"],
    }),

    // POST /tags
    createTag: builder.mutation<SingleTagResponse, Partial<Tag>>({
      query: (body) => ({
        url: "/tags",
        method: "POST",
        body,
        data: body,
      }),
      invalidatesTags: ["Tags"],
    }),

    // PATCH /tags/:id
    updateTag: builder.mutation<
      SingleTagResponse,
      { id: string; body: Partial<Tag> }
    >({
      query: ({ id, body }) => ({
        url: `/tags/${id}`,
        method: "PATCH",
        body,
        data: body,
      }),
      invalidatesTags: ["Tags"],
    }),

    // DELETE /tags/:id
    deleteTag: builder.mutation<DeleteTagResponse, string>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tags"],
    }),
  }),
});

export const {
  useGetTagsQuery,
  useGetTagByIdQuery,
  useLazyGetTagByIdQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} = tagApi;

export default tagApi;
