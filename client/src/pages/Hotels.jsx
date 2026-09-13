import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Hotel as HotelIcon } from 'lucide-react';
import api from '../services/api';
import HotelCard from '../components/cards/HotelCard';
import { SkeletonGrid } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';

export default function Hotels() {
  const [params, setParams] = useSearchParams();
  const [hotels, setHotels] = useState(null);
  const [error, setError] = useState(false);

  const priceTier = params.get('priceTier') || '';
  const minRating = params.get('minRating') || '';
  const ecoFriendly = params.get('ecoFriendly') || '';
  const sort = params.get('sort') || '';

  async function load() {
    setError(false);
    setHotels(null);
    try {
      const query = {};
      const destination = params.get('destination');
      if (destination) query.destination = destination;
      if (priceTier) query.priceTier = priceTier;
      if (minRating) query.minRating = minRating;
      if (ecoFriendly) query.ecoFriendly = ecoFriendly;
      if (sort) query.sort = sort;
      const { data } = await api.get('/hotels', { params: query });
      setHotels(data.data);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    load();
  }, [priceTier, minRating, ecoFriendly, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold">Hotels</h1>
      <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">
        Curated stays across every budget — architecture is ready for live booking integrations.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <select value={priceTier} onChange={(e) => updateParam('priceTier', e.target.value)} className="input w-auto">
          <option value="">Any price</option>
          <option value="budget">Budget</option>
          <option value="moderate">Moderate</option>
          <option value="premium">Premium</option>
          <option value="luxury">Luxury</option>
        </select>
        <select value={minRating} onChange={(e) => updateParam('minRating', e.target.value)} className="input w-auto">
          <option value="">Any rating</option>
          <option value="4">4+ stars</option>
          <option value="4.5">4.5+ stars</option>
        </select>
        <button
          type="button"
          onClick={() => updateParam('ecoFriendly', ecoFriendly ? '' : 'true')}
          className={`chip ${ecoFriendly ? 'border-jade-400 bg-jade-500 text-white' : ''}`}
        >
          Eco-friendly only
        </button>
        <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} className="input w-auto">
          <option value="">Sort: rating</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
      </div>

      <div className="mt-8">
        {error && <ErrorState message="Couldn't load hotels." onRetry={load} />}
        {!error && !hotels && <SkeletonGrid count={9} />}
        {!error && hotels && hotels.length === 0 && (
          <EmptyState icon={HotelIcon} title="No hotels match these filters" description="Try broadening your search." />
        )}
        {!error && hotels && hotels.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.map((h, i) => (
              <HotelCard key={h._id} hotel={h} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
