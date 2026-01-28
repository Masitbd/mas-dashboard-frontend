// redux/features/post/postApi.ts
"use client";

import { PostStatus } from "@/components/layout/Status";
import { baseApi } from "../baseApi";
import type {
  CreatePostPayload,
  UpdatePostPayload,
  PaginatedResponse,
  SingleResponse,
  DeleteResponse,
  PostRaw,
  PostPopulated,
} from "@/types/posts";

/**
 * Design:
 * - Non-populated endpoints use PostRaw
 * - Populated endpoints use PostPopulated
 *
 * This keeps TypeScript strict and avoids "sometimes string sometimes object" mess.
 */

const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /posts?page=&limit=&searchTerm=&sort=&categoryId=&authorId=&tagId=
    getPosts: builder.query<PaginatedResponse<PostRaw>, Record<string, any>>({
      query: (params) => ({
        url: "/posts",
        params,
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),

    // GET /posts?...&populate=true
    getPostsPopulated: builder.query<
      PaginatedResponse<PostPopulated>,
      Record<string, any>
    >({
      query: (params) => ({
        url: "/posts",
        params: { ...params, populate: "true" },
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),

    // GET /posts/:id
    getPostById: builder.query<SingleResponse<PostRaw>, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),

    // GET /posts/:id?populate=true
    getPostByIdPopulated: builder.query<SingleResponse<PostPopulated>, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        params: { populate: "true" },
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),

    // GET /posts/slug/:slug
    getPostBySlug: builder.query<SingleResponse<PostRaw>, string>({
      query: (slug) => ({
        url: `/posts/slug/${slug}`,
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),

    // GET /posts/slug/:slug?populate=true
    getPostBySlugPopulated: builder.query<
      SingleResponse<PostPopulated>,
      string
    >({
      query: (slug) => ({
        url: `/posts/slug/${slug}`,
        params: { populate: "true" },
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),

    // POST /posts
    createPost: builder.mutation<SingleResponse<PostRaw>, CreatePostPayload>({
      query: (body) => ({
        url: "/posts",
        method: "POST",
        body,
        data: body,
      }),
      invalidatesTags: ["Posts"],
    }),

    // PATCH /posts/:id
    updatePost: builder.mutation<
      SingleResponse<PostRaw>,
      { id: string; body: UpdatePostPayload }
    >({
      query: ({ id, body }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body,
        data: body,
      }),
      invalidatesTags: ["Posts"],
    }),

    // DELETE /posts/:id
    deletePost: builder.mutation<DeleteResponse<PostRaw>, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),

    // POST /posts/:id/tags  body: { tagIds: string[] }
    addTagsToPost: builder.mutation<
      SingleResponse<PostRaw>,
      { id: string; tagIds: string[] }
    >({
      query: ({ id, tagIds }) => ({
        url: `/posts/${id}/tags`,
        method: "POST",
        body: { tagIds },
        data: { tagIds },
      }),
      invalidatesTags: ["Posts"],
    }),

    // DELETE /posts/:id/tags  body: { tagIds: string[] }
    removeTagsFromPost: builder.mutation<
      SingleResponse<PostRaw>,
      { id: string; tagIds: string[] }
    >({
      query: ({ id, tagIds }) => ({
        url: `/posts/${id}/tags`,
        method: "DELETE",
        body: { tagIds },
        data: { tagIds },
      }),
      invalidatesTags: ["Posts"],
    }),

    // DELETE /posts/:id/tags  body: { tagIds: string[] }
    changePostStatus: builder.mutation<
      SingleResponse<{ data: string }>,
      { id: string; status: PostStatus }
    >({
      query: ({ id, status }) => ({
        url: `/posts/change-status/${id}`,
        method: "PATCH",
        body: { status },
        data: { status },
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useLazyGetPostsQuery,
  useGetPostsPopulatedQuery,
  useLazyGetPostsPopulatedQuery,

  useGetPostByIdQuery,
  useLazyGetPostByIdQuery,
  useGetPostByIdPopulatedQuery,
  useLazyGetPostByIdPopulatedQuery,

  useGetPostBySlugQuery,
  useLazyGetPostBySlugQuery,
  useGetPostBySlugPopulatedQuery,
  useLazyGetPostBySlugPopulatedQuery,

  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,

  useAddTagsToPostMutation,
  useRemoveTagsFromPostMutation,

  useChangePostStatusMutation,
} = postApi;

export default postApi;
