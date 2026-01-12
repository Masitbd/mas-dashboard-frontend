'use client';

import { Button } from 'rsuite';
import { useGetCommentsQuery, useUpdateCommentMutation } from '@/store/api';

export default function DashboardCommentsPage() {
  const { data = [] } = useGetCommentsQuery('all');
  const [updateComment] = useUpdateCommentMutation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Comments</h1>
      <div className="space-y-4">
        {data.map((comment) => (
          <div key={comment.id} className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm font-semibold">{comment.name}</p>
            <p className="text-xs text-muted">{comment.email}</p>
            <p className="mt-2 text-sm text-secondary">{comment.message}</p>
            <div className="mt-4 flex gap-3">
              <Button
                size="sm"
                appearance="ghost"
                onClick={() => updateComment({ id: comment.id, body: { approved: true } })}
              >
                Approve
              </Button>
              <Button
                size="sm"
                appearance="ghost"
                onClick={() => updateComment({ id: comment.id, body: { approved: false } })}
              >
                Hide
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
