"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Table,
  IconButton,
  ButtonToolbar,
  Tag,
  Message,
  useToaster,
  Button,
  Input,
  InputGroup,
  SelectPicker,
  Pagination,
} from "rsuite";
import { Eye, Pencil, Trash2, Search, X } from "lucide-react";
import { useGetUserListQuery } from "@/redux/api/users/user.api";

type UserStatus = "active" | "inactive" | "blocked";
type UserRole = "admin" | "editor" | "viewer";

type UserRow = {
  uuid: string;
  username: string;
  displayName: string;
  status: UserStatus;
  role: UserRole;
};

const { Column, HeaderCell, Cell } = Table;

function useDebouncedValue<T>(value: T, delay = 450) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

function StatusPill({ value }: { value: UserStatus }) {
  const props =
    value === "active"
      ? { color: "green" as const }
      : value === "inactive"
        ? { color: "orange" as const }
        : { color: "red" as const };

  return (
    <Tag {...props} className="capitalize">
      {value}
    </Tag>
  );
}

function RolePill({ value }: { value: UserRole }) {
  const props =
    value === "admin"
      ? { color: "blue" as const }
      : value === "editor"
        ? { color: "violet" as const }
        : { color: "cyan" as const };

  return (
    <Tag {...props} className="capitalize">
      {value}
    </Tag>
  );
}

export default function UsersTablePage() {
  // ✅ Search + debounce
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 450);

  // ✅ Filters
  const [role, setRole] = useState<UserRole | null>(null);
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [emailFilter, setEmailFilter] = useState<
    "all" | "verified" | "unverified"
  >("all");

  // ✅ Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // When search/filters/limit changes → go back to page 1
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, role, status, emailFilter, limit]);

  const roleOptions = useMemo(
    () => [
      { label: "All roles", value: null },
      { label: "Admin", value: "admin" },
      { label: "Editor", value: "editor" },
      { label: "Viewer", value: "viewer" },
    ],
    [],
  );

  const statusOptions = useMemo(
    () => [
      { label: "All status", value: null },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Blocked", value: "blocked" },
    ],
    [],
  );

  const emailOptions = useMemo(
    () => [
      { label: "All emails", value: "all" },
      { label: "Email verified", value: "verified" },
      { label: "Not verified", value: "unverified" },
    ],
    [],
  );

  const limitOptions = useMemo(
    () => [
      { label: "10 / page", value: 10 },
      { label: "20 / page", value: 20 },
      { label: "50 / page", value: 50 },
    ],
    [],
  );

  // ✅ Build query (debounced search goes into query)
  const queryParams = useMemo(() => {
    const q: Record<string, any> = { page, limit };

    if (debouncedSearch?.trim()) q.searchTerm = debouncedSearch.trim();
    if (role) q.role = role;
    if (status) q.status = status;

    // supports your filter: emailVarified
    if (emailFilter === "verified") q.emailVarified = true;
    if (emailFilter === "unverified") q.emailVarified = false;

    return q;
  }, [page, limit, debouncedSearch, role, status, emailFilter]);

  const {
    data: userdata,
    isLoading,
    isFetching,
  } = useGetUserListQuery(queryParams);

  const toaster = useToaster();
  const loading = isLoading || isFetching;

  // meta helpers (matches your shape userdata?.data?.meta)
  const meta = (userdata as any)?.data?.meta ?? {
    page,
    limit,
    total: 0,
    pages: 0,
  };

  const total = Number(meta?.total ?? 0);
  const activePage = Number(meta?.page ?? page);
  const activeLimit = Number(meta?.limit ?? limit);

  const from = total === 0 ? 0 : (activePage - 1) * activeLimit + 1;
  const to = total === 0 ? 0 : Math.min(activePage * activeLimit, total);

  const handleDelete = (user: UserRow) => {
    toaster.push(
      <Message type="success" closable>
        User deleted: <b>{user.displayName || user.username}</b>
      </Message>,
      { placement: "topEnd" },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>

        <Button appearance="primary" as={Link} href="/dashboard/users/new">
          New user
        </Button>
      </div>

      {/* ✅ Search + Filters (new) */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="w-full md:flex-1">
            <InputGroup inside className="w-full">
              <InputGroup.Addon>
                <Search size={16} />
              </InputGroup.Addon>

              <Input
                value={searchInput}
                onChange={(v) => setSearchInput(String(v))}
                placeholder="Search by username, display name, uuid..."
              />

              {searchInput ? (
                <InputGroup.Button
                  onClick={() => setSearchInput("")}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </InputGroup.Button>
              ) : null}
            </InputGroup>
          </div>

          <div className="">
            <Button
              appearance="ghost"
              disabled={loading}
              onClick={() => {
                setSearchInput("");
                setRole(null);
                setStatus(null);
                setEmailFilter("all");
                setPage(1);
                setLimit(10);
              }}
            >
              Clear filters
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs text-muted">Role</label>
            <SelectPicker
              className="w-full"
              data={roleOptions as any}
              cleanable={false}
              searchable={false}
              value={role}
              onChange={(v) => setRole((v as UserRole) ?? null)}
              placeholder="All roles"
              block
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Status</label>
            <SelectPicker
              className="w-full"
              data={statusOptions as any}
              cleanable={false}
              searchable={false}
              value={status}
              onChange={(v) => setStatus((v as UserStatus) ?? null)}
              placeholder="All status"
              block
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Email</label>
            <SelectPicker
              className="w-full"
              data={emailOptions as any}
              cleanable={false}
              searchable={false}
              value={emailFilter}
              onChange={(v) => setEmailFilter((v as any) ?? "all")}
              placeholder="All emails"
              block
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Rows</label>
            <SelectPicker
              className="w-full"
              data={limitOptions as any}
              cleanable={false}
              searchable={false}
              value={limit}
              onChange={(v) => setLimit(Number(v) || 10)}
              placeholder="10 / page"
              block
            />
          </div>
        </div>
      </div>

      {/* ✅ Table wrapper (UNCHANGED TABLE INSIDE) */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table
          data={userdata?.data?.data}
          loading={loading}
          bordered
          cellBordered
          autoHeight
          rowHeight={56}
          className="text-sm"
        >
          <Column flexGrow={0.5} align="left">
            <HeaderCell>UUID</HeaderCell>
            <Cell>
              {(rowData: UserRow) => (
                <span className="font-mono text-[12px] text-secondary">
                  {rowData.uuid}
                </span>
              )}
            </Cell>
          </Column>

          <Column flexGrow={1} minWidth={200} align="left">
            <HeaderCell>Username</HeaderCell>
            <Cell dataKey="username" />
          </Column>

          <Column flexGrow={1} minWidth={200} align="left">
            <HeaderCell>Display Name</HeaderCell>
            <Cell dataKey="displayName" />
          </Column>

          <Column flexGrow={1.5} minWidth={200} align="left">
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="email" />
          </Column>

          <Column width={140} align="left">
            <HeaderCell>Status</HeaderCell>
            <Cell>
              {(rowData: UserRow) => <StatusPill value={rowData.status} />}
            </Cell>
          </Column>

          <Column width={140} align="left">
            <HeaderCell>Role</HeaderCell>
            <Cell>
              {(rowData: UserRow) => <RolePill value={rowData.role} />}
            </Cell>
          </Column>

          <Column width={200} align="left" fixed="right">
            <HeaderCell>Actions</HeaderCell>
            <Cell>
              {(rowData: UserRow) => (
                <ButtonToolbar>
                  <IconButton
                    size="sm"
                    appearance="ghost"
                    aria-label="Update"
                    icon={<Pencil size={16} />}
                    as={Link}
                    href={`/dashboard/users/${rowData.uuid}/edit`}
                  />
                  <IconButton
                    size="sm"
                    appearance="ghost"
                    aria-label="View"
                    icon={<Eye size={16} />}
                    as={Link}
                    href={`/dashboard/users/view?uuid=${rowData.uuid}`}
                  />
                </ButtonToolbar>
              )}
            </Cell>
          </Column>
        </Table>

        {/* empty state (fixed) */}
        {!loading && (userdata?.data?.data?.length ?? 0) === 0 && (
          <div className="p-6">
            <Message type="info">No users found.</Message>
          </div>
        )}
      </div>

      {/* ✅ Pagination (new) */}
      <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 md:flex-row">
        <div className="text-sm text-muted">
          Showing <span className="text-foreground">{from}</span>–
          <span className="text-foreground">{to}</span> of{" "}
          <span className="text-foreground">{total}</span>
          {loading ? <span className="ml-2">(loading...)</span> : null}
        </div>

        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          size="sm"
          total={total}
          limit={activeLimit}
          activePage={activePage}
          onChangePage={(p) => setPage(p)}
          disabled={loading || total === 0}
        />
      </div>
    </div>
  );
}
