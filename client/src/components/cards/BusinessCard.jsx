import { motion } from 'framer-motion';
import { Star, MapPin, BadgeCheck, Phone } from 'lucide-react';
import Scene from '../visuals/Scene';
import { sceneForBusiness, imageForBusiness } from '../../utils/scenes';

export default function BusinessCard({ business, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      whileHover={{ y: -3 }}
      className="card group overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:shadow-brand-900/10 dark:hover:shadow-black/40"
    >
      <Scene scene={sceneForBusiness(business)} image={imageForBusiness(business)} className="h-32 w-full" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="flex items-center gap-1.5 font-display text-base font-semibold leading-snug">
              {business.name}
              {business.verified && <BadgeCheck size={15} className="text-jade-500" />}
            </h3>
            <p className="mt-1 text-xs capitalize text-brand-900/60 dark:text-stone-50/60">
              {business.type?.replace('-', ' ')}
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-sm text-saffron-600 dark:text-saffron-300">
            <Star size={13} fill="currentColor" /> {business.rating?.toFixed(1)}
          </span>
        </div>
        <p className="mt-3 text-sm text-brand-900/70 dark:text-stone-50/70">{business.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-brand-900/50 dark:text-stone-50/50">
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {business.destinationName}
          </span>
          {business.contact?.phone && (
            <span className="flex items-center gap-1">
              <Phone size={12} /> {business.contact.phone}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
