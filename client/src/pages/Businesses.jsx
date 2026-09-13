import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import api from '../services/api';
import BusinessCard from '../components/cards/BusinessCard';
import { SkeletonGrid } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { BUSINESS_TYPES } from '../utils/constants';

export default function Businesses() {
  const [type, setType] = useState('');
  const [businesses, setBusinesses] = useState(null);
  const [error, setError] = useState(false);

  async function load() {
    setError(false);
    setBusinesses(null);
    try {
      const { data } = await api.get('/businesses', { params: type ? { type } : {} });
      setBusinesses(data.data);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    load();
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Local business ecosystem</h1>
          <p className="mt-1 max-w-2xl text-sm text-brand-900/60 dark:text-stone-50/60">
            Guides, homestays, restaurants, artisans and transport providers — the backbone of sustainable, community-led tourism.
          </p>
        </div>
        <Link to="/provider" className="btn-primary self-start sm:self-auto">List your business</Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" onClick={() => setType('')} className={`chip ${type === '' ? 'border-saffron-400 bg-saffron-500 text-brand-900' : ''}`}>
          All
        </button>
        {BUSINESS_TYPES.map((b) => (
          <button
            key={b.value}
            type="button"
            onClick={() => setType(b.value)}
            className={`chip ${type === b.value ? 'border-saffron-400 bg-saffron-500 text-brand-900' : ''}`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {error && <ErrorState message="Couldn't load businesses." onRetry={load} />}
        {!error && !businesses && <SkeletonGrid count={6} />}
        {!error && businesses && businesses.length === 0 && (
          <EmptyState icon={Building2} title="No businesses found" description="Try a different category, or be the first to list here." />
        )}
        {!error && businesses && businesses.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((b, i) => (
              <BusinessCard key={b._id} business={b} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
