import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Leaf, MapPin } from 'lucide-react';
import { formatINR } from '../../utils/constants';
import Scene from '../visuals/Scene';
import { sceneForHotel, imageForHotel } from '../../utils/scenes';

export default function HotelCard({ hotel, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      whileHover={{ y: -4 }}
      className="card group overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:shadow-brand-900/10 dark:hover:shadow-black/40"
    >
      <Link to={`/hotels/${hotel._id}`} className="block">
        <Scene scene={sceneForHotel(hotel)} image={imageForHotel(hotel)} className="h-40 w-full">
          {hotel.isEcoFriendly && (
            <span className="chip absolute left-3 top-3 !border-white/30 !bg-white/15 !text-white backdrop-blur-sm">
              <Leaf size={11} /> Eco-friendly
            </span>
          )}
        </Scene>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-semibold leading-snug">{hotel.name}</h3>
            <span className="flex shrink-0 items-center gap-1 text-sm text-saffron-600 dark:text-saffron-300">
              <Star size={13} fill="currentColor" /> {hotel.rating?.toFixed(1)}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-brand-900/60 dark:text-stone-50/60">
            <MapPin size={12} /> {hotel.destinationName}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {hotel.amenities?.slice(0, 2).map((a) => (
              <span key={a} className="chip">
                {a}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-display text-lg font-semibold">{formatINR(hotel.pricePerNightINR)}</span>
            <span className="text-xs text-brand-900/50 dark:text-stone-50/50">per night</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
