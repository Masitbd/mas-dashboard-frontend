import React from "react";
import { Tag } from "rsuite";
import type { TagProps } from "rsuite";
import { FileText, CheckCircle2, Archive } from "lucide-react";

export type PostStatus = "draft" | "published" | "archived";

type StatusTagProps = {
  status: PostStatus;
  /** rsuite Tag appearance */
  appearance?: "default" | "primary" | "subtle" | "ghost"; // "default" | "primary" | "subtle" | "ghost"
  /** rsuite Tag size */
  size?: TagProps["size"]; // "sm" | "md" | "lg"
  /** extra className if you use custom css */
  className?: string;
};

const META: Record<
  PostStatus,
  {
    label: string;
    color: TagProps["color"];
    Icon: React.ComponentType<{ size?: number }>;
  }
> = {
  draft: {
    label: "Draft",
    color: "orange",
    Icon: FileText as React.ComponentType<{ size?: number }>,
  },
  published: {
    label: "Published",
    color: "green",
    Icon: CheckCircle2 as React.ComponentType<{ size?: number }>,
  },
  archived: {
    label: "Archived",
    color: "gray",
    Icon: Archive as React.ComponentType<{ size?: number }>,
  },
};

export function StatusTag({
  status,
  appearance = "subtle",
  size = "sm",
  className,
}: StatusTagProps) {
  const { label, color, Icon } = META[status];

  return (
    <Tag color={color} size={size} className={className}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <Icon size={14} />
        {label}
      </span>
    </Tag>
  );
}
