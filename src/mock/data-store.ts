import { posts as initialPosts, comments as initialComments, subscribers as initialSubscribers } from './posts';
import type { Post, Comment, NewsletterSubscriber } from '@/types/blog';

let posts = [...initialPosts];
let comments = [...initialComments];
let subscribers = [...initialSubscribers];

export function getPosts() {
  return posts;
}

export function setPosts(next: Post[]) {
  posts = next;
}

export function getComments() {
  return comments;
}

export function setComments(next: Comment[]) {
  comments = next;
}

export function getSubscribers() {
  return subscribers;
}

export function setSubscribers(next: NewsletterSubscriber[]) {
  subscribers = next;
}
