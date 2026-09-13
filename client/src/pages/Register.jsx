import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { INTERESTS } from '../utils/constants';
import { LANGUAGES } from '../i18n';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferredLanguage: 'en',
    interests: [],
  });

  function toggleInterest(interest) {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : [...f.interests, interest],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (res.success) {
      toast.success('Account created — welcome to YatraMitra AI!');
      navigate('/dashboard');
    } else {
      toast.error(res.message);
    }
  }

  return (
    <div className="text-white">
      <h1 className="text-center font-display text-xl font-semibold">{t('auth.register')}</h1>
      <p className="mt-1 text-center text-sm text-white/60">Start planning smarter, more personal trips.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm text-white/80">
            {t('auth.name')}
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input !border-white/15 !bg-white/5 !text-white"
            placeholder="Aisha Verma"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-white/80">
            {t('auth.email')}
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input !border-white/15 !bg-white/5 !text-white"
            placeholder="you@example.com"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm text-white/80">
              {t('auth.password')}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input !border-white/15 !bg-white/5 !pr-9 !text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm text-white/80">
              {t('auth.confirmPassword')}
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="input !border-white/15 !bg-white/5 !text-white"
            />
          </div>
        </div>

        <div>
          <label htmlFor="lang" className="mb-1.5 block text-sm text-white/80">
            Preferred language
          </label>
          <select
            id="lang"
            value={form.preferredLanguage}
            onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })}
            className="input !border-white/15 !bg-white/5 !text-white"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="text-brand-900">
                {l.native}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-1.5 text-sm text-white/80">Travel interests</p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => {
              const active = form.interests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    active
                      ? 'border-saffron-400 bg-saffron-500 text-brand-900'
                      : 'border-white/15 bg-white/5 text-white/70 hover:border-white/30'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          <UserPlus size={16} /> {loading ? t('common.loading') : t('auth.register')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/60">
        {t('auth.hasAccount')}{' '}
        <Link to="/login" className="font-medium text-saffron-300 hover:underline">
          {t('auth.login')}
        </Link>
      </p>
    </div>
  );
}
