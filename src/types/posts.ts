// redux/features/post/post.types.ts
/**
 * Clean TypeScript model for a multi-user blog:
 * - PostRaw: what you send/receive when NOT populating (ids only)
 * - PostPopulated: what you receive when populate=true (objects)
 * - PostAny: union for convenience in UI code
 */

export type ObjectIdString = string;

export type CategoryDTO = {
  _id: ObjectIdString;
  name: string;
  description?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TagDTO = {
  _id: ObjectIdString;
  name: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthorDTO = {
  _id: ObjectIdString;

  email?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  displayName: string;
};

export type PostBase = {
  _id: ObjectIdString;

  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;

  readingTime?: string;

  createdAt?: string;
  updatedAt?: string;
  status: string;
};

export type PostRaw = PostBase & {
  category: ObjectIdString;
  tags: ObjectIdString[];
  authorId: ObjectIdString;
};

export type PostPopulated = PostBase & {
  category: CategoryDTO;
  tags: TagDTO[];
  author: AuthorDTO;
};

// For UI components that don't care which one it is
export type PostAny = PostRaw | PostPopulated;

// -----------------------------
// API response wrappers (match your backend pattern)
// -----------------------------
export type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type PaginatedResponse<T> = {
  data: {
    meta: Meta;
    data: T[];
  };
  success?: boolean;
  message?: string;
};

export type SingleResponse<T> = {
  data: T;
  success?: boolean;
  message?: string;
};

export type DeleteResponse<T> = {
  data: T;
  success?: boolean;
  message?: string;
};

// -----------------------------
// Request payloads (what you send to backend)
// -----------------------------
export type CreatePostPayload = {
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;

  category: ObjectIdString;
  tagIds?: ObjectIdString[];
  authorId?: ObjectIdString; // optional if backend uses req.user

  readingTime?: string;
};

export type UpdatePostPayload = Partial<CreatePostPayload>;

// ------------------------Top Categories------------------
export type TopCategoryWithPostCount = {
  _id: string; // ObjectId as string
  postCount: number;
  name: string;
  description: string;
};
