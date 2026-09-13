import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, MapPin, Hotel, Sparkles, Building2, Briefcase } from 'lucide-react';
import api from '../../services/api';
import { SkeletonGrid } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  async function load() {
    setError(false);
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data.data);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (error) return <ErrorState message="Couldn't load admin stats." onRetry={load} />;
  if (!stats) return <SkeletonGrid count={6} />;

  const growthData = stats.userGrowth.map((g) => ({
    month: MONTH_NAMES[g._id.month - 1],
    users: g.count,
  }));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Platform overview</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={Users} label="Users" value={stats.counts.users} />
        <StatCard icon={MapPin} label="Destinations" value={stats.counts.destinations} />
        <StatCard icon={Hotel} label="Hotels" value={stats.counts.hotels} />
        <StatCard icon={Sparkles} label="Experiences" value={stats.counts.experiences} />
        <StatCard icon={Building2} label="Businesses" value={stats.counts.businesses} />
        <StatCard icon={Briefcase} label="Trips generated" value={stats.counts.trips} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">User growth (last 6 months)</h2>
          {growthData.length === 0 ? (
            <p className="text-sm text-brand-900/50 dark:text-stone-50/50">Not enough data yet.</p>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-black/5 dark:stroke-white/10" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                  <Line type="monotone" dataKey="users" stroke="#f4a93b" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Most popular destinations</h2>
          <div className="space-y-3">
            {stats.topDestinations.map((d, i) => (
              <div key={d._id} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-xs font-medium dark:bg-white/10">{i + 1}</span>
                  {d.name}
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                    <div className="h-full rounded-full bg-saffron-500" style={{ width: `${d.popularity}%` }} />
                  </div>
                  <span className="text-xs text-brand-900/50 dark:text-stone-50/50">{d.popularity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="card p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-saffron-400 dark:bg-white/10 dark:text-saffron-300">
        <Icon size={15} />
      </div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      <p className="text-xs text-brand-900/50 dark:text-stone-50/50">{label}</p>
    </div>
  );
}
