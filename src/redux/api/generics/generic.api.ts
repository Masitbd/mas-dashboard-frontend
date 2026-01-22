import { baseApi } from "../baseApi";

const genericApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createGeneric: build.mutation({
      query: (data) => ({
        url: "/generics",
        method: "POST",
        body: data,
        data: data,
      }),
      invalidatesTags: ["generic-list"],
    }),
    getGenerics: build.query({
      query: (query) => ({
        url: "/generics",
        method: "GET",
        params: query,
      }),
      providesTags: ["generic-list"],
    }),
    getSingleGeneric: build.query({
      query: (id: string) => ({
        url: `/generics/${id}`,
        method: "GET",
      }),
      providesTags: ["single-generic"],
    }),
    getGenericQuery: build.query({
      query: (id: string) => ({
        url: `/generics/${id}`,
        method: "GET",
      }),
      providesTags: ["single-generic"],
    }),
    updateGeneric: build.mutation({
      query: ({ id, data }) => ({
        url: `/generics/${id}`,
        method: "PATCH",
        body: data,
        data: data,
      }),
      invalidatesTags: ["generic-list", "single-generic"],
    }),
    deleteGeneric: build.mutation({
      query: (id: string) => ({
        url: `/generics/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["generic-list"],
    }),
  }),
});

export const {
  useCreateGenericMutation,
  useGetGenericsQuery,
  useGetSingleGenericQuery,

  useUpdateGenericMutation,
  useDeleteGenericMutation,
} = genericApi;
