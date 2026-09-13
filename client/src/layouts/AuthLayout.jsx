import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Quote } from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';
import Scene from '../components/visuals/Scene';
import { HERO_BACKDROPS } from '../utils/imageData';

const TRAVEL_QUOTES = [
  { text: "The world is a book, and those who do not travel read only one page.", author: 'Saint Augustine' },
  { text: "Travel far enough, you meet yourself.", author: 'David Mitchell' },
  { text: "A journey is best measured in friends, not miles.", author: 'Tim Cahill' },
];

export default function AuthLayout() {
  const quote = TRAVEL_QUOTES[Math.floor(Math.random() * TRAVEL_QUOTES.length)];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0">
        <Scene scene="lakePalace" image={HERO_BACKDROPS[2]} className="h-full w-full" kenBurns>
          <div className="absolute inset-0 bg-gradient-to-br from-brand-950/85 via-brand-950/70 to-brand-950/90" />
        </Scene>
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-saffron-500/15 blur-3xl animate-aurora" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-jade-500/15 blur-3xl animate-aurora-reverse" />
      </div>

      <div className="absolute right-6 top-6 z-10">
        <ThemeToggle />
      </div>

      {/* Travel quote — hidden on small screens to keep the form front and center */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute bottom-10 left-10 z-10 hidden max-w-xs text-white/80 lg:block"
      >
        <Quote size={22} className="text-saffron-400" />
        <p className="mt-2 font-display text-lg leading-snug">{quote.text}</p>
        <p className="mt-2 text-sm text-white/50">— {quote.author}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md rounded-card border border-white/15 bg-white/10 p-8 text-white shadow-glass-dark backdrop-blur-glass"
      >
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 font-display text-xl font-semibold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-saffron-500 text-brand-900">
            <Compass size={18} />
          </span>
          YatraMitra <span className="text-saffron-400">AI</span>
        </Link>
        <Outlet />
      </motion.div>
    </div>
  );
}
