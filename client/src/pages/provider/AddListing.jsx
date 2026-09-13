import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';
import api from '../../services/api';
import { BUSINESS_TYPES } from '../../utils/constants';

export default function AddListing() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [form, setForm] = useState({
    name: '',
    type: 'guide',
    destination: '',
    description: '',
    phone: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/destinations', { params: { limit: 50 } }).then(({ data }) => setDestinations(data.data)).catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.destination) {
      toast.error('Please choose a destination');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/businesses', {
        name: form.name,
        type: form.type,
        destination: form.destination,
        destinationName: destinations.find((d) => d._id === form.destination)?.name,
        description: form.description,
        contact: { phone: form.phone, email: form.email },
      });
      toast.success('Listing submitted for review');
      navigate('/provider');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create listing');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold">Add a listing</h1>
      <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">
        New listings are reviewed before appearing publicly on the Businesses page.
      </p>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-6">
        <div>
          <label className="mb-1.5 block text-sm text-brand-900/60 dark:text-stone-50/60">Business name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="input"
            placeholder="e.g. Narmada Valley Guides"
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
            placeholder="What do you offer travelers?"
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

        <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
          <PlusCircle size={15} /> {submitting ? 'Submitting...' : 'Submit listing'}
        </button>
      </form>
    </div>
  );
}
