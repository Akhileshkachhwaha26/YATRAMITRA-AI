import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Bookmark, Share2, Leaf, ShieldAlert, Sun, CloudRain, Snowflake, Accessibility } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { formatINR } from '../utils/constants';
import { SkeletonLine } from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';
import HotelCard from '../components/cards/HotelCard';
import ExperienceCard from '../components/cards/ExperienceCard';
import Scene from '../components/visuals/Scene';
import LiveTravelPanel from '../components/LiveTravelPanel';
import ReviewsSection from '../components/ReviewsSection';
import { sceneForDestination, imageForDestination } from '../utils/scenes';

export default function DestinationDetails() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [hiddenGemAlternative, setHiddenGemAlternative] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [error, setError] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    let active = true;
    setDestination(null);
    setError(false);
    (async () => {
      try {
        const { data } = await api.get(`/destinations/${id}`);
        if (!active) return;
        setDestination(data.data);
        setHiddenGemAlternative(data.hiddenGemAlternative);
        const [hRes, eRes] = await Promise.all([
          api.get('/hotels', { params: { destination: data.data._id, limit: 3 } }),
          api.get('/experiences', { params: { destination: data.data._id, limit: 3 } }),
        ]);
        setHotels(hRes.data.data);
        setExperiences(eRes.data.data);
      } catch {
        if (active) setError(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  async function handleSave() {
    if (!token) {
      toast.error('Log in to save destinations');
      return;
    }
    try {
      await api.post('/saved', { itemType: 'destination', itemId: destination._id, itemName: destination.name });
      toast.success('Saved to your list');
    } catch {
      toast.error('Could not save right now');
    }
  }

  function handleShare() {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState message="This destination couldn't be loaded." />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-16">
        <SkeletonLine className="h-64 w-full" />
        <SkeletonLine className="h-8 w-1/2" />
        <SkeletonLine className="h-4 w-3/4" />
      </div>
    );
  }

  return (
    <div>
      <Scene
        scene={sceneForDestination(destination)}
        image={imageForDestination(destination)}
        kenBurns={false}
        className="relative flex h-72 items-end sm:h-96"
      >
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-8 text-white sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {destination.isHiddenGem && <span className="chip !border-white/30 !bg-white/15 !text-white">Hidden gem</span>}
            {destination.isTrending && <span className="chip !border-white/30 !bg-white/15 !text-white">Trending</span>}
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{destination.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
            <MapPin size={14} /> {destination.state}
            <Star size={13} fill="currentColor" className="ml-3 text-saffron-300" /> {destination.rating?.toFixed(1)} ({destination.reviewCount} reviews)
          </p>
        </div>
      </Scene>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-3">
            <Link to={`/planner?destinationId=${destination._id}&destinationName=${encodeURIComponent(destination.name)}`} className="btn-primary">
              Plan a trip here
            </Link>
            <button type="button" onClick={handleSave} className="btn-secondary">
              <Bookmark size={16} /> Save
            </button>
            <button type="button" onClick={handleShare} className="btn-ghost">
              <Share2 size={16} /> Share
            </button>
          </div>

          <p className="mt-6 leading-relaxed text-brand-900/80 dark:text-stone-50/80">{destination.description}</p>

          {hiddenGemAlternative && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-card border border-jade-500/30 bg-jade-50 p-5 dark:bg-jade-500/10"
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-jade-700 dark:text-jade-300">
                <Leaf size={16} /> Consider a quieter alternative
              </p>
              <p className="mt-1 text-sm text-brand-900/70 dark:text-stone-50/70">
                {destination.name} gets crowded. {hiddenGemAlternative.name} offers a similar experience with fewer
                crowds and stronger support for local communities.
              </p>
              <Link
                to={`/destination/${hiddenGemAlternative.slug}`}
                className="mt-3 inline-block text-sm font-semibold text-jade-700 underline dark:text-jade-300"
              >
                Explore {hiddenGemAlternative.name} →
              </Link>
            </motion.div>
          )}

          <h2 className="mt-10 font-display text-xl font-semibold">Top attractions</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {destination.attractions?.map((a) => (
              <div key={a.name} className="card p-4">
                <h3 className="font-semibold">{a.name}</h3>
                <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">{a.description}</p>
              </div>
            ))}
          </div>

          {hotels.length > 0 && (
            <>
              <div className="mt-10 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Where to stay</h2>
                <Link to={`/hotels?destination=${destination._id}`} className="text-sm font-medium text-saffron-600 dark:text-saffron-300">
                  View all
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {hotels.map((h, i) => (
                  <HotelCard key={h._id} hotel={h} index={i} />
                ))}
              </div>
            </>
          )}

          {experiences.length > 0 && (
            <>
              <div className="mt-10 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Local experiences</h2>
                <Link to={`/experiences?destination=${destination._id}`} className="text-sm font-medium text-saffron-600 dark:text-saffron-300">
                  View all
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {experiences.map((exp, i) => (
                  <ExperienceCard key={exp._id} experience={exp} index={i} />
                ))}
              </div>
            </>
          )}
        <ReviewsSection itemType="destination" itemId={destination._id} />
        </div>

        <aside className="space-y-6">
          <div className="card p-5">
            <h3 className="font-semibold">Trip essentials</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-brand-900/60 dark:text-stone-50/60">Avg. cost/day</dt>
                <dd className="font-medium">{formatINR(destination.avgCostPerDayINR)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-900/60 dark:text-stone-50/60">Budget tier</dt>
                <dd className="font-medium capitalize">{destination.budgetLevel}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-900/60 dark:text-stone-50/60">Best season</dt>
                <dd className="font-medium capitalize">{destination.bestSeason?.join(', ')}</dd>
              </div>
            </dl>
          </div>

          <div className="card p-5">
            <h3 className="flex items-center gap-2 font-semibold">Weather</h3>
            <div className="mt-3 space-y-2 text-sm">
              <p className="flex items-center gap-2"><Sun size={14} className="text-saffron-500" /> Summer — {destination.weather?.summer}</p>
              <p className="flex items-center gap-2"><CloudRain size={14} className="text-brand-500" /> Monsoon — {destination.weather?.monsoon}</p>
              <p className="flex items-center gap-2"><Snowflake size={14} className="text-jade-500" /> Winter — {destination.weather?.winter}</p>
            </div>
          </div>

          <LiveTravelPanel destination={destination} />

          {destination.sustainability && (
            <div className="card p-5">
              <h3 className="flex items-center gap-2 font-semibold">
                <Leaf size={16} className="text-jade-500" /> Sustainability score
              </h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold text-jade-600 dark:text-jade-300">
                  {destination.sustainability.score}
                </span>
                <span className="text-sm text-brand-900/50 dark:text-stone-50/50">/100</span>
              </div>
              <div className="mt-3 space-y-2">
                {['environment', 'localEconomy', 'crowdManagement', 'waste', 'transport'].map((k) => (
                  <div key={k}>
                    <div className="flex justify-between text-xs capitalize text-brand-900/60 dark:text-stone-50/60">
                      <span>{k.replace(/([A-Z])/g, ' $1')}</span>
                      <span>{destination.sustainability[k]}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-jade-500"
                        style={{ width: `${destination.sustainability[k]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {destination.safetyNotes && (
            <div className="card border-saffron-500/20 bg-saffron-50 p-5 dark:bg-saffron-500/10">
              <h3 className="flex items-center gap-2 font-semibold">
                <ShieldAlert size={16} className="text-saffron-600 dark:text-saffron-300" /> Safety note
              </h3>
              <p className="mt-2 text-sm text-brand-900/70 dark:text-stone-50/70">{destination.safetyNotes}</p>
            </div>
          )}

          {destination.accessibility && (
            <div className="card p-5">
              <h3 className="flex items-center gap-2 font-semibold">
                <Accessibility size={16} className="text-brand-800 dark:text-saffron-300" /> Accessibility
              </h3>
              <p className="mt-2 flex items-center gap-1.5 text-sm">
                {destination.accessibility.wheelchairFriendly ? (
                  <span className="text-jade-600 dark:text-jade-300">Generally wheelchair-friendly</span>
                ) : (
                  <span className="text-brand-900/70 dark:text-stone-50/70">Limited wheelchair access</span>
                )}
              </p>
              {destination.accessibility.notes && (
                <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">{destination.accessibility.notes}</p>
              )}
              <p className="mt-2 text-xs text-brand-900/45 dark:text-stone-50/45">
                General terrain guidance, not a certified accessibility audit — always confirm specific needs directly.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
