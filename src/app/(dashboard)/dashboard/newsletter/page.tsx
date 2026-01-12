'use client';

import { useGetSubscribersQuery } from '@/store/api';

export default function NewsletterPage() {
  const { data = [] } = useGetSubscribersQuery();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Newsletter subscribers</h1>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-xs uppercase text-muted">
            <tr>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {data.map((subscriber) => (
              <tr key={subscriber.id} className="border-b border-border">
                <td className="px-6 py-4 font-medium">{subscriber.email}</td>
                <td className="px-6 py-4 text-secondary">{subscriber.subscribedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
