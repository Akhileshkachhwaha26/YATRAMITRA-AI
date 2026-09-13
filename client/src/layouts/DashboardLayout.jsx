import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, MapPin, Bookmark, User } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import AIChatWidget from '../components/ai/AIChatWidget';

const links = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/my-trips', label: 'My Trips', icon: MapPin },
  { to: '/saved', label: 'Saved', icon: Bookmark },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="card sticky top-24 space-y-1 p-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-control px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-saffron-500 text-brand-900'
                      : 'text-brand-800/80 hover:bg-black/5 dark:text-stone-50/80 dark:hover:bg-white/5'
                  }`
                }
              >
                <Icon size={16} /> {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <AIChatWidget />
    </div>
  );
}
