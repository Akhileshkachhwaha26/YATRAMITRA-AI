import { Link } from 'react-router-dom';
import { Compass, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-800 text-saffron-400 dark:bg-saffron-500 dark:text-brand-900">
                <Compass size={16} />
              </span>
              YatraMitra <span className="text-saffron-500">AI</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-brand-900/60 dark:text-stone-50/60">
              Discover better. Travel smarter. Support local. An AI-powered tourism ecosystem built for India's
              hidden destinations and local communities.
            </p>
          </div>
          <FooterColumn
            title="Explore"
            links={[
              { to: '/explore', label: 'Destinations' },
              { to: '/hotels', label: 'Hotels' },
              { to: '/experiences', label: 'Experiences' },
              { to: '/sustainability', label: 'Sustainable Tourism' },
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              { to: '/about', label: 'About' },
              { to: '/businesses', label: 'Local Businesses' },
              { to: '/safety', label: 'Travel Safety' },
              { to: '/contact', label: 'Contact' },
            ]}
          />
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-black/10 pt-6 text-sm text-brand-900/50 dark:border-white/10 dark:text-stone-50/50 sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} YatraMitra AI. Built for Smart India Hackathon 2026.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Mail size={14} /> hello@yatramitra.ai
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} /> Bhopal, Madhya Pradesh
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-brand-900 dark:text-white">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="text-sm text-brand-900/60 hover:text-saffron-600 dark:text-stone-50/60 dark:hover:text-saffron-300">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
