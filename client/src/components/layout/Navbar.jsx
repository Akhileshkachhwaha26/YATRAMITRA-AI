import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Compass, LayoutDashboard, MapPin, Bookmark, User, LogOut } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import LanguageSelector from '../common/LanguageSelector';
import useAuthStore from '../../store/authStore';

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // The homepage opens on a full-bleed dark photo hero; every other page opens
  // on the normal (light or dark-theme) page background. So only on "/", before
  // the user scrolls past the hero, do nav links need to be forced light for
  // contrast — everywhere else the usual theme-aware color already reads fine.
  const overHero = location.pathname === '/' && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }) =>
    `relative px-1 py-2 text-sm font-medium transition-colors ${
      isActive
        ? overHero ? 'text-white' : 'text-saffron-600 dark:text-saffron-300'
        : overHero
          ? 'text-white/80 hover:text-white'
          : 'text-brand-800/80 dark:text-stone-50/80 hover:text-brand-900 dark:hover:text-white'
    }`;

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/explore', label: t('nav.explore') },
    { to: '/planner', label: t('nav.planner') },
    { to: '/experiences', label: t('nav.experiences') },
    { to: '/hotels', label: t('nav.hotels') },
    { to: '/about', label: t('nav.about') },
  ];

  async function handleLogout() {
    await logout();
    setProfileOpen(false);
    navigate('/');
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'glass shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className={`flex items-center gap-2 font-display text-lg font-semibold transition-colors ${
            overHero ? 'text-white' : 'text-brand-900 dark:text-white'
          }`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-saffron-400 dark:bg-saffron-500 dark:text-brand-900">
            <Compass size={18} />
          </span>
          YatraMitra <span className="text-saffron-500">AI</span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === '/'}>
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className={`absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full ${overHero ? 'bg-white' : 'bg-saffron-500'}`}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSelector />
          <ThemeToggle />
          {!token ? (
            <Link to="/login" className={`btn-primary ml-2 !py-2 ${overHero ? 'shadow-lg shadow-black/20' : ''}`}>
              {t('nav.login')}
            </Link>
          ) : (
            <div className="relative ml-2">
              <button
                type="button"
                onClick={() => setProfileOpen((o) => !o)}
                className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 transition-colors ${
                  overHero
                    ? 'border-white/30 text-white hover:bg-white/10'
                    : 'border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5'
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-saffron-500 text-sm font-semibold text-brand-900">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
                <span className="text-sm font-medium">{user?.name?.split(' ')[0]}</span>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="glass absolute right-0 mt-2 w-52 rounded-card p-1"
                    onMouseLeave={() => setProfileOpen(false)}
                  >
                    <ProfileLink to="/dashboard" icon={LayoutDashboard} label={t('nav.dashboard')} onClick={() => setProfileOpen(false)} />
                    <ProfileLink to="/my-trips" icon={MapPin} label={t('nav.myTrips')} onClick={() => setProfileOpen(false)} />
                    <ProfileLink to="/saved" icon={Bookmark} label={t('nav.saved')} onClick={() => setProfileOpen(false)} />
                    <ProfileLink to="/profile" icon={User} label={t('nav.profile')} onClick={() => setProfileOpen(false)} />
                    {(user?.role === 'admin') && (
                      <ProfileLink to="/admin" icon={LayoutDashboard} label="Admin" onClick={() => setProfileOpen(false)} />
                    )}
                    {(user?.role === 'provider') && (
                      <ProfileLink to="/provider" icon={LayoutDashboard} label="Provider" onClick={() => setProfileOpen(false)} />
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-control px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/10"
                    >
                      <LogOut size={15} /> {t('nav.logout')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <button
          type="button"
          className={`lg:hidden transition-colors ${overHero ? 'text-white' : 'text-brand-900 dark:text-white'}`}
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="glass overflow-hidden lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 pb-4">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-control px-3 py-2.5 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5"
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="my-2 flex items-center justify-between border-t border-black/10 pt-3 dark:border-white/10">
                <LanguageSelector />
                <ThemeToggle />
              </div>
              {!token ? (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary mt-2 w-full">
                  {t('nav.login')}
                </Link>
              ) : (
                <>
                  <NavLink to="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-control px-3 py-2.5 text-sm hover:bg-black/5 dark:hover:bg-white/5">
                    {t('nav.dashboard')}
                  </NavLink>
                  <NavLink to="/my-trips" onClick={() => setMobileOpen(false)} className="rounded-control px-3 py-2.5 text-sm hover:bg-black/5 dark:hover:bg-white/5">
                    {t('nav.myTrips')}
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="rounded-control px-3 py-2.5 text-left text-sm text-red-500 hover:bg-red-500/10"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function ProfileLink({ to, icon: Icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 rounded-control px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
    >
      <Icon size={15} /> {label}
    </Link>
  );
}
