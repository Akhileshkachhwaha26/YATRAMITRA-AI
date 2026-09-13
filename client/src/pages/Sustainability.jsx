import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, TrainFront, Users, Recycle, TreePine, BarChart3, Sparkles } from 'lucide-react';
import api from '../services/api';
import DestinationCard from '../components/cards/DestinationCard';
import HotelCard from '../components/cards/HotelCard';
import { SkeletonGrid } from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';

const TIPS = [
  { icon: Recycle, title: 'Carry a reusable bottle', text: 'Refill stations are increasingly common near heritage sites and national parks.' },
  { icon: Users, title: 'Book local, not just cheap', text: 'Choosing a homestay or local guide keeps more of your spend in the community.' },
  { icon: TrainFront, title: 'Prefer trains and shared transport', text: 'Rail and shared transport cut per-traveler emissions significantly versus private cars.' },
  { icon: TreePine, title: 'Visit off-peak', text: 'Shoulder-season travel eases pressure on fragile sites and often costs less.' },
];

export default function Metric({ label, value }) { return <div className="rounded-xl bg-white/70 p-4 dark:bg-black/10"><p className="text-xl font-semibold">{value}</p><p className="mt-1 text-xs opacity-60">{label}</p></div>; }

function Sustainability() {
  const [ecoDestinations, setEcoDestinations] = useState(null);
  const [ecoHotels, setEcoHotels] = useState(null);
  const [error, setError] = useState(false);
  const [impact, setImpact] = useState(null);
  const [evaluation, setEvaluation] = useState(null);

  async function load() {
    setError(false);
    setEcoDestinations(null);
    setEcoHotels(null);
    try {
      const [dRes, hRes] = await Promise.all([
        api.get('/destinations', { params: { hiddenGems: true, sort: 'rating', limit: 6 } }),
        api.get('/hotels', { params: { ecoFriendly: true, limit: 6 } }),
      ]);
      setEcoDestinations(dRes.data.data);
      setEcoHotels(hRes.data.data);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    load();
    Promise.all([api.get('/impact'), api.get('/ai/evaluation')]).then(([i,e]) => { setImpact(i.data.data); setEvaluation(e.data.data); }).catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="chip !border-jade-500/30 !text-jade-700 dark:!text-jade-300"><Leaf size={13} /> Sustainable tourism</span>
      <h1 className="mt-3 font-display text-3xl font-semibold">Travel that gives back</h1>
      <p className="mt-2 max-w-2xl text-sm text-brand-900/60 dark:text-stone-50/60">
        Every destination on YatraMitra carries a sustainability score across environment, local economy, crowd
        management, waste and transport — so you can choose trips that are better for places and the people who
        live there.
      </p>

      {impact && (
        <div className="mt-8 rounded-card border border-jade-500/20 bg-jade-50 p-6 dark:bg-jade-500/10">
          <div className="flex items-center gap-2"><BarChart3 size={18} className="text-jade-600"/><h2 className="font-display text-lg font-semibold">YatraMitra impact dashboard</h2></div>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Metric label="Destinations" value={impact.destinations}/><Metric label="Hidden gems" value={impact.hiddenGems}/><Metric label="Avg sustainability" value={`${impact.avgSustainability}/100`}/><Metric label="Local-economy index" value={`${impact.avgLocalEconomy}/100`}/>
          </div>
          <p className="mt-4 text-xs opacity-60">These are catalog-derived indicators for transparent demo measurement, not claimed field-study results.</p>
        </div>
      )}

      {evaluation && (
        <div className="mt-6 card p-6">
          <div className="flex items-center gap-2"><Sparkles size={18} className="text-saffron-500"/><h2 className="font-display text-lg font-semibold">AI recommendation evaluation</h2></div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Metric label="Precision@5" value={`${Math.round(evaluation.precisionAt5*100)}%`}/><Metric label="Recall@5" value={`${Math.round(evaluation.recallAt5*100)}%`}/><Metric label="F1@5" value={`${Math.round(evaluation.f1At5*100)}%`}/><Metric label="Benchmark cases" value={evaluation.benchmarkCases}/>
          </div>
          <p className="mt-4 text-xs opacity-60">Synthetic benchmark for engineering validation. It should be replaced or expanded with real user-labelled data before making production accuracy claims.</p>
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TIPS.map((tip) => (
          <div key={tip.title} className="card p-5">
            <tip.icon size={22} className="text-jade-500" />
            <h3 className="mt-3 font-semibold">{tip.title}</h3>
            <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">{tip.text}</p>
          </div>
        ))}
      </div>

      {error && <div className="mt-10"><ErrorState message="Couldn't load sustainable options." onRetry={load} /></div>}

      <div className="mt-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Less-crowded destinations to consider</h2>
          <Link to="/explore?filter=hidden-gems" className="text-sm font-medium text-saffron-600 dark:text-saffron-300">View all</Link>
        </div>
        {!error && !ecoDestinations && <SkeletonGrid count={3} className="lg:grid-cols-3" />}
        {!error && ecoDestinations && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ecoDestinations.map((d, i) => (
              <DestinationCard key={d._id} destination={d} index={i} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Eco-friendly hotels</h2>
          <Link to="/hotels?ecoFriendly=true" className="text-sm font-medium text-saffron-600 dark:text-saffron-300">View all</Link>
        </div>
        {!error && !ecoHotels && <SkeletonGrid count={3} className="lg:grid-cols-3" />}
        {!error && ecoHotels && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ecoHotels.map((h, i) => (
              <HotelCard key={h._id} hotel={h} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
