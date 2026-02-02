// redux/features/category/categoryApi.ts
"use client";

import { baseApi } from "../baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation<
      string,
      {
        oldPassword: string;
        newPassword: string;
      }
    >({
      query: (body) => ({
        url: `/auth/change-password`,
        method: "PATCH",
        body,
        data: body,
      }),
    }),
  }),
});

export const { useChangePasswordMutation } = authApi;

export default authApi;
