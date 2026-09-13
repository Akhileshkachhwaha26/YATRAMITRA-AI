import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, Pencil, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import EmptyState from './common/EmptyState';
import { SkeletonLine } from './common/Skeleton';

function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
          className="p-0.5"
        >
          <Star
            size={22}
            className={
              (hover || value) >= n
                ? 'fill-saffron-400 text-saffron-400'
                : 'fill-transparent text-brand-900/25 dark:text-stone-50/25'
            }
          />
        </button>
      ))}
    </div>
  );
}

/**
 * Drop this into any destination/hotel/experience/business detail page.
 * Writes real reviews via POST /api/reviews, which live-recalculates the
 * parent item's rating/reviewCount on the server — so this is the thing
 * that makes ratings genuinely user-generated rather than fixed seed data.
 */
export default function ReviewsSection({ itemType, itemId }) {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState(null);
  const [summary, setSummary] = useState({ averageRating: null, totalReviews: 0 });
  const [error, setError] = useState(false);
  const [form, setForm] = useState({ rating: 0, comment: '' });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setError(false);
    try {
      const { data } = await api.get('/reviews', { params: { itemType, itemId } });
      setReviews(data.data);
      setSummary({ averageRating: data.averageRating, totalReviews: data.totalReviews });
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemType, itemId]);

  const myReview = reviews?.find((r) => r.user === user?._id);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.rating) {
      toast.error('Please select a star rating');
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/reviews/${editingId}`, form);
        toast.success('Review updated');
      } else {
        await api.post('/reviews', { itemType, itemId, ...form });
        toast.success('Review posted');
      }
      setForm({ rating: 0, comment: '' });
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save review');
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(review) {
    setEditingId(review._id);
    setForm({ rating: review.rating, comment: review.comment });
    window.scrollTo({ top: document.getElementById('reviews-form')?.offsetTop - 100, behavior: 'smooth' });
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      load();
    } catch {
      toast.error('Could not delete review');
    }
  }

  return (
    <div className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">
          Reviews
          {summary.totalReviews > 0 && (
            <span className="ml-2 text-sm font-normal text-brand-900/50 dark:text-stone-50/50">
              {summary.averageRating} ★ · {summary.totalReviews} review{summary.totalReviews !== 1 ? 's' : ''}
            </span>
          )}
        </h2>
      </div>

      {isAuthenticated() && !myReview && !editingId && (
        <form id="reviews-form" onSubmit={handleSubmit} className="card mb-6 space-y-3 p-5">
          <p className="text-sm font-medium">Write a review</p>
          <StarInput value={form.rating} onChange={(rating) => setForm((f) => ({ ...f, rating }))} />
          <textarea
            value={form.comment}
            onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
            placeholder="Share your experience..."
            rows={3}
            required
            className="input resize-none"
          />
          <button type="submit" disabled={submitting} className="btn-primary !py-2 text-sm">
            {submitting ? 'Posting...' : 'Post review'}
          </button>
        </form>
      )}

      {isAuthenticated() && editingId && (
        <form id="reviews-form" onSubmit={handleSubmit} className="card mb-6 space-y-3 border-saffron-400 p-5">
          <p className="text-sm font-medium">Edit your review</p>
          <StarInput value={form.rating} onChange={(rating) => setForm((f) => ({ ...f, rating }))} />
          <textarea
            value={form.comment}
            onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
            rows={3}
            required
            className="input resize-none"
          />
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="btn-primary !py-2 text-sm">
              {submitting ? 'Saving...' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ rating: 0, comment: '' });
              }}
              className="btn-ghost !py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!isAuthenticated() && (
        <div className="card mb-6 flex items-center justify-between p-4 text-sm">
          <span className="text-brand-900/60 dark:text-stone-50/60">Have you been here? Share your experience.</span>
          <Link to="/login" className="font-medium text-saffron-600 hover:underline dark:text-saffron-300">
            Log in to review
          </Link>
        </div>
      )}

      {error && <p className="text-sm text-red-500">Couldn't load reviews.</p>}
      {!error && !reviews && (
        <div className="space-y-3">
          <SkeletonLine className="h-16" />
          <SkeletonLine className="h-16" />
        </div>
      )}
      {!error && reviews && reviews.length === 0 && (
        <EmptyState icon={MessageSquare} title="No reviews yet" description="Be the first to share your experience." />
      )}

      <div className="space-y-3">
        <AnimatePresence>
          {reviews?.map((r) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="card p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{r.userName}</p>
                  <div className="mt-0.5 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={13}
                        className={n <= r.rating ? 'fill-saffron-400 text-saffron-400' : 'fill-transparent text-brand-900/20 dark:text-stone-50/20'}
                      />
                    ))}
                    <span className="ml-1 text-xs text-brand-900/40 dark:text-stone-50/40">
                      {new Date(r.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
                {r.user === user?._id && (
                  <div className="flex gap-1">
                    <button type="button" onClick={() => startEdit(r)} aria-label="Edit review" className="rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/10">
                      <Pencil size={13} />
                    </button>
                    <button type="button" onClick={() => handleDelete(r._id)} aria-label="Delete review" className="rounded-full p-1.5 text-red-500 hover:bg-red-500/10">
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm text-brand-900/75 dark:text-stone-50/75">{r.comment}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
