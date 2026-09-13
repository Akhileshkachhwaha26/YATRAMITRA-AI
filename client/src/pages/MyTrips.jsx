import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import TripCard from '../components/cards/TripCard';
import { SkeletonGrid } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';

const TABS = [
  { value: '', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];

export default function MyTrips() {
  const [tab, setTab] = useState('');
  const [trips, setTrips] = useState(null);
  const [error, setError] = useState(false);

  async function load() {
    setError(false);
    setTrips(null);
    try {
      const { data } = await api.get('/trips', { params: tab ? { status: tab } : {} });
      setTrips(data.data);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    load();
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDelete(id) {
    try {
      await api.delete(`/trips/${id}`);
      setTrips((t) => t.filter((trip) => trip._id !== id));
      toast.success('Trip deleted');
    } catch {
      toast.error('Could not delete trip');
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">My Trips</h1>
          <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">Every itinerary you've planned or saved.</p>
        </div>
        <Link to="/planner" className="btn-primary self-start sm:self-auto">
          <Sparkles size={16} /> Plan a new trip
        </Link>
      </div>

      <div className="mt-6 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={`chip ${tab === t.value ? 'border-saffron-400 bg-saffron-500 text-brand-900' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {error && <ErrorState message="Couldn't load your trips." onRetry={load} />}
        {!error && !trips && <SkeletonGrid count={3} className="lg:grid-cols-2" />}
        {!error && trips && trips.length === 0 && (
          <EmptyState
            icon={MapPin}
            title="No trips yet"
            description="Start with the AI Planner to build your first personalized itinerary."
            action={<Link to="/planner" className="btn-primary">Plan My Trip</Link>}
          />
        )}
        {!error && trips && trips.length > 0 && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {trips.map((trip, i) => (
              <TripCard key={trip._id} trip={trip} index={i} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
