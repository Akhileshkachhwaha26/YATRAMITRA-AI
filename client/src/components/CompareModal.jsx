import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import api from '../services/api';
import { formatINR } from '../utils/constants';
import { SkeletonLine } from './common/Skeleton';

const DETAIL_ENDPOINT = {
  destination: (id) => `/destinations/${id}`,
  hotel: (id) => `/hotels/${id}`,
  experience: (id) => `/experiences/${id}`,
  business: (id) => `/businesses/${id}`,
};

const ATTRIBUTE_BUILDERS = {
  destination: (d) => [
    ['Rating', `${d.rating} ★ (${d.reviewCount})`],
    ['Budget tier', d.budgetLevel],
    ['Avg. cost/day', formatINR(d.avgCostPerDayINR)],
    ['Best season', (d.bestSeason || []).join(', ') || '—'],
    ['Sustainability', d.sustainability ? `${d.sustainability.score}/100` : '—'],
    ['Hidden gem', d.isHiddenGem ? 'Yes' : 'No'],
  ],
  hotel: (h) => [
    ['Rating', `${h.rating} ★ (${h.reviewCount})`],
    ['Price tier', h.priceTier],
    ['Price/night', formatINR(h.pricePerNightINR)],
    ['Amenities', String((h.amenities || []).length)],
    ['Eco-friendly', h.isEcoFriendly ? 'Yes' : 'No'],
  ],
  experience: (e) => [
    ['Rating', `${e.rating} ★ (${e.reviewCount})`],
    ['Price', formatINR(e.priceINR)],
    ['Duration', `${e.durationHours}h`],
    ['Category', e.category],
    ['Host', e.host],
  ],
  business: (b) => [
    ['Rating', `${b.rating} ★ (${b.reviewCount})`],
    ['Type', b.type],
    ['Verified', b.verified ? 'Yes' : 'No'],
    ['Languages', (b.languagesSpoken || []).join(', ') || '—'],
  ],
};

export default function CompareModal({ items, onClose }) {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setDetails(null);
    setError(false);
    Promise.all(items.map((item) => api.get(DETAIL_ENDPOINT[item.itemType](item.itemId))))
      .then((responses) => {
        if (active) setDetails(responses.map((r) => r.data.data));
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [items]);

  const itemType = items[0]?.itemType;
  const buildAttrs = ATTRIBUTE_BUILDERS[itemType];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-card bg-white p-6 dark:bg-brand-900"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold capitalize">Comparing {itemType}s</h2>
            <button type="button" onClick={onClose} aria-label="Close comparison" className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10">
              <X size={18} />
            </button>
          </div>

          {error && <p className="text-sm text-red-500">Couldn't load comparison data.</p>}

          {!error && !details && (
            <div className="space-y-3">
              <SkeletonLine className="h-10" />
              <SkeletonLine className="h-40" />
            </div>
          )}

          {!error && details && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-left text-sm">
                <thead>
                  <tr>
                    <th className="w-32 pb-3 pr-3 text-xs uppercase tracking-wide text-brand-900/40 dark:text-stone-50/40" />
                    {details.map((d) => (
                      <th key={d._id} className="pb-3 pr-3 font-display text-base font-semibold">
                        {d.name || d.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {buildAttrs(details[0]).map(([label], rowIdx) => (
                    <tr key={label} className="border-t border-black/5 dark:border-white/10">
                      <td className="py-3 pr-3 text-xs font-medium text-brand-900/50 dark:text-stone-50/50">{label}</td>
                      {details.map((d) => (
                        <td key={d._id} className="py-3 pr-3">
                          {buildAttrs(d)[rowIdx][1]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
