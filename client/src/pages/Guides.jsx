import { useEffect, useState } from 'react';
import { Users2 } from 'lucide-react';
import api from '../services/api';
import BusinessCard from '../components/cards/BusinessCard';
import { SkeletonGrid } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';

export default function Guides() {
  const [guides, setGuides] = useState(null);
  const [error, setError] = useState(false);

  async function load() {
    setError(false);
    setGuides(null);
    try {
      const { data } = await api.get('/businesses', { params: { type: 'guide' } });
      setGuides(data.data);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold">Local guides</h1>
      <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">
        Verified local guides who know their destination best — supporting community livelihoods directly.
      </p>

      <div className="mt-8">
        {error && <ErrorState message="Couldn't load guides." onRetry={load} />}
        {!error && !guides && <SkeletonGrid count={6} />}
        {!error && guides && guides.length === 0 && (
          <EmptyState icon={Users2} title="No guides listed yet" description="Providers can add guide listings from their dashboard." />
        )}
        {!error && guides && guides.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g, i) => (
              <BusinessCard key={g._id} business={g} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
