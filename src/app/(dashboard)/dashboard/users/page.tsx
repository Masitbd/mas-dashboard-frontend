"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  IconButton,
  ButtonToolbar,
  Tag,
  Message,
  useToaster,
  Button,
} from "rsuite";
import { Eye, Pencil, Trash2 } from "lucide-react";

type UserStatus = "active" | "inactive" | "blocked";
type UserRole = "admin" | "editor" | "viewer";

type UserRow = {
  uuid: string;
  name: string;
  status: UserStatus;
  role: UserRole;
};

const { Column, HeaderCell, Cell } = Table;

const MOCK_USERS: UserRow[] = [
  {
    uuid: "6b7a3f2e-9e2f-4c3d-8d47-7e4e2a9f1a10",
    name: "Amina Rahman",
    status: "active",
    role: "admin",
  },
  {
    uuid: "9c8d1a22-0b44-4ad7-bc6f-3a0ff8b0f4d1",
    name: "Saidul Islam",
    status: "active",
    role: "editor",
  },
  {
    uuid: "e12f4d9b-2a11-4b6e-9b2d-1f39c0a7e0d2",
    name: "Nusrat Jahan",
    status: "inactive",
    role: "viewer",
  },
  {
    uuid: "1aa0c2b7-4c6c-4bd3-9b6a-0bda4c9ad9d3",
    name: "Farhan Ahmed",
    status: "blocked",
    role: "viewer",
  },
  {
    uuid: "f6b2a5cc-1d0a-4d21-a67d-3d6a3d92f2b4",
    name: "Tahmid Hasan",
    status: "active",
    role: "editor",
  },
];

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
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<UserRow[]>([]);
  const toaster = useToaster();

  useEffect(() => {
    const t = setTimeout(() => {
      setData(MOCK_USERS);
      setLoading(false);
    }, 900);

    return () => clearTimeout(t);
  }, []);

  const handleDelete = (user: UserRow) => {
    // Replace with confirm modal + API call
    setData((prev) => prev.filter((u) => u.uuid !== user.uuid));
    toaster.push(
      <Message type="success" closable>
        User deleted: <b>{user.name}</b>
      </Message>,
      { placement: "topEnd" }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>

        {/* Optional CTA if you want */}
        <Button appearance="primary" as={Link} href="/dashboard/users/new">
          New user
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table
          data={data}
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
            <HeaderCell>Name</HeaderCell>
            <Cell dataKey="name" />
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
                  <IconButton
                    size="sm"
                    appearance="ghost"
                    color="red"
                    aria-label="Delete"
                    icon={<Trash2 size={16} />}
                    onClick={() => handleDelete(rowData)}
                  />
                </ButtonToolbar>
              )}
            </Cell>
          </Column>
        </Table>

        {!loading && data.length === 0 && (
          <div className="p-6">
            <Message type="info">No users found.</Message>
          </div>
        )}
      </div>
    </div>
  );
}
