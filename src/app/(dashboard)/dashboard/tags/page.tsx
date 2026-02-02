"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Table,
  IconButton,
  ButtonToolbar,
  Button,
  Message,
  useToaster,
  Pagination,
} from "rsuite";
import { Pencil, Trash2, Search, X } from "lucide-react";
import { NavLink } from "@/components/layout/Navlink";
import { confirmDeleteById } from "@/components/layout/SwalConfiramation";
import {
  useDeleteTagMutation,
  useGetTagsQuery,
} from "@/redux/api/tags/tags.api";

type Category = {
  _id: string;
  name: string;
  description: string;
};

const { Column, HeaderCell, Cell } = Table;

// ---- helpers ----
function useDebounce<T>(value: T, delay = 450) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

function normalizeSearchTerm(input: string) {
  // collapse multiple spaces and trim
  const collapsed = input.replace(/\s+/g, " ").trim();
  // treat whitespace-only as empty
  return collapsed.length ? collapsed : "";
}

function safeNumber(v: unknown) {
  const n = typeof v === "string" ? Number(v) : (v as number);
  return Number.isFinite(n) ? n : undefined;
}

export default function PostCategoriesTable() {
  const toaster = useToaster();

  // paging
  const LIMIT = 10;
  const [page, setPage] = useState(1);

  // search
  const [searchInput, setSearchInput] = useState("");
  const debouncedInput = useDebounce(searchInput, 450);
  const normalizedSearch = useMemo(
    () => normalizeSearchTerm(debouncedInput),
    [debouncedInput],
  );

  // reset to page 1 whenever the *effective* (debounced) search changes
  useEffect(() => {
    setPage(1);
  }, [normalizedSearch]);

  const queryArgs = useMemo(() => {
    return {
      page: String(page),
      limit: String(LIMIT),
      ...(normalizedSearch ? { searchTerm: normalizedSearch } : {}),
    };
  }, [page, LIMIT, normalizedSearch]);

  const {
    data: categories,
    isLoading,
    isFetching,
    isError,
  } = useGetTagsQuery(queryArgs);

  const rows: Category[] = useMemo(() => {
    const anyData = categories as any;
    return (
      anyData?.data?.data ||
      anyData?.data ||
      anyData?.data?.result ||
      anyData?.result ||
      []
    );
  }, [categories]);

  // try to read total from common meta shapes; fallback to current rows length
  const totalItems = useMemo(() => {
    const anyData = categories as any;
    const meta =
      anyData?.data?.meta ??
      anyData?.meta ??
      anyData?.data?.pagination ??
      anyData?.pagination;

    const total =
      safeNumber(meta?.total) ??
      safeNumber(meta?.totalItems) ??
      safeNumber(meta?.count) ??
      safeNumber(meta?.totalData);

    return total ?? rows.length;
  }, [categories, rows.length]);

  const totalPages = totalItems > 0 ? Math.ceil(totalItems / LIMIT) : 0;

  // if results shrink (search/delete) and current page becomes invalid, clamp it
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  // delete
  const [deleteCategory] = useDeleteTagMutation();

  const handleDelete = async (id: string | number) => {
    try {
      const result = await deleteCategory(id as string).unwrap();
      if (result?.success) return result?.data;

      throw new Error(result?.message || "Failed to delete tag.");
    } catch (err: any) {
      toaster.push(
        <Message showIcon type="error" closable>
          {err?.message || "Something went wrong while deleting."}
        </Message>,
        { placement: "topEnd" },
      );
      throw err;
    }
  };

  const loading = isLoading || isFetching;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const showPagination = totalPages > 1;

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Post Tags</h1>
          {normalizedSearch ? (
            <p className="text-sm text-muted">
              Showing results for:{" "}
              <span className="font-medium">{normalizedSearch}</span>
            </p>
          ) : (
            <p className="text-sm text-muted">Manage your blog Tags.</p>
          )}
        </div>

        <Button appearance="primary" as={Link} href="/dashboard/tags/new">
          New Tag
        </Button>
      </div>

      {/* search bar */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />

          <input
            ref={inputRef}
            value={searchInput}
            onChange={(e) => {
              // guard crazy-long strings; still allow typing but cap sent value
              const next = e.target.value.slice(0, 120);
              setSearchInput(next);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSearchInput("");
                // keep UX smooth
                requestAnimationFrame(() => inputRef.current?.focus());
              }
            }}
            placeholder="Search tags by name or description…"
            className="w-full rounded-lg border border-border bg-white px-10 py-2.5 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
            aria-label="Search tags"
          />

          {!!searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                requestAnimationFrame(() => inputRef.current?.focus());
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted hover:bg-accent hover:text-foreground"
              aria-label="Clear search"
              title="Clear"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* optional error hint */}
        {isError && !loading && (
          <div className="mt-3">
            <Message showIcon type="error">
              Failed to load categories. Please try again.
            </Message>
          </div>
        )}
      </div>

      {/* table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table
          data={rows}
          loading={loading}
          bordered
          autoHeight
          rowHeight={56}
          className="text-sm"
        >
          <Column flexGrow={1} minWidth={220} align="left">
            <HeaderCell>Name</HeaderCell>
            <Cell dataKey="name" />
          </Column>

          <Column flexGrow={2} minWidth={320} align="left">
            <HeaderCell>Description</HeaderCell>
            <Cell dataKey="description" />
          </Column>

          <Column width={200} align="left" fixed="right">
            <HeaderCell>Actions</HeaderCell>

            <Cell>
              {(rowData: Category) => (
                <ButtonToolbar>
                  <IconButton
                    size="sm"
                    appearance="ghost"
                    aria-label="Update"
                    icon={<Pencil size={16} />}
                    as={NavLink}
                    href={`/dashboard/tags/new?id=${rowData._id}&mode=edit`}
                  />

                  <IconButton
                    size="sm"
                    appearance="ghost"
                    color="red"
                    aria-label="Delete"
                    icon={<Trash2 size={16} />}
                    onClick={async () =>
                      await confirmDeleteById(rowData._id, handleDelete, {
                        successText: "Tag has been deleted.",
                      })
                    }
                  />
                </ButtonToolbar>
              )}
            </Cell>
          </Column>
        </Table>

        {/* pagination */}
        <div className="flex items-center justify-between gap-3 border-t border-border bg-card px-4 py-3">
          <p className="text-sm text-muted">
            {totalItems > 0 ? (
              <>
                Page <span className="font-medium text-foreground">{page}</span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {totalPages || 1}
                </span>{" "}
                •{" "}
                <span className="font-medium text-foreground">
                  {totalItems}
                </span>{" "}
                total
              </>
            ) : (
              "No categories found."
            )}
          </p>

          {showPagination ? (
            <Pagination
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              activePage={page}
              total={totalItems}
              limit={LIMIT}
              onChangePage={(nextPage) => {
                // guard against weird values from UI
                const safe = Math.max(1, Math.min(nextPage, totalPages || 1));
                setPage(safe);
              }}
            />
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
