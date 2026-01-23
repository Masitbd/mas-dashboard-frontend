// redux/features/category/categoryApi.ts
"use client";

import { baseApi } from "../baseApi";

export type Category = {
  _id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PaginatedCategoriesResponse = {
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    data: Category[];
  };
  success?: boolean;
  message?: string;
};

export type SingleCategoryResponse = {
  data: Category;
  success?: boolean;
  message?: string;
};

export type DeleteCategoryResponse = {
  data: Category;
  success?: boolean;
  message?: string;
};

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /categories?page=&limit=&q=&sort=
    getCategories: builder.query<
      PaginatedCategoriesResponse,
      Record<string, string>
    >({
      query: (params) => ({
        url: "/categories",
        params,
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),

    // GET /categories/:id
    getCategoryById: builder.query<SingleCategoryResponse, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),

    // POST /categories
    createCategory: builder.mutation<SingleCategoryResponse, Partial<Category>>(
      {
        query: (body) => ({
          url: "/categories",
          method: "POST",
          body,
          data: body,
        }),
        invalidatesTags: ["Categories"],
      },
    ),

    // PATCH /categories/:id
    updateCategory: builder.mutation<
      SingleCategoryResponse,
      { id: string; body: Partial<Category> }
    >({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body,
        data: body,
      }),
      invalidatesTags: ["Categories"],
    }),

    // DELETE /categories/:id
    deleteCategory: builder.mutation<DeleteCategoryResponse, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useLazyGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;

export default categoryApi;
