import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Save, Trophy, LockKeyhole } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { INTERESTS, BUDGET_TIERS, TRAVEL_STYLES } from '../utils/constants';
import { LANGUAGES } from '../i18n';
import api from '../services/api';
import { computeBadges } from '../utils/badges';

export default function Profile() {
  const { user, updateProfile } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    preferredLanguage: user?.preferredLanguage || 'en',
    travelStyle: user?.travelStyle || 'solo',
    budgetPreference: user?.budgetPreference || 'moderate',
    interests: user?.interests || [],
  });
  const [saving, setSaving] = useState(false);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/trips'), api.get('/saved'), api.get('/destinations', { params: { limit: 100 } })]).then(([t,s,d]) => setBadges(computeBadges({ trips:t.data.data || [], saved:s.data.data || [], destinations:d.data.data || [] }))).catch(() => {});
  }, []);

  function toggleInterest(interest) {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest) ? f.interests.filter((i) => i !== interest) : [...f.interests, interest],
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated');
    } catch {
      toast.error('Could not update profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-saffron-500 text-xl font-semibold text-brand-900">
          {user?.name?.[0]?.toUpperCase() || <User size={22} />}
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold">{user?.name}</h1>
          <p className="text-sm text-brand-900/60 dark:text-stone-50/60">{user?.email}</p>
        </div>
      </div>

      {badges.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2"><Trophy size={18} className="text-saffron-500"/><h2 className="font-display text-lg font-semibold">Your YatraMitra achievements</h2></div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {badges.map(b => <div key={b.id} className={`card p-4 ${b.earned ? '' : 'opacity-50'}`}><div className="flex items-start gap-3"><span className="mt-0.5">{b.earned ? <Trophy size={17} className="text-saffron-500"/> : <LockKeyhole size={17}/>}</span><div><p className="font-medium">{b.label}</p><p className="mt-1 text-xs opacity-60">{b.description}</p></div></div></div>)}
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="card space-y-6 p-6">
        <div>
          <label className="mb-1.5 block text-sm text-brand-900/60 dark:text-stone-50/60">Full name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="input"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-brand-900/60 dark:text-stone-50/60">Preferred language</label>
            <select
              value={form.preferredLanguage}
              onChange={(e) => setForm((f) => ({ ...f, preferredLanguage: e.target.value }))}
              className="input"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.native}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-brand-900/60 dark:text-stone-50/60">Travel style</label>
            <select
              value={form.travelStyle}
              onChange={(e) => setForm((f) => ({ ...f, travelStyle: e.target.value }))}
              className="input"
            >
              {TRAVEL_STYLES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-brand-900/60 dark:text-stone-50/60">Budget preference</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {BUDGET_TIERS.map((tier) => (
              <button
                key={tier.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, budgetPreference: tier.value }))}
                className={`rounded-control border p-3 text-sm font-medium transition-colors ${
                  form.budgetPreference === tier.value
                    ? 'border-saffron-400 bg-saffron-50 dark:bg-saffron-500/10'
                    : 'border-black/10 hover:border-black/20 dark:border-white/10'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-brand-900/60 dark:text-stone-50/60">Travel interests</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => {
              const active = form.interests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`chip transition-colors ${active ? '!border-saffron-400 !bg-saffron-500 !text-brand-900' : ''}`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          <Save size={15} /> {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </motion.div>
  );
}
