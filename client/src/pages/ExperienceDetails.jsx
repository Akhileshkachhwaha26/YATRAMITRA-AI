import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Users, Bookmark } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { formatINR } from '../utils/constants';
import { SkeletonLine } from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';
import BookingButton from '../components/common/BookingButton';
import ReviewsSection from '../components/ReviewsSection';

export default function ExperienceDetails() {
  const { id } = useParams();
  const [experience, setExperience] = useState(null);
  const [error, setError] = useState(false);
  const { token } = useAuthStore();
  const [paymentsConfigured, setPaymentsConfigured] = useState(false);

  useEffect(() => { api.get('/payments/status').then(({ data }) => setPaymentsConfigured(Boolean(data.configured))).catch(() => setPaymentsConfigured(false)); }, []);

  useEffect(() => {
    let active = true;
    setExperience(null);
    setError(false);
    api.get(`/experiences/${id}`).then(({ data }) => {
      if (active) setExperience(data.data);
    }).catch(() => {
      if (active) setError(true);
    });
    return () => { active = false; };
  }, [id]);

  async function handleSave() {
    if (!token) {
      toast.error('Log in to save experiences');
      return;
    }
    try {
      await api.post('/saved', { itemType: 'experience', itemId: experience._id, itemName: experience.title });
      toast.success('Saved to your list');
    } catch {
      toast.error('Could not save right now');
    }
  }

  if (error) return <div className="mx-auto max-w-3xl px-4 py-16"><ErrorState message="This experience couldn't be loaded." /></div>;
  if (!experience) return <div className="mx-auto max-w-4xl space-y-3 px-4 py-16"><SkeletonLine className="h-64 w-full" /><SkeletonLine className="h-8 w-1/2" /></div>;

  return (
    <div>
      <div className="relative h-72 bg-gradient-to-br from-saffron-600 to-brand-800" />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <span className="chip capitalize">{experience.category?.replace('-', ' ')}</span>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold">{experience.title}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-900/60 dark:text-stone-50/60">
              <MapPin size={14} /> {experience.destinationName}
              <Star size={13} fill="currentColor" className="ml-3 text-saffron-500" /> {experience.rating?.toFixed(1)} ({experience.reviewCount} reviews)
            </p>
          </div>
          <button type="button" onClick={handleSave} className="btn-secondary"><Bookmark size={16} /> Save</button>
        </div>

        <p className="mt-5 text-brand-900/80 dark:text-stone-50/80">{experience.description}</p>

        <div className="mt-5 flex flex-wrap gap-4 text-sm text-brand-900/70 dark:text-stone-50/70">
          <span className="flex items-center gap-1.5"><Clock size={15} /> {experience.durationHours} hours</span>
          <span className="flex items-center gap-1.5"><Users size={15} /> {experience.groupSize}</span>
          <span>Hosted by {experience.host}</span>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-card border border-black/10 p-5 dark:border-white/10">
          <div>
            <p className="font-display text-2xl font-semibold">{formatINR(experience.priceINR)}</p>
            <p className="text-xs text-brand-900/50 dark:text-stone-50/50">per person</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <BookingButton itemType="experience" itemId={experience._id} itemName={experience.title} amountINR={experience.priceINR} contactPhone={experience.contactPhone || experience.phone} paymentsConfigured={paymentsConfigured} />
            <Link to={`/planner?destinationId=${experience.destination?._id || experience.destination}&destinationName=${encodeURIComponent(experience.destinationName)}`} className="btn-primary">Add to a trip</Link>
          </div>
        </div>
        <ReviewsSection itemType="experience" itemId={experience._id} />
      </div>
    </div>
  );
}
