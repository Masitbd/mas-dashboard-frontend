"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  FileText,
  MessageSquare,
  Mail,
  Network,
  Users,
  Tags,
} from "lucide-react";

const links = [
  {
    href: "/dashboard/categories",
    label: "Categories",
    icon: Network,
  },
  {
    href: "/dashboard/tags",
    label: "Tags",
    icon: Tags,
  },
  { href: "/dashboard/posts", label: "Posts", icon: FileText },
  {
    href: "/dashboard/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/dashboard/contacts",
    label: "Contacts",
    icon: MessageSquare,
  },
  { href: "/dashboard/newsletter", label: "Newsletter", icon: Mail },
];

function isActivePath(pathname: string, href: string) {
  // exact match OR nested route match (e.g. /dashboard/posts/123)
  if (pathname === href) return true;
  if (href !== "/" && pathname.startsWith(href + "/")) return true;
  return false;
}

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-r border-border bg-card p-6">
      <Link href="/" className="text-lg font-semibold">
        Notebook
      </Link>

      <nav className="mt-10 space-y-2 text-sm">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActivePath(pathname || "", link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={clsx(
                "group flex items-center gap-3 rounded-lg px-3 py-2 transition",
                active
                  ? "border border-border bg-accent text-foreground"
                  : "text-secondary hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon
                size={16}
                className={clsx(
                  "transition",
                  active
                    ? "text-primary"
                    : "text-muted group-hover:text-primary",
                )}
              />
              <span className="font-medium">{link.label}</span>

              {/* right active indicator */}
              <span
                className={clsx(
                  "ml-auto h-2 w-2 rounded-full transition",
                  active ? "bg-brand" : "bg-transparent",
                )}
              />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
