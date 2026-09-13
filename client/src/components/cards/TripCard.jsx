import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Wallet } from 'lucide-react';
import { formatINR } from '../../utils/constants';

const STATUS_STYLES = {
  upcoming: 'bg-saffron-100 text-saffron-700 dark:bg-saffron-500/15 dark:text-saffron-300',
  completed: 'bg-jade-100 text-jade-700 dark:bg-jade-500/15 dark:text-jade-300',
  cancelled: 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300',
};

export default function TripCard({ trip, index = 0, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      className="card p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-base font-semibold">{trip.title}</h3>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[trip.status] || ''}`}>
          {trip.status}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-brand-900/70 dark:text-stone-50/70">
        {trip.startDate && (
          <span className="flex items-center gap-1.5">
            <Calendar size={14} /> {new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Users size={14} /> {trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1.5">
          <Wallet size={14} /> {formatINR(trip.estimatedTotalCostINR)}
        </span>
      </div>
      <div className="mt-4 flex gap-2">
        <Link to={`/trip/${trip._id}`} className="btn-secondary !px-4 !py-2 text-sm">
          View itinerary
        </Link>
        {onDelete && (
          <button type="button" onClick={() => onDelete(trip._id)} className="btn-ghost !px-4 !py-2 text-sm text-red-500">
            Delete
          </button>
        )}
      </div>
    </motion.div>
  );
}
