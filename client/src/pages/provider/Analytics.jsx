import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Eye, MessageSquare, Star } from 'lucide-react';
import api from '../../services/api';
import { SkeletonGrid } from '../../components/common/Skeleton';

export default function Analytics() {
  const [listings, setListings] = useState(null);

  useEffect(() => {
    api.get('/businesses/mine').then(({ data }) => setListings(data.data)).catch(() => setListings([]));
  }, []);

  if (!listings) return <SkeletonGrid count={3} />;

  const totalViews = listings.reduce((s, b) => s + (b.analytics?.views || 0), 0);
  const totalInquiries = listings.reduce((s, b) => s + (b.analytics?.inquiriesCount || 0), 0);
  const avgRating = listings.length
    ? (listings.reduce((s, b) => s + (b.rating || 0), 0) / listings.length).toFixed(1)
    : '—';

  const chartData = listings.map((b) => ({
    name: b.name.length > 14 ? `${b.name.slice(0, 14)}…` : b.name,
    views: b.analytics?.views || 0,
    inquiries: b.analytics?.inquiriesCount || 0,
  }));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Analytics</h1>
      <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">Performance across all your listings.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Eye} label="Total views" value={totalViews} />
        <StatCard icon={MessageSquare} label="Total inquiries" value={totalInquiries} />
        <StatCard icon={Star} label="Average rating" value={avgRating} />
      </div>

      <div className="card mt-6 p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">Views & inquiries by listing</h2>
        {chartData.length === 0 ? (
          <p className="text-sm text-brand-900/50 dark:text-stone-50/50">No listings yet — add one to see analytics.</p>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-black/5 dark:stroke-white/10" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                <Bar dataKey="views" fill="#f4a93b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="inquiries" fill="#1f9d77" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="card flex items-center gap-3 p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-saffron-500/15 text-saffron-600 dark:text-saffron-300">
        <Icon size={17} />
      </div>
      <div>
        <p className="text-xl font-semibold">{value}</p>
        <p className="text-xs text-brand-900/50 dark:text-stone-50/50">{label}</p>
      </div>
    </div>
  );
}
