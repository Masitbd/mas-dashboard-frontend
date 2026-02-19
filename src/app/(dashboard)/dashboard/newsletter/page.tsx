"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Table,
  IconButton,
  ButtonToolbar,
  Message,
  useToaster,
  Pagination,
  Modal,
  SelectPicker,
  Divider,
  Button,
} from "rsuite";
import {
  Eye,
  Search,
  X,
  Mail,
  CheckCircle2,
  XCircle,
  Calendar,
} from "lucide-react";
import {
  useGetNewsletterSubscribersQuery,
  useLazyGetNewsletterSubscriberByIdQuery,
} from "@/redux/api/newsletter-subscriber/newsLetter-subscriber.api";

type NewsletterSubscriber = {
  _id: string;
  email: string;
  subscribed: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  const collapsed = input.replace(/\s+/g, " ").trim();
  return collapsed.length ? collapsed : "";
}

function safeNumber(v: unknown) {
  const n = typeof v === "string" ? Number(v) : (v as number);
  return Number.isFinite(n) ? n : undefined;
}

function formatDate(input?: string) {
  if (!input) return "-";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NewsletterSubscribersTablePage() {
  const toaster = useToaster();

  // paging
  const LIMIT = 10;
  const [page, setPage] = useState(1);

  // search + sort + filter
  const [searchInput, setSearchInput] = useState("");
  const debouncedInput = useDebounce(searchInput, 450);
  const normalizedSearch = useMemo(
    () => normalizeSearchTerm(debouncedInput),
    [debouncedInput],
  );

  const [sort, setSort] = useState<
    "newest" | "oldest" | "emailAsc" | "emailDesc"
  >("newest");

  // filter: all | true | false
  const [subscribedFilter, setSubscribedFilter] = useState<
    "all" | "true" | "false"
  >("all");

  // reset to page 1 whenever effective filters change
  useEffect(() => {
    setPage(1);
  }, [normalizedSearch, sort, subscribedFilter]);

  const queryArgs = useMemo(() => {
    return {
      page: String(page),
      limit: String(LIMIT),
      ...(normalizedSearch ? { searchTerm: normalizedSearch } : {}),
      ...(sort ? { sort } : {}),
      ...(subscribedFilter !== "all" ? { subscribed: subscribedFilter } : {}),
    };
  }, [page, LIMIT, normalizedSearch, sort, subscribedFilter]);

  const {
    data: subscriberList,
    isLoading,
    isFetching,
    isError,
  } = useGetNewsletterSubscribersQuery(queryArgs);

  const loading = isLoading || isFetching;

  // normalize rows for different server shapes
  const rows: NewsletterSubscriber[] = useMemo(() => {
    const anyData = subscriberList as any;

    const arr =
      anyData?.data?.data?.data ??
      anyData?.data?.data ??
      anyData?.data ??
      anyData?.result ??
      anyData?.data?.result ??
      [];

    return Array.isArray(arr) ? arr : [];
  }, [subscriberList]);

  const totalItems = useMemo(() => {
    const anyData = subscriberList as any;
    const meta =
      anyData?.data?.data?.meta ??
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
  }, [subscriberList, rows.length]);

  const totalPages = totalItems > 0 ? Math.ceil(totalItems / LIMIT) : 0;

  // clamp invalid pages
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // ---- View modal (GET /newsletter-subscriber/:id) ----
  const [open, setOpen] = useState(false);
  const [viewId, setViewId] = useState<string | null>(null);

  const [getSubscriberById, viewState] =
    useLazyGetNewsletterSubscriberByIdQuery();

  const viewData: NewsletterSubscriber | undefined = useMemo(() => {
    const anyData = viewState?.data as any;
    return anyData?.data ?? anyData?.data?.data ?? anyData?.result ?? undefined;
  }, [viewState?.data]);

  const openView = async (id: string) => {
    setOpen(true);
    setViewId(id);
    try {
      await getSubscriberById(id).unwrap();
    } catch (err: any) {
      toaster.push(
        <Message showIcon type="error" closable>
          {err?.data?.message ||
            err?.message ||
            "Failed to load subscriber details."}
        </Message>,
        { placement: "topEnd" },
      );
    }
  };

  const closeView = () => {
    setOpen(false);
    setViewId(null);
  };

  const showPagination = totalPages > 1;
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Newsletter Subscribers</h1>
          {normalizedSearch ? (
            <p className="text-sm text-muted">
              Showing results for:{" "}
              <span className="font-medium">{normalizedSearch}</span>
            </p>
          ) : (
            <p className="text-sm text-muted">
              All newsletter subscriptions collected from the public footer
              form.
            </p>
          )}
        </div>
      </div>

      {/* search + sort + filter */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-[1fr,220px,220px] md:items-center">
          {/* search */}
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              ref={inputRef}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value.slice(0, 120))}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSearchInput("");
                  requestAnimationFrame(() => inputRef.current?.focus());
                }
              }}
              placeholder="Search by email…"
              className="w-full rounded-lg border border-border bg-white px-10 py-2.5 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
              aria-label="Search subscribers"
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

          {/* filter */}
          <SelectPicker
            searchable={false}
            cleanable={false}
            value={subscribedFilter}
            onChange={(v) => setSubscribedFilter((v as any) ?? "all")}
            data={[
              { label: "All", value: "all" },
              { label: "Subscribed only", value: "true" },
              { label: "Unsubscribed only", value: "false" },
            ]}
            placeholder="Filter"
            className="w-full"
            block
          />

          {/* sort */}
          <SelectPicker
            searchable={false}
            cleanable={false}
            value={sort}
            onChange={(v) => setSort((v as any) ?? "newest")}
            data={[
              { label: "Newest first", value: "newest" },
              { label: "Oldest first", value: "oldest" },
              { label: "Email A → Z", value: "emailAsc" },
              { label: "Email Z → A", value: "emailDesc" },
            ]}
            placeholder="Sort"
            className="w-full"
            block
          />
        </div>

        {isError && !loading && (
          <div className="mt-3">
            <Message showIcon type="error">
              Failed to load subscribers. Please try again.
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
          <Column flexGrow={2} align="left">
            <HeaderCell>Email</HeaderCell>
            <Cell>
              {(rowData: NewsletterSubscriber) => (
                <span className="font-medium text-foreground">
                  {rowData.email}
                </span>
              )}
            </Cell>
          </Column>

          <Column width={160} align="left">
            <HeaderCell>Status</HeaderCell>
            <Cell>
              {(rowData: NewsletterSubscriber) =>
                rowData.subscribed ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-accent px-2 py-1 text-xs font-medium text-primary">
                    <CheckCircle2 size={14} />
                    Subscribed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2 py-1 text-xs font-medium text-muted">
                    <XCircle size={14} />
                    Unsubscribed
                  </span>
                )
              }
            </Cell>
          </Column>

          <Column width={220} align="left">
            <HeaderCell>Created</HeaderCell>
            <Cell>
              {(rowData: NewsletterSubscriber) => (
                <span className="text-muted">
                  {formatDate(rowData?.createdAt)}
                </span>
              )}
            </Cell>
          </Column>

          {/* actions */}
          <Column width={120} align="left" fixed="right">
            <HeaderCell>Actions</HeaderCell>
            <Cell>
              {(rowData: NewsletterSubscriber) => (
                <ButtonToolbar>
                  <IconButton
                    size="sm"
                    appearance="ghost"
                    aria-label="View"
                    icon={<Eye size={16} />}
                    onClick={() => openView(rowData._id)}
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
              "No subscribers found."
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
                const safe = Math.max(1, Math.min(nextPage, totalPages || 1));
                setPage(safe);
              }}
            />
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* View Modal */}
      <Modal open={open} onClose={closeView} size="sm">
        <Modal.Header>
          <Modal.Title>Subscriber details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {viewState.isFetching ? (
            <Message showIcon type="info">
              Loading subscriber…
            </Message>
          ) : viewState.isError ? (
            <Message showIcon type="error">
              Failed to load subscriber details.
            </Message>
          ) : viewData ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 text-muted" />
                <div>
                  <p className="text-xs text-muted">Email</p>
                  <p className="font-medium text-foreground">
                    {viewData.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                {viewData.subscribed ? (
                  <CheckCircle2 size={18} className="mt-0.5 text-primary" />
                ) : (
                  <XCircle size={18} className="mt-0.5 text-muted" />
                )}
                <div>
                  <p className="text-xs text-muted">Status</p>
                  <p className="font-medium text-foreground">
                    {viewData.subscribed ? "Subscribed" : "Unsubscribed"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar size={18} className="mt-0.5 text-muted" />
                <div>
                  <p className="text-xs text-muted">Created</p>
                  <p className="font-medium text-foreground">
                    {formatDate(viewData.createdAt)}
                  </p>
                </div>
              </div>

              <Divider />

              <div className="rounded-lg border border-border bg-white p-3">
                <p className="text-xs text-muted">ID</p>
                <p className="mt-1 break-all text-sm text-foreground">
                  {viewData._id}
                </p>
              </div>
            </div>
          ) : (
            <Message showIcon type="warning">
              No data found for this subscriber.
            </Message>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button appearance="primary" onClick={closeView}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
