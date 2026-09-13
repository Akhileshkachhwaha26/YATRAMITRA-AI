import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Compass } from 'lucide-react';
import DestinationCard from '../components/cards/DestinationCard';
import { SkeletonGrid } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const STATES = ['Madhya Pradesh', 'Rajasthan', 'Goa', 'Uttar Pradesh', 'Uttarakhand', 'Kerala', 'Punjab'];
const BUDGETS = ['budget', 'moderate', 'premium', 'luxury'];

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const [destinations, setDestinations] = useState(null);
  const [error, setError] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { token } = useAuthStore();

  const search = params.get('search') || '';
  const state = params.get('state') || '';
  const budget = params.get('budget') || '';
  const sort = params.get('sort') || 'popularity';
  const filter = params.get('filter') || '';
  const tag = params.get('tag') || '';
  const wheelchairFriendly = params.get('wheelchairFriendly') === 'true';

  const load = useCallback(async () => {
    setError(false);
    setDestinations(null);
    try {
      const query = { sort };
      if (search) query.search = search;
      if (state) query.state = state;
      if (budget) query.budget = budget;
      if (tag) query.tag = tag;
      if (filter === 'hidden-gems') query.hiddenGems = true;
      if (filter === 'trending') query.trending = true;
      if (wheelchairFriendly) query.wheelchairFriendly = true;
      const { data } = await api.get('/destinations', { params: query });
      setDestinations(data.data);
    } catch {
      setError(true);
    }
  }, [search, state, budget, sort, filter, tag, wheelchairFriendly]);

  useEffect(() => {
    load();
  }, [load]);

  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  }

  async function handleSave(destination) {
    if (!token) {
      toast.error('Log in to save destinations');
      return;
    }
    try {
      await api.post('/saved', {
        itemType: 'destination',
        itemId: destination._id,
        itemName: destination.name,
      });
      toast.success(`${destination.name} saved`);
    } catch {
      toast.error('Could not save right now');
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Explore destinations</h1>
          <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">
            Search, filter and discover — from famous circuits to quiet hidden gems.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          className="btn-secondary self-start sm:self-auto"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => updateParam('search', e.target.value)}
          placeholder="Search by name, state or tag..."
          className="input max-w-sm"
        />
        {['', 'trending', 'hidden-gems'].map((f) => (
          <button
            key={f || 'all'}
            type="button"
            onClick={() => updateParam('filter', f)}
            className={`chip capitalize ${filter === f ? 'border-saffron-400 bg-saffron-500 text-brand-900' : ''}`}
          >
            {f === '' ? 'All' : f.replace('-', ' ')}
          </button>
        ))}
        {tag && (
          <span className="chip !border-saffron-400 !bg-saffron-500 !text-brand-900 capitalize">
            Mood: {tag}
            <button type="button" onClick={() => updateParam('tag', '')} className="ml-1 font-bold">
              ×
            </button>
          </span>
        )}
      </div>

      {filtersOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 grid grid-cols-1 gap-4 overflow-hidden rounded-card border border-black/10 p-4 dark:border-white/10 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-brand-900/60 dark:text-stone-50/60">State</label>
            <select value={state} onChange={(e) => updateParam('state', e.target.value)} className="input">
              <option value="">All states</option>
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-brand-900/60 dark:text-stone-50/60">Budget</label>
            <select value={budget} onChange={(e) => updateParam('budget', e.target.value)} className="input capitalize">
              <option value="">Any budget</option>
              {BUDGETS.map((b) => (
                <option key={b} value={b} className="capitalize">
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-brand-900/60 dark:text-stone-50/60">Sort by</label>
            <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} className="input">
              <option value="popularity">Most popular</option>
              <option value="rating">Highest rated</option>
              <option value="budget-low">Budget: low to high</option>
              <option value="budget-high">Budget: high to low</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-brand-900/60 dark:text-stone-50/60">Accessibility</label>
            <label className="input flex cursor-pointer items-center gap-2 !py-2.5">
              <input
                type="checkbox"
                checked={wheelchairFriendly}
                onChange={(e) => updateParam('wheelchairFriendly', e.target.checked ? 'true' : '')}
                className="h-4 w-4 accent-saffron-500"
              />
              <span className="text-sm">Wheelchair-friendly only</span>
            </label>
          </div>
        </motion.div>
      )}

      <div className="mt-8">
        {error && <ErrorState message="Couldn't load destinations right now." onRetry={load} />}
        {!error && !destinations && <SkeletonGrid count={9} />}
        {!error && destinations && destinations.length === 0 && (
          <EmptyState
            icon={Compass}
            title="No destinations match your filters"
            description="Try clearing a filter or searching a different term."
          />
        )}
        {!error && destinations && destinations.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d, i) => (
              <DestinationCard key={d._id} destination={d} index={i} onSave={handleSave} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
