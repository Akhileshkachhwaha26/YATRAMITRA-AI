import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (res.success) {
      toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`);
      navigate(location.state?.from || '/dashboard');
    } else {
      toast.error(res.message);
    }
  }

  return (
    <div className="text-white">
      <h1 className="text-center font-display text-xl font-semibold">{t('auth.login')}</h1>
      <p className="mt-1 text-center text-sm text-white/60">Sign in to plan your next journey.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm text-white/80">
            {t('auth.password')}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input !border-white/15 !bg-white/5 !pr-10 !text-white"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-white/70">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-white/30 bg-transparent accent-saffron-500"
            />
            {t('auth.rememberMe')}
          </label>
          <Link to="/forgot-password" className="text-saffron-300 hover:underline">
            {t('auth.forgotPassword')}
          </Link>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          <LogIn size={16} /> {loading ? t('common.loading') : t('auth.login')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/60">
        {t('auth.noAccount')}{' '}
        <Link to="/register" className="font-medium text-saffron-300 hover:underline">
          {t('auth.register')}
        </Link>
      </p>

      <div className="mt-6 space-y-1 rounded-control border border-white/10 bg-white/5 p-3 text-xs text-white/50">
        <p className="text-white/70">Demo accounts</p>
        <p>Traveler — traveler@yatramitra.ai / Traveler@123</p>
        <p>Provider — provider@yatramitra.ai / Provider@123</p>
        <p>Admin — admin@yatramitra.ai / Admin@123</p>
      </div>
    </div>
  );
}
