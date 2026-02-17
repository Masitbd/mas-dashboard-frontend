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
import { Eye, Search, X, Mail, User, Clipboard, Calendar } from "lucide-react";
import {
  useGetContactsQuery,
  useLazyGetContactByIdQuery,
} from "@/redux/api/contact/contact.api";

type Contact = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
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

function clampText(s?: string, max = 90) {
  const text = (s ?? "").trim();
  if (!text) return "-";
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

export default function ContactsTablePage() {
  const toaster = useToaster();

  // paging
  const LIMIT = 10;
  const [page, setPage] = useState(1);

  // search + sort
  const [searchInput, setSearchInput] = useState("");
  const debouncedInput = useDebounce(searchInput, 450);
  const normalizedSearch = useMemo(
    () => normalizeSearchTerm(debouncedInput),
    [debouncedInput],
  );

  const [sort, setSort] = useState<
    "newest" | "oldest" | "nameAsc" | "nameDesc"
  >("newest");

  // reset to page 1 whenever effective filters change
  useEffect(() => {
    setPage(1);
  }, [normalizedSearch, sort]);

  const queryArgs = useMemo(() => {
    return {
      page: String(page),
      limit: String(LIMIT),
      ...(normalizedSearch ? { searchTerm: normalizedSearch } : {}),
      ...(sort ? { sort } : {}),
    };
  }, [page, LIMIT, normalizedSearch, sort]);

  const {
    data: contactList,
    isLoading,
    isFetching,
    isError,
  } = useGetContactsQuery(queryArgs);

  const loading = isLoading || isFetching;

  // normalize rows for different server shapes
  const rows: Contact[] = useMemo(() => {
    const anyData = contactList as any;

    // common shapes:
    // { data: { meta, data: [] } }
    // { data: [] }
    // { result: [] }
    const arr =
      anyData?.data?.data?.data ??
      anyData?.data?.data ??
      anyData?.data ??
      anyData?.result ??
      anyData?.data?.result ??
      [];

    return Array.isArray(arr) ? arr : [];
  }, [contactList]);

  const totalItems = useMemo(() => {
    const anyData = contactList as any;
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
  }, [contactList, rows.length]);

  const totalPages = totalItems > 0 ? Math.ceil(totalItems / LIMIT) : 0;

  // clamp invalid pages
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // ---- View modal (GET /contact/:id) ----
  const [open, setOpen] = useState(false);
  const [viewId, setViewId] = useState<string | null>(null);

  const [getContactById, viewState] = useLazyGetContactByIdQuery();

  const viewData: Contact | undefined = useMemo(() => {
    const anyData = viewState?.data as any;
    return anyData?.data ?? anyData?.data?.data ?? anyData?.result ?? undefined;
  }, [viewState?.data]);

  const openView = async (id: string) => {
    setOpen(true);
    setViewId(id);

    try {
      await getContactById(id).unwrap();
    } catch (err: any) {
      toaster.push(
        <Message showIcon type="error" closable>
          {err?.data?.message ||
            err?.message ||
            "Failed to load contact details."}
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
          <h1 className="text-2xl font-semibold">Contacts</h1>
          {normalizedSearch ? (
            <p className="text-sm text-muted">
              Showing results for:{" "}
              <span className="font-medium">{normalizedSearch}</span>
            </p>
          ) : (
            <p className="text-sm text-muted">
              All messages submitted from the Contact page.
            </p>
          )}
        </div>
      </div>

      {/* search + sort */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-[1fr,240px] md:items-center">
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
              placeholder="Search by name, email, subject…"
              className="w-full rounded-lg border border-border bg-white px-10 py-2.5 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
              aria-label="Search contacts"
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

          {/* sort */}
          <SelectPicker
            searchable={false}
            cleanable={false}
            value={sort}
            onChange={(v) => setSort((v as any) ?? "newest")}
            data={[
              { label: "Newest first", value: "newest" },
              { label: "Oldest first", value: "oldest" },
              { label: "Name A → Z", value: "nameAsc" },
              { label: "Name Z → A", value: "nameDesc" },
            ]}
            placeholder="Sort"
            className="w-full"
          />
        </div>

        {isError && !loading && (
          <div className="mt-3">
            <Message showIcon type="error">
              Failed to load contacts. Please try again.
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
          <Column flexGrow={1} align="left">
            <HeaderCell>Name</HeaderCell>
            <Cell dataKey="name" />
          </Column>

          <Column flexGrow={1} align="left">
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="email" />
          </Column>

          <Column flexGrow={1} align="left">
            <HeaderCell>Subject</HeaderCell>
            <Cell dataKey="subject" />
          </Column>

          <Column flexGrow={2} align="left">
            <HeaderCell>Message</HeaderCell>
            <Cell>
              {(rowData: Contact) => (
                <span title={rowData?.message || ""}>
                  {clampText(rowData?.message, 110)}
                </span>
              )}
            </Cell>
          </Column>

          <Column width={190} align="left">
            <HeaderCell>Created</HeaderCell>
            <Cell>
              {(rowData: Contact) => (
                <span className="text-muted">
                  {formatDate(rowData?.createdAt)}
                </span>
              )}
            </Cell>
          </Column>

          {/* ✅ Actions with View button */}
          <Column width={120} align="left" fixed="right">
            <HeaderCell>Actions</HeaderCell>
            <Cell>
              {(rowData: Contact) => (
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
              "No contacts found."
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
          <Modal.Title>Contact details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {viewState.isFetching ? (
            <Message showIcon type="info">
              Loading message…
            </Message>
          ) : viewState.isError ? (
            <Message showIcon type="error">
              Failed to load contact details.
            </Message>
          ) : viewData ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User size={18} className="mt-0.5 text-muted" />
                <div>
                  <p className="text-xs text-muted">Name</p>
                  <p className="font-medium text-foreground">{viewData.name}</p>
                </div>
              </div>

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
                <Clipboard size={18} className="mt-0.5 text-muted" />
                <div>
                  <p className="text-xs text-muted">Subject</p>
                  <p className="font-medium text-foreground">
                    {viewData.subject}
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

              <div>
                <p className="text-xs text-muted">Message</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
                  {viewData.message}
                </p>
              </div>
            </div>
          ) : (
            <Message showIcon type="warning">
              No data found for this message.
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
