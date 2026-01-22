import { NewsletterSubscriber, Post } from "@/types/blog";
import { baseApi } from "../baseApi";

const supplierApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<
      { data: Post[]; total: number },
      Record<string, string>
    >({
      query: (params) => ({
        url: "/api/posts",
        params,
      }),
      providesTags: ["Posts"],
    }),
    getPostBySlug: builder.query<Post, string>({
      query: (slug) => `/api/posts/${slug}`,
      providesTags: ["Posts"],
    }),
    createPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: "/api/posts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Posts"],
    }),
    updatePost: builder.mutation<Post, { id: string; body: Partial<Post> }>({
      query: ({ id, body }) => ({
        url: `/api/posts/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Posts"],
    }),
    deletePost: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),
    getComments: builder.query<Comment[], string>({
      query: (postId) => ({
        url: "/api/comments",
        params: { postId },
      }),
      providesTags: ["Comments"],
    }),
    addComment: builder.mutation<Comment, Partial<Comment>>({
      query: (body) => ({
        url: "/api/comments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Comments"],
    }),
    updateComment: builder.mutation<
      Comment,
      { id: string; body: Partial<Comment> }
    >({
      query: ({ id, body }) => ({
        url: `/api/comments/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Comments"],
    }),
    subscribeNewsletter: builder.mutation<
      NewsletterSubscriber,
      { email: string }
    >({
      query: (body) => ({
        url: "/api/newsletter/subscribe",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Newsletter"],
    }),
    getSubscribers: builder.query<NewsletterSubscriber[], void>({
      query: () => "/api/newsletter/subscribers",
      providesTags: ["Newsletter"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostBySlugQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useSubscribeNewsletterMutation,
  useGetSubscribersQuery,
} = supplierApi;
