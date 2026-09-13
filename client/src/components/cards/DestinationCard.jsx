import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Leaf, Bookmark, ArrowUpRight, BadgeCheck, CalendarDays, Accessibility } from 'lucide-react';
import { formatINR } from '../../utils/constants';
import Scene from '../visuals/Scene';
import { sceneForDestination, imageForDestination } from '../../utils/scenes';

/** Every destination in this directory is hand-curated by the YatraMitra
 * team (not open user submissions), so a "verified listing" badge is an
 * honest, platform-level claim — not a per-review or government
 * certification claim. */
function primaryCategory(destination) {
  const raw = destination.tags?.[0] || destination.interests?.[0] || destination.region;
  if (!raw) return null;
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export default function DestinationCard({ destination, onSave, saved, index = 0, size = 'md' }) {
  const scene = sceneForDestination(destination);
  const image = imageForDestination(destination);
  const heightClass = size === 'lg' ? 'h-64 sm:h-80' : size === 'sm' ? 'h-36' : 'h-48';
  const category = primaryCategory(destination);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.06 }}
      whileHover={{ y: -4 }}
      className="card group relative overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:shadow-brand-900/10 dark:hover:shadow-black/40"
    >
      <Link to={`/destination/${destination.slug || destination._id}`} className="block">
        <Scene scene={scene} image={image} className={`w-full ${heightClass}`}>
          <div className="absolute inset-0 flex items-end justify-between p-4">
            <div className="flex flex-wrap gap-1.5">
              {destination.isHiddenGem && (
                <span className="chip !border-white/30 !bg-white/15 !text-white backdrop-blur-sm">Hidden gem</span>
              )}
              {destination.isTrending && (
                <span className="chip !border-white/30 !bg-white/15 !text-white backdrop-blur-sm">Trending</span>
              )}
              {destination.accessibility?.wheelchairFriendly && (
                <span
                  className="chip !border-white/30 !bg-white/15 !text-white backdrop-blur-sm"
                  title={destination.accessibility.notes || 'Generally wheelchair-friendly terrain'}
                >
                  <Accessibility size={12} /> Wheelchair-friendly
                </span>
              )}
            </div>
            <span className="flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <ArrowUpRight size={15} />
            </span>
          </div>
          <div className="absolute left-4 top-3 flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm" title="Curated & verified by the YatraMitra team">
            <BadgeCheck size={12} /> Verified
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onSave?.(destination);
            }}
            aria-label={saved ? 'Remove from saved' : 'Save destination'}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </Scene>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-semibold leading-snug">{destination.name}</h3>
            <span className="flex shrink-0 items-center gap-1 text-sm text-saffron-600 dark:text-saffron-300">
              <Star size={13} fill="currentColor" /> {destination.rating?.toFixed(1)}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-brand-900/60 dark:text-stone-50/60">
            <MapPin size={12} /> {destination.state}
            {category && <span className="text-brand-900/30 dark:text-stone-50/30">· {category}</span>}
          </p>
          {destination.bestSeason?.length > 0 && (
            <p className="mt-1.5 flex items-center gap-1 text-[11px] text-brand-900/50 dark:text-stone-50/50">
              <CalendarDays size={11} /> Best in {destination.bestSeason.slice(0, 2).join(', ')}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-brand-900/70 dark:text-stone-50/70">
              ~{formatINR(destination.avgCostPerDayINR)}/day
            </span>
            {destination.sustainability?.score && (
              <span className="flex items-center gap-1 text-xs text-jade-600 dark:text-jade-300">
                <Leaf size={12} /> {destination.sustainability.score}/100
              </span>
            )}
          </div>
          <span className="mt-3 flex items-center gap-1 text-xs font-medium text-saffron-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-saffron-300">
            Explore <ArrowUpRight size={12} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
