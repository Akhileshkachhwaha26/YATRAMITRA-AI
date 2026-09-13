import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Building2, CheckCircle2, Ban } from 'lucide-react';
import api from '../../services/api';
import { SkeletonGrid } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState(null);
  const [error, setError] = useState(false);

  async function load() {
    setError(false);
    try {
      const { data } = await api.get('/admin/businesses');
      setBusinesses(data.data);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id, status) {
    try {
      await api.put(`/admin/businesses/${id}/status`, { status });
      setBusinesses((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
      toast.success(`Listing ${status}`);
    } catch {
      toast.error('Could not update status');
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Business listings</h1>
      <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">Approve or suspend local business listings.</p>

      <div className="mt-6">
        {error && <ErrorState message="Couldn't load listings." onRetry={load} />}
        {!error && !businesses && <SkeletonGrid count={4} />}
        {!error && businesses && businesses.length === 0 && <EmptyState icon={Building2} title="No listings yet" />}
        {!error && businesses && businesses.length > 0 && (
          <div className="space-y-3">
            {businesses.map((b) => (
              <div key={b._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium">{b.name}</p>
                  <p className="text-xs text-brand-900/50 dark:text-stone-50/50">{b.type} · {b.destinationName} · status: {b.status}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus(b._id, 'approved')}
                    disabled={b.status === 'approved'}
                    className="btn-secondary !py-1.5 text-xs disabled:opacity-40"
                  >
                    <CheckCircle2 size={13} /> Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus(b._id, 'suspended')}
                    disabled={b.status === 'suspended'}
                    className="btn-ghost !py-1.5 text-xs !text-red-500 disabled:opacity-40"
                  >
                    <Ban size={13} /> Suspend
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
