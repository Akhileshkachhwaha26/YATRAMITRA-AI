import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Printer, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { formatINR } from '../utils/constants';
import { SkeletonLine } from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';

export default function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setTrip(null);
    setError(false);
    api.get(`/trips/${id}`).then(({ data }) => {
      if (active) setTrip(data.data);
    }).catch(() => {
      if (active) setError(true);
    });
    return () => { active = false; };
  }, [id]);

  function handleShare() {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState message="This trip couldn't be found, or you don't have access to it." />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="mx-auto max-w-4xl space-y-3 px-4 py-16">
        <SkeletonLine className="h-8 w-1/2" />
        <SkeletonLine className="h-32 w-full" />
        <SkeletonLine className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/my-trips" className="text-sm text-brand-900/50 hover:underline dark:text-stone-50/50">← Back to My Trips</Link>
          <h1 className="mt-2 font-display text-2xl font-semibold">{trip.title}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-900/60 dark:text-stone-50/60">
            <MapPin size={14} /> {trip.destinationName} · {trip.itinerary.length} days · {formatINR(trip.estimatedTotalCostINR)} estimated
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button type="button" onClick={handleShare} className="btn-ghost !py-2 text-sm"><Share2 size={14} /> Share</button>
          <button type="button" onClick={() => window.print()} className="btn-secondary !py-2 text-sm"><Printer size={14} /> Export PDF</button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {trip.itinerary.map((day) => (
          <div key={day.day} className="card p-5">
            <h3 className="font-display text-lg font-semibold">Day {day.day}</h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {['morning', 'afternoon', 'evening'].map((slot) => (
                <div key={slot} className="rounded-control bg-black/[0.03] p-3 dark:bg-white/5">
                  <p className="flex items-center gap-1.5 text-xs font-medium capitalize text-saffron-600 dark:text-saffron-300">
                    <Clock size={12} /> {slot}
                  </p>
                  <p className="mt-1 text-sm font-medium">{day[slot].title}</p>
                  <p className="mt-1 text-xs text-brand-900/60 dark:text-stone-50/60">{day[slot].description}</p>
                  <p className="mt-2 text-xs font-medium">{formatINR(day[slot].cost)}</p>
                </div>
              ))}
            </div>
            {day.localTip && (
              <p className="mt-3 rounded-control bg-jade-50 p-2 text-xs text-jade-700 dark:bg-jade-500/10 dark:text-jade-300">
                Local tip: {day.localTip}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
