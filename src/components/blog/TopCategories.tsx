import { useGetTopCategoriesQuery } from "@/redux/api/posts/post.api";
import Link from "next/link";
import React from "react";

const TopCategories = () => {
  const {
    data: topCategoryData,
    isLoading: topCategoryLoading,
    isFetching: topCategoryFetching,
  } = useGetTopCategoriesQuery(undefined);
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-sm font-semibold text-foreground">
        <span className="rounded bg-brand px-2 py-1 text-xs uppercase tracking-[0.2em] text-white">
          Categories
        </span>
      </p>
      <div className="mt-4 space-y-3 text-sm">
        {topCategoryData?.data?.map((category) => (
          <Link
            href={`/categories/${category.name.toLowerCase().split(" ").join("-")}`}
          >
            <div
              key={category?.name}
              className="flex items-center justify-between my-3"
            >
              <span>{category?.name}</span>
              <span className="text-muted">
                {String(category?.postCount).padStart(2, "0")}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopCategories;
