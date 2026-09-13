import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Store, Star, Trash2, Pencil, CheckCircle2, Clock, Ban } from 'lucide-react';
import api from '../../services/api';
import { SkeletonGrid } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { BUSINESS_TYPES } from '../../utils/constants';

const STATUS_STYLE = {
  approved: { icon: CheckCircle2, className: 'text-jade-600 dark:text-jade-300' },
  pending: { icon: Clock, className: 'text-saffron-600 dark:text-saffron-300' },
  suspended: { icon: Ban, className: 'text-red-500' },
};

export default function MyListings() {
  const [listings, setListings] = useState(null);
  const [error, setError] = useState(false);

  async function load() {
    setError(false);
    setListings(null);
    try {
      const { data } = await api.get('/businesses/mine');
      setListings(data.data);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await api.delete(`/businesses/${id}`);
      toast.success('Listing deleted');
      setListings((prev) => prev.filter((b) => b._id !== id));
    } catch {
      toast.error('Could not delete listing');
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">My listings</h1>
          <p className="text-sm text-brand-900/60 dark:text-stone-50/60">Manage your guide, homestay or experience listings.</p>
        </div>
        <Link to="/provider/new" className="btn-primary self-start sm:self-auto">Add listing</Link>
      </div>

      {error && <ErrorState message="Couldn't load your listings." onRetry={load} />}
      {!error && !listings && <SkeletonGrid count={3} className="lg:grid-cols-3" />}
      {!error && listings && listings.length === 0 && (
        <EmptyState icon={Store} title="No listings yet" description="Add your first listing to start reaching travelers." />
      )}
      {!error && listings && listings.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((b) => {
            const StatusIcon = STATUS_STYLE[b.status]?.icon || Clock;
            return (
              <div key={b._id} className="card p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-lg font-semibold">{b.name}</p>
                    <p className="text-xs text-brand-900/50 dark:text-stone-50/50">
                      {BUSINESS_TYPES.find((t) => t.value === b.type)?.label} · {b.destinationName}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium ${STATUS_STYLE[b.status]?.className}`}>
                    <StatusIcon size={12} /> {b.status}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-brand-900/65 dark:text-stone-50/65">{b.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-brand-900/50 dark:text-stone-50/50">
                  <span className="flex items-center gap-1"><Star size={12} className="fill-saffron-400 text-saffron-400" /> {b.rating?.toFixed(1)} ({b.reviewCount})</span>
                  <span>{b.analytics?.views || 0} views · {b.analytics?.inquiriesCount || 0} inquiries</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link to={`/provider/edit/${b._id}`} className="btn-ghost !py-1.5 flex-1 text-sm">
                    <Pencil size={13} /> Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(b._id)}
                    className="btn-ghost !py-1.5 flex-1 text-sm !text-red-500"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
