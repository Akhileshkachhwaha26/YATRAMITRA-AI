import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Leaf, Bookmark, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { formatINR } from '../utils/constants';
import { SkeletonLine } from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';
import BookingButton from '../components/common/BookingButton';
import ReviewsSection from '../components/ReviewsSection';

export default function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState(false);
  const { token } = useAuthStore();
  const [paymentsConfigured, setPaymentsConfigured] = useState(false);

  useEffect(() => { api.get('/payments/status').then(({ data }) => setPaymentsConfigured(Boolean(data.configured))).catch(() => setPaymentsConfigured(false)); }, []);

  useEffect(() => {
    let active = true;
    setHotel(null);
    setError(false);
    api.get(`/hotels/${id}`).then(({ data }) => {
      if (active) setHotel(data.data);
    }).catch(() => {
      if (active) setError(true);
    });
    return () => { active = false; };
  }, [id]);

  async function handleSave() {
    if (!token) {
      toast.error('Log in to save hotels');
      return;
    }
    try {
      await api.post('/saved', { itemType: 'hotel', itemId: hotel._id, itemName: hotel.name });
      toast.success('Saved to your list');
    } catch {
      toast.error('Could not save right now');
    }
  }

  if (error) return <div className="mx-auto max-w-3xl px-4 py-16"><ErrorState message="This hotel couldn't be loaded." /></div>;
  if (!hotel) return <div className="mx-auto max-w-4xl space-y-3 px-4 py-16"><SkeletonLine className="h-64 w-full" /><SkeletonLine className="h-8 w-1/2" /></div>;

  return (
    <div>
      <div className="relative h-72 bg-gradient-to-br from-brand-700 to-jade-700" />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold">{hotel.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-900/60 dark:text-stone-50/60">
              <MapPin size={14} /> {hotel.destinationName}
              <Star size={13} fill="currentColor" className="ml-3 text-saffron-500" /> {hotel.rating?.toFixed(1)} ({hotel.reviewCount} reviews)
            </p>
          </div>
          <button type="button" onClick={handleSave} className="btn-secondary"><Bookmark size={16} /> Save</button>
        </div>

        <p className="mt-5 text-brand-900/80 dark:text-stone-50/80">{hotel.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {hotel.amenities?.map((a) => (
            <span key={a} className="chip">{a}</span>
          ))}
          {hotel.isEcoFriendly && <span className="chip !border-jade-500/30 !text-jade-700 dark:!text-jade-300"><Leaf size={12} /> Eco-friendly</span>}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-card border border-black/10 p-5 dark:border-white/10">
          <div>
            <p className="font-display text-2xl font-semibold">{formatINR(hotel.pricePerNightINR)}</p>
            <p className="text-xs text-brand-900/50 dark:text-stone-50/50">per night, before taxes</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <BookingButton itemType="hotel" itemId={hotel._id} itemName={hotel.name} amountINR={hotel.pricePerNightINR} contactPhone={hotel.contactPhone || hotel.phone} paymentsConfigured={paymentsConfigured} />
            <Link to={`/planner?destinationId=${hotel.destination?._id || hotel.destination}&destinationName=${encodeURIComponent(hotel.destinationName)}`} className="btn-primary">Plan a trip here</Link>
          </div>
        </div>

        {!hotel.realTimeAvailabilityIntegrated && (
          <p className="mt-4 flex items-center gap-2 rounded-control bg-black/[0.03] p-3 text-xs text-brand-900/60 dark:bg-white/5 dark:text-stone-50/60">
            <Info size={14} /> Real-time availability isn't connected to a live booking provider yet — pricing shown is indicative.
          </p>
        )}
        <ReviewsSection itemType="hotel" itemId={hotel._id} />
      </div>
    </div>
  );
}
