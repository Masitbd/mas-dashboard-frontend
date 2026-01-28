import type { Role } from "@/types/roles";

export interface Author {
  id: string;
  name: string;
  role: Role;
  image?: string;
  bio?: string;
  displayName: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: Author;
  publishedAt: string;
  readingTime: string;
}

export interface Comment {
  id: string;
  postId: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  approved: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}
