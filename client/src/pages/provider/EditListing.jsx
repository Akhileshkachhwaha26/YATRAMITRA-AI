import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import api from '../../services/api';
import { BUSINESS_TYPES } from '../../utils/constants';
import { SkeletonLine } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [form, setForm] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoadError(false);
    setForm(null);
    try {
      // Fetch from /businesses/mine (not the public /businesses/:id) so
      // opening the edit form never inflates this listing's own public
      // view-analytics count — and it inherently guarantees you can only
      // edit listings you actually own.
      const [{ data: destData }, { data: mineData }] = await Promise.all([
        api.get('/destinations', { params: { limit: 50 } }),
        api.get('/businesses/mine'),
      ]);
      setDestinations(destData.data);
      const b = mineData.data.find((biz) => biz._id === id);
      if (!b) throw new Error('Listing not found in your account');
      setForm({
        name: b.name,
        type: b.type,
        destination: b.destination?._id || b.destination,
        description: b.description || '',
        phone: b.contact?.phone || '',
        email: b.contact?.email || '',
      });
    } catch {
      setLoadError(true);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.destination) {
      toast.error('Please choose a destination');
      return;
    }
    setSubmitting(true);
    try {
      await api.put(`/businesses/${id}`, {
        name: form.name,
        type: form.type,
        destination: form.destination,
        destinationName: destinations.find((d) => d._id === form.destination)?.name,
        description: form.description,
        contact: { phone: form.phone, email: form.email },
      });
      toast.success('Listing updated');
      navigate('/provider');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update listing');
    } finally {
      setSubmitting(false);
    }
  }

  if (loadError) return <ErrorState message="Couldn't load this listing." onRetry={load} />;
  if (!form) {
    return (
      <div className="max-w-2xl space-y-4">
        <SkeletonLine className="h-8 w-1/3" />
        <SkeletonLine className="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold">Edit listing</h1>
      <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">
        Changes are saved immediately — no re-approval needed unless flagged by an admin.
      </p>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-6">
        <div>
          <label className="mb-1.5 block text-sm text-brand-900/60 dark:text-stone-50/60">Business name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="input"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-brand-900/60 dark:text-stone-50/60">Type</label>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="input">
              {BUSINESS_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-brand-900/60 dark:text-stone-50/60">Destination</label>
            <select
              required
              value={form.destination}
              onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
              className="input"
            >
              <option value="">Select destination</option>
              {destinations.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-brand-900/60 dark:text-stone-50/60">Description</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="input resize-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-brand-900/60 dark:text-stone-50/60">Phone</label>
            <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-brand-900/60 dark:text-stone-50/60">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input" />
          </div>
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={submitting} className="btn-primary">
            <Save size={15} /> {submitting ? 'Saving...' : 'Save changes'}
          </button>
          <button type="button" onClick={() => navigate('/provider')} className="btn-ghost">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
