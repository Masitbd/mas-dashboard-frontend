"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  IconButton,
  ButtonToolbar,
  Message,
  useToaster,
  Button,
} from "rsuite";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useGetCategoriesQuery } from "@/redux/api/categories/category.api";
import { NavLink } from "@/components/layout/Navlink";

type Category = {
  id: string;
  name: string;
  description: string;
};

const { Column, HeaderCell, Cell } = Table;

const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat_1",
    name: "Technology",
    description: "Engineering, software, AI, and product updates.",
  },
  {
    id: "cat_2",
    name: "Business",
    description: "Strategy, operations, and execution playbooks.",
  },
  {
    id: "cat_3",
    name: "Lifestyle",
    description: "Habits, routines, and practical life guidance.",
  },
  {
    id: "cat_4",
    name: "Announcements",
    description: "Release notes, changelogs, and platform news.",
  },
];

export default function PostCategoriesTable() {
  const { data: categories, isLoading: loading } = useGetCategoriesQuery({
    page: 1,
    limit: 100,
  });
  const toaster = useToaster();

  const handleDelete = (category: Category) => {
    // Replace with your API call + confirmation flow
    // setData((prev) => prev.filter((c) => c.id !== category.id));
    toaster.push(
      <Message type="success" closable>
        Category deleted: <b>{category.name}</b>
      </Message>,
      { placement: "topEnd" },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Post Categories</h1>

        {/* Optional: Add "New Category" button if you want */}
        <Button appearance="primary" as={Link} href="/dashboard/categories/new">
          New category
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table
          data={categories?.data?.data || []}
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
                    href={`/dashboard/categories/new?id=${rowData._id}&mode=${"edit"}`}
                  />
                  <IconButton
                    size="sm"
                    appearance="ghost"
                    aria-label="View"
                    icon={<Eye size={16} />}
                    as={Link}
                    href={`/dashboard/categories/${rowData.id}`}
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
      </div>
    </div>
  );
}
