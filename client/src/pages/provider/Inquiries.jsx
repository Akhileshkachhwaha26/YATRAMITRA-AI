import { useEffect, useState } from 'react';
import { Inbox, Mail } from 'lucide-react';
import api from '../../services/api';
import { SkeletonGrid } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export default function Inquiries() {
  const [listings, setListings] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get('/businesses/mine')
      .then(({ data }) => setListings(data.data))
      .catch(() => setError(true));
  }, []);

  const allInquiries = (listings || []).flatMap((b) =>
    (b.inquiries || []).map((inq) => ({ ...inq, businessName: b.name }))
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Inquiries</h1>
      <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">
        Messages travelers have sent to your listings.
      </p>

      <div className="mt-6">
        {error && <ErrorState message="Couldn't load inquiries." />}
        {!error && !listings && <SkeletonGrid count={3} />}
        {!error && listings && allInquiries.length === 0 && (
          <EmptyState icon={Inbox} title="No inquiries yet" description="When travelers reach out via your listings, they'll show up here." />
        )}
        {!error && allInquiries.length > 0 && (
          <div className="space-y-3">
            {allInquiries.map((inq, i) => (
              <div key={i} className="card flex items-start gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-800 text-saffron-400 dark:bg-white/10 dark:text-saffron-300">
                  <Mail size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <p className="text-sm font-semibold">{inq.name} <span className="font-normal text-brand-900/50 dark:text-stone-50/50">→ {inq.businessName}</span></p>
                    <span className="text-xs text-brand-900/40 dark:text-stone-50/40">
                      {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('en-IN') : ''}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-brand-900/50 dark:text-stone-50/50">{inq.email}</p>
                  <p className="mt-2 text-sm text-brand-900/75 dark:text-stone-50/75">{inq.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
