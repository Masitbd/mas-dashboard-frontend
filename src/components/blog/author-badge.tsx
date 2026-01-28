import Image from "next/image";
import type { Author } from "@/types/blog";

const fallbackAvatar =
  'data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"72\" height=\"72\"><rect width=\"100%\" height=\"100%\" fill=\"%23f4ebe1\"/><text x=\"50%\" y=\"55%\" font-size=\"28\" text-anchor=\"middle\" fill=\"%239c7c63\" font-family=\"sans-serif\">N</text></svg>';

export function AuthorBadge({
  author,
  publishedAt,
}: {
  author: Author;
  publishedAt: string;
}) {
  return (
    <div className="flex items-center gap-3 text-xs text-muted">
      <div className="relative h-9 w-9 overflow-hidden rounded-full">
        <Image
          src={author?.image || fallbackAvatar}
          alt={author?.displayName}
          fill
          className="object-cover"
        />
      </div>
      <div>
        <p className="font-medium text-foreground">{author.name}</p>
        <p className="text-[11px] uppercase tracking-[0.2em]">
          {new Date(publishedAt ?? new Date()).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
