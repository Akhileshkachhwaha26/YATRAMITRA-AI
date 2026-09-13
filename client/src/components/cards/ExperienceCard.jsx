import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin } from 'lucide-react';
import { formatINR } from '../../utils/constants';
import Scene from '../visuals/Scene';
import { sceneForExperience, imageForExperience } from '../../utils/scenes';

export default function ExperienceCard({ experience, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      whileHover={{ y: -4 }}
      className="card group overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:shadow-brand-900/10 dark:hover:shadow-black/40"
    >
      <Link to={`/experience/${experience._id}`} className="block">
        <Scene scene={sceneForExperience(experience)} image={imageForExperience(experience)} className="h-40 w-full">
          <span className="chip absolute left-3 top-3 !border-white/30 !bg-white/15 !text-white capitalize backdrop-blur-sm">
            {experience.category?.replace('-', ' ')}
          </span>
        </Scene>
        <div className="p-4">
          <h3 className="font-display text-base font-semibold leading-snug">{experience.title}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-brand-900/60 dark:text-stone-50/60">
            <MapPin size={12} /> {experience.destinationName}
          </p>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-brand-900/70 dark:text-stone-50/70">
              <Clock size={13} /> {experience.durationHours}h
            </span>
            <span className="flex items-center gap-1 text-saffron-600 dark:text-saffron-300">
              <Star size={13} fill="currentColor" /> {experience.rating?.toFixed(1)}
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-display text-lg font-semibold">{formatINR(experience.priceINR)}</span>
            <span className="text-xs text-brand-900/50 dark:text-stone-50/50">by {experience.host}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
