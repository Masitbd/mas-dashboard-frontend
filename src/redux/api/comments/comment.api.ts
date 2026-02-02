import { baseApi } from "../baseApi";

/**
 * If you already have these types elsewhere, remove these and import your own.
 */
export type CommentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "spam"
  | "deleted";

export type TComment = {
  _id: string;
  post: string; // ObjectId as string
  author: any; // or your profile type
  parent?: string | null;
  content: string;
  status: CommentStatus;
  editedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type TApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export type TCreateCommentPayload = {
  postId: string;
  content: string;
  parentCommentId?: string | null;
};

export type TUpdateCommentPayload = {
  id: string;
  content: string;
};

export type TModerateCommentPayload = {
  id: string;
  status: CommentStatus;
};

export type TGetCommentsByPostQuery = {
  postId: string;

  page?: number;
  limit?: number;
  includeReplies?: boolean;
  sortOrder?: "asc" | "desc";

  // staff/admin may use this; public will usually ignore server-side
  status?: CommentStatus | "all";
};

export type TCommentListResult = {
  data: TComment[];
  meta: TPaginationMeta;
};

export const commentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // POST /comment
    createComment: build.mutation<
      TApiResponse<TComment>,
      TCreateCommentPayload
    >({
      query: (body) => ({
        url: "/comment",
        method: "POST",
        body,
        data: body,
      }),
      invalidatesTags: (result, error, arg) => [
        "comment-list",
        { type: "comment-list", id: arg.postId },
      ],
    }),

    // GET /comment/post/:postId
    getCommentsByPost: build.query<
      TApiResponse<TCommentListResult>,
      TGetCommentsByPostQuery
    >({
      query: ({ postId, ...params }) => ({
        url: `/comment/post/${postId}`,
        method: "GET",
        params,
      }),
      providesTags: (result, error, arg) => [
        "comment-list",
        { type: "comment-list", id: arg.postId },
      ],
    }),

    // GET /comment/:id
    getCommentById: build.query<TApiResponse<TComment>, string>({
      query: (id) => ({
        url: `/comment/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "comment", id }],
    }),

    // PATCH /comment/:id
    updateComment: build.mutation<
      TApiResponse<TComment>,
      TUpdateCommentPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/comment/${id}`,
        method: "PATCH",
        body,
        data: body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "comment", id: arg.id },
        "comment-list",
      ],
    }),

    // DELETE /comment/:id
    deleteComment: build.mutation<TApiResponse<string>, string>({
      query: (id) => ({
        url: `/comment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "comment", id },
        "comment-list",
      ],
    }),

    // PATCH /comment/moderate/:id
    moderateComment: build.mutation<
      TApiResponse<string>,
      TModerateCommentPayload
    >({
      query: ({ id, status }) => ({
        url: `/comment/moderate/${id}`,
        method: "PATCH",
        body: { status },
        data: { status },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "comment", id: arg.id },
        "comment-list",
      ],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useGetCommentsByPostQuery,
  useGetCommentByIdQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useModerateCommentMutation,
} = commentApi;
