'use client';

import { Pagination } from 'rsuite';

export function BlogPagination({
  page,
  total,
  limit,
  onChange
}: {
  page: number;
  total: number;
  limit: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex justify-center py-10">
      <Pagination
        total={total}
        limit={limit}
        activePage={page}
        onChangePage={onChange}
        prev
        next
        boundaryLinks
        ellipsis
      />
    </div>
  );
}
