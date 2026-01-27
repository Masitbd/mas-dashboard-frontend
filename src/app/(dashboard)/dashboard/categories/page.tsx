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
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/redux/api/categories/category.api";
import { NavLink } from "@/components/layout/Navlink";
import { confirmDeleteById } from "@/components/layout/SwalConfiramation";

type Category = {
  _id: string;
  name: string;
  description: string;
};

const { Column, HeaderCell, Cell } = Table;

export default function PostCategoriesTable() {
  const { data: categories, isLoading: loading } = useGetCategoriesQuery({
    page: 1 as unknown as string,
    limit: 100 as unknown as string,
  });
  const toaster = useToaster();

  // deleting functionality for category
  const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();

  const handleDelete = async (id: string | number) => {
    const result = await deleteCategory(id as string).unwrap();
    if (result?.success) {
      return result?.data;
    }
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
                  {/* <IconButton
                    size="sm"
                    appearance="ghost"
                    aria-label="View"
                    icon={<Eye size={16} />}
                    as={Link}
                    href={`/dashboard/categories/${rowData.id}`}
                  /> */}
                  <IconButton
                    size="sm"
                    appearance="ghost"
                    color="red"
                    aria-label="Delete"
                    icon={<Trash2 size={16} />}
                    onClick={async () =>
                      await confirmDeleteById(
                        rowData._id as string,
                        handleDelete,
                        {
                          successText: "Category has been deleted.",
                        },
                      )
                    }
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
