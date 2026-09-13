import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { SkeletonGrid } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import CompareModal from '../components/CompareModal';

const TYPE_ROUTES = {
  destination: (id) => `/destination/${id}`,
  hotel: (id) => `/hotels/${id}`,
  experience: (id) => `/experience/${id}`,
  business: () => '/businesses',
};

export default function Saved() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState('');
  const [compareIds, setCompareIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  async function load() {
    setError(false);
    setItems(null);
    try {
      const { data } = await api.get('/saved', { params: filter ? { itemType: filter } : {} });
      setItems(data.data);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    load();
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleRemove(id) {
    try {
      await api.delete(`/saved/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success('Removed from saved');
    } catch {
      toast.error('Could not remove item');
    }
  }

  const compareItems = items?.filter(i => compareIds.includes(i._id)) || [];
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Saved</h1>
      <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">
        Destinations, hotels and experiences you've bookmarked for later.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {['', 'destination', 'hotel', 'experience', 'business'].map((f) => (
          <button
            key={f || 'all'}
            type="button"
            onClick={() => setFilter(f)}
            className={`chip capitalize ${filter === f ? 'border-saffron-400 bg-saffron-500 text-brand-900' : ''}`}
          >
            {f === '' ? 'All' : `${f}s`}
          </button>
        ))}
      </div>

      {compareIds.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-card border border-saffron-400/30 bg-saffron-50 p-3 dark:bg-saffron-500/10">
          <span className="text-sm">{compareIds.length} selected for comparison</span>
          <button type="button" disabled={compareIds.length < 2} onClick={() => setShowCompare(true)} className="btn-primary !py-2 text-sm">Compare</button>
          <button type="button" onClick={() => setCompareIds([])} className="btn-ghost !py-2 text-sm">Clear</button>
        </div>
      )}

      <div className="mt-6">
        {error && <ErrorState message="Couldn't load your saved items." onRetry={load} />}
        {!error && !items && <SkeletonGrid count={4} />}
        {!error && items && items.length === 0 && (
          <EmptyState
            icon={Bookmark}
            title="Nothing saved yet"
            description="Tap the bookmark icon on any destination, hotel or experience to save it here."
            action={<Link to="/explore" className="btn-primary">Explore destinations</Link>}
          />
        )}
        {!error && items && items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item._id} className="card flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.itemName}</p>
                  <p className="text-xs capitalize text-brand-900/50 dark:text-stone-50/50">{item.itemType}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {item.itemType === 'destination' && (
                    <button type="button" onClick={() => setCompareIds(prev => prev.includes(item._id) ? prev.filter(id => id !== item._id) : prev.length < 3 ? [...prev, item._id] : prev)} className={`chip !px-2 !py-1 ${compareIds.includes(item._id) ? 'border-saffron-400 bg-saffron-500 text-brand-900' : ''}`}>Compare</button>
                  )}
                  <Link to={TYPE_ROUTES[item.itemType](item.itemId)} className="btn-ghost !p-2">
                    <Bookmark size={15} />
                  </Link>
                  <button type="button" onClick={() => handleRemove(item._id)} className="btn-ghost !p-2 text-red-500">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showCompare && compareItems.length >= 2 && <CompareModal items={compareItems.map(i => ({ itemType: i.itemType, itemId: i.itemId }))} onClose={() => setShowCompare(false)} />}
    </div>
  );
}
