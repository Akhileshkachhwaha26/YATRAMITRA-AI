import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bookmark, Wallet, Sparkles, ArrowRight } from 'lucide-react';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { formatINR } from '../utils/constants';
import DestinationCard from '../components/cards/DestinationCard';
import { SkeletonGrid, SkeletonLine } from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [trips, setTrips] = useState(null);
  const [saved, setSaved] = useState(null);
  const [recommended, setRecommended] = useState(null);
  const [error, setError] = useState(false);

  async function load() {
    setError(false);
    try {
      const [tripsRes, savedRes, recRes] = await Promise.all([
        api.get('/trips'),
        api.get('/saved'),
        api.post('/ai/recommend', {
          interests: user?.interests || [],
          budgetTier: user?.budgetPreference || 'moderate',
          limit: 3,
        }),
      ]);
      setTrips(tripsRes.data.data);
      setSaved(savedRes.data.data);
      setRecommended(recRes.data.data.map((r) => r.destination));
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const upcomingTrip = trips?.find((t) => t.status === 'upcoming');
  const totalBudget = trips?.reduce((sum, t) => sum + (t.estimatedTotalCostINR || 0), 0) || 0;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
      <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">Here's where your travel planning stands.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={MapPin} label="Trips planned" value={trips?.length ?? '—'} />
        <StatCard icon={Bookmark} label="Saved places" value={saved?.length ?? '—'} />
        <StatCard icon={Sparkles} label="Upcoming trips" value={trips?.filter((t) => t.status === 'upcoming').length ?? '—'} />
        <StatCard icon={Wallet} label="Total trip budget" value={trips ? formatINR(totalBudget) : '—'} />
      </div>

      {error && <div className="mt-8"><ErrorState message="Couldn't load your dashboard data." onRetry={load} /></div>}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-semibold">Your upcoming trip</h2>
          {!trips && <SkeletonLine className="mt-3 h-24 w-full" />}
          {trips && !upcomingTrip && (
            <div className="mt-4 flex flex-col items-start gap-3">
              <p className="text-sm text-brand-900/60 dark:text-stone-50/60">No upcoming trips yet.</p>
              <Link to="/planner" className="btn-primary">Plan My Trip <ArrowRight size={15} /></Link>
            </div>
          )}
          {upcomingTrip && (
            <div className="mt-4">
              <p className="font-display text-lg font-semibold">{upcomingTrip.title}</p>
              <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">
                {upcomingTrip.destinationName} · {upcomingTrip.itinerary?.length} days · {formatINR(upcomingTrip.estimatedTotalCostINR)}
              </p>
              <Link to={`/trip/${upcomingTrip._id}`} className="btn-secondary mt-4 !py-2 text-sm">View itinerary</Link>
            </div>
          )}
        </div>

        <div className="card p-5">
          <h2 className="font-semibold">Your travel profile</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-900/60 dark:text-stone-50/60">Budget preference</dt>
              <dd className="font-medium capitalize">{user?.budgetPreference}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-900/60 dark:text-stone-50/60">Travel style</dt>
              <dd className="font-medium capitalize">{user?.travelStyle}</dd>
            </div>
            <div>
              <dt className="mb-1.5 text-brand-900/60 dark:text-stone-50/60">Interests</dt>
              <dd className="flex flex-wrap gap-1.5">
                {(user?.interests || []).map((i) => (
                  <span key={i} className="chip !py-0.5 !text-xs">{i}</span>
                ))}
              </dd>
            </div>
          </dl>
          <Link to="/profile" className="mt-4 inline-block text-sm font-medium text-saffron-600 dark:text-saffron-300">Edit profile →</Link>
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">AI recommendations for you</h2>
          <Link to="/explore" className="text-sm font-medium text-saffron-600 dark:text-saffron-300">Explore more</Link>
        </div>
        {!error && !recommended && <SkeletonGrid count={3} className="lg:grid-cols-3" />}
        {!error && recommended && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((d, i) => (
              <DestinationCard key={d._id} destination={d} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="card p-4">
      <Icon size={18} className="text-saffron-500" />
      <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
      <p className="text-xs text-brand-900/50 dark:text-stone-50/50">{label}</p>
    </div>
  );
}
