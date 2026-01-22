export type UserRole = "admin" | "editor" | "author" | "reader";
export type UserStatus = "active" | "disabled";

export type User = {
  id: string; // DB primary key (UUID/BIGINT/etc.)
  uuid: string; // stable public identifier

  email: string;
  username: string;
  passwordHash: string;

  role: UserRole;
  status: UserStatus;

  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
};

export type UserProfile = {
  id: string; // DB primary key
  uuid: string; // stable public identifier

  displayName: string;

  avatarUrl: string | null;
  bio: string | null;

  websiteUrl: string | null;
  location: string | null;

  twitterUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;

  createdAt: Date;
  updatedAt: Date;
};
