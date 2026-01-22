import { baseApi } from "../baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createCategory: build.mutation({
      query: (data) => ({
        url: "/category",
        method: "POST",
        body: data,
        data: data,
      }),
      invalidatesTags: ["category-list"],
    }),
    getCategories: build.query({
      query: (query) => ({
        url: "/category",
        method: "GET",
        params: query,
      }),
      providesTags: ["category-list"],
    }),
    getSingleCategory: build.query({
      query: (id: string) => ({
        url: `/category/${id}`,
        method: "GET",
      }),
      providesTags: ["single-category"],
    }),
    updateCategory: build.mutation({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        method: "PATCH",
        body: data,
        data,
      }),
      invalidatesTags: ["category-list", "single-category"],
    }),
    deleteCategory: build.mutation({
      query: (id: string) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category-list"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
