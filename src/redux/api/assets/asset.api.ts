import { baseApi } from "../baseApi";

// ---------- Types ----------
export type AssetProvider = "cloudinary" | "s3" | "r2" | "local";
export type AssetStatus = "active" | "orphaned" | "pending_delete" | "deleted";

export type AssetRefKind = "post" | "profile" | "category" | "comment";

export type AssetUseRef = {
  kind: AssetRefKind;
  refId: string;
  field: string;
};

export type Asset = {
  secureUrl: string;
  _id: string;
  url: string;

  provider: AssetProvider;
  key: string;

  owner: string;
  status: AssetStatus;

  refCount: number;
  usedBy: AssetUseRef[];

  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
  format?: string;
  originalName?: string;

  orphanedAt?: string | null;
  deletedAt?: string | null;

  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> = {
  url: any;
  secureUrl: any;
  success: boolean;
  message: string;
  data: T;
};

// ---------- Endpoints ----------
export const assetApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // 1) Upload image -> creates new Asset
    uploadAsset: build.mutation<ApiResponse<Asset>, { file: File }>({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/assets/upload",
          method: "POST",
          body: formData,
          data: formData,
          contentType: "multipart/form-data",
        };
      },
      invalidatesTags: ["assets"],
    }),

    // 2) Replace image for an existing Asset -> destroys old cloudinary image (server side)
    replaceAsset: build.mutation<
      ApiResponse<Asset>,
      { id: string; file: File }
    >({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `/assets/${id}/replace`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["assets"],
    }),

    // 3) Delete an Asset -> destroys from cloudinary (server side) if refCount==0
    deleteAsset: build.mutation<ApiResponse<Asset>, { id: string }>({
      query: ({ id }) => ({
        url: `/assets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["assets"],
    }),
    deleteAssetByUrl: build.mutation<ApiResponse<Asset>, { url: string }>({
      query: ({ url }) => ({
        url: "/assets/by-url",
        method: "DELETE",
        data: { url },
        contentType: "application/json",
      }),
      invalidatesTags: ["assets"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useUploadAssetMutation,
  useReplaceAssetMutation,
  useDeleteAssetMutation,
  useDeleteAssetByUrlMutation,
} = assetApi;
