# Notebook Blog Frontend

A production-grade blog frontend built with Next.js App Router, Tailwind CSS, React Suite, Redux Toolkit, RTK Query, and NextAuth.

## Getting started

```bash
npm install
npm run dev
```

## Environment variables

Copy `.env.example` to `.env.local` and update the values.

## Route map

### Public
- `/` Home feed
- `/posts/[slug]` Post details
- `/categories/[slug]` Category listing
- `/tags/[slug]` Tag listing
- `/authors/[id]` Author profile
- `/search` Search results
- `/about` About
- `/contact` Contact
- `/signin` Sign in
- `/privacy` Privacy policy
- `/terms` Terms

### Dashboard (signed-in only)
- `/dashboard` Overview
- `/dashboard/posts` Posts list
- `/dashboard/posts/new` Create post
- `/dashboard/posts/[id]/edit` Edit post
- `/dashboard/comments` Comment moderation
- `/dashboard/newsletter` Subscribers list
- `/dashboard/profile` Profile

## RBAC scaffolding plan

Role utilities are scaffolded in `src/types/roles.ts`, `src/lib/rbac.ts`, and `src/lib/use-has-role.ts`. Wrap dashboard sections later by using `useHasRole` or the `hasRole` helper.

## Design tokens

Design tokens live in `src/app/globals.css` (CSS variables) and `tailwind.config.ts` to keep the theme consistent and easy to evolve.
