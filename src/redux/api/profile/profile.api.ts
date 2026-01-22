// redux/features/profile/profileApi.ts
import { baseApi } from "../baseApi";

export type UserProfile = {
  uuid: string;
  displayName: string;

  avatarUrl: string | null;
  bio: string | null;

  websiteUrl: string | null;
  location: string | null;

  twitterUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;

  createdAt?: string;
  updatedAt?: string;
};

export type PaginatedProfilesResponse = {
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    data: UserProfile[];
  };
  success?: boolean;
  message?: string;
};

export type SingleProfileResponse = {
  data: UserProfile;
  success?: boolean;
  message?: string;
};

export type DeleteProfileResponse = {
  data: UserProfile;
  success?: boolean;
  message?: string;
};

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /profiles?page=&limit=&q=&location=&hasAvatar=&sort=
    getProfiles: builder.query<
      PaginatedProfilesResponse,
      Record<string, string>
    >({
      query: (params) => ({
        url: "/profiles",
        params,
        method: "GET",
      }),
      providesTags: ["Profiles"],
    }),

    getMyProfile: builder.query({
      query: () => ({
        url: "/profile/me",
        method: "GET",
      }),
      providesTags: ["Profiles"],
    }),
    // PATCH /profiles/:uuid
    updateMyOwnProfile: builder.mutation<
      SingleProfileResponse,
      { body: Partial<UserProfile> }
    >({
      query: ({ body }) => ({
        url: `/profile/me`,
        method: "PATCH",
        body,
        data: body,
      }),
      invalidatesTags: ["Profiles"],
    }),

    // GET /profiles/:uuid
    getProfileByUuid: builder.query<SingleProfileResponse, string>({
      query: (uuid) => ({
        url: `/profiles/${uuid}`,
        method: "GET",
      }),
      providesTags: ["Profiles"],
    }),

    // POST /profiles
    createProfile: builder.mutation<
      SingleProfileResponse,
      Partial<UserProfile>
    >({
      query: (body) => ({
        url: "/profiles",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profiles"],
    }),

    // PATCH /profiles/:uuid
    updateProfile: builder.mutation<
      SingleProfileResponse,
      { uuid: string; body: Partial<UserProfile> }
    >({
      query: ({ uuid, body }) => ({
        url: `/profiles/${uuid}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Profiles"],
    }),

    // DELETE /profiles/:uuid
    deleteProfile: builder.mutation<DeleteProfileResponse, string>({
      query: (uuid) => ({
        url: `/profiles/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Profiles"],
    }),
  }),
});

export const {
  useGetProfilesQuery,
  useGetProfileByUuidQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useGetMyProfileQuery,
  useUpdateMyOwnProfileMutation,
} = profileApi;
