import { useGetTopTagsQuery } from "@/redux/api/posts/post.api";
import Link from "next/link";
import React from "react";

const TopTags = () => {
  const {
    data: tagData,
    isLoading: tagsLoading,
    isFetching: tagsFetching,
  } = useGetTopTagsQuery(undefined);
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-sm font-semibold text-foreground">
        <span className="rounded bg-brand px-2 py-1 text-xs uppercase tracking-[0.2em] text-white">
          Search
        </span>{" "}
        With Tags
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tagData?.data.map((tag) => (
          <Link
            href={`/tags/${tag?.name?.toLowerCase()?.split(" ").join("-")}`}
          >
            <span
              key={tag?._id}
              className="rounded-full border border-border px-3 py-1 text-xs text-secondary"
            >
              {tag?.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopTags;
