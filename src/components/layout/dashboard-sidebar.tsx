import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Mail,
  User,
  Network,
  Users,
} from "lucide-react";

const links = [
  // { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  {
    href: "/dashboard/categories",
    label: "Categories",
    icon: Network,
  },
  {
    href: "/dashboard/tags",
    label: "Tags",
    icon: Network,
  },
  { href: "/dashboard/posts", label: "Posts", icon: FileText },
  // { href: "/dashboard/comments", label: "Comments", icon: MessageSquare },
  // { href: "/dashboard/newsletter", label: "Newsletter", icon: Mail },
  // { href: "/dashboard/profile", label: "Profile", icon: User },
  {
    href: "/dashboard/users",
    label: "Users",
    icon: Users,
  },
];

export function DashboardSidebar() {
  return (
    <aside className="border-r border-border bg-card p-6">
      <Link href="/" className="text-lg font-semibold">
        Notebook
      </Link>
      <nav className="mt-10 space-y-3 text-sm">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-secondary hover:bg-accent"
            >
              <Icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
