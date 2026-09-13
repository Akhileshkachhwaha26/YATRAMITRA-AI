import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <motion.div
        animate={{ rotate: [0, 12, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-saffron-500/15 text-saffron-600 dark:text-saffron-300"
      >
        <Compass size={28} />
      </motion.div>
      <h1 className="mt-6 font-display text-3xl font-semibold">Off the map</h1>
      <p className="mt-2 text-brand-900/60 dark:text-stone-50/60">
        This page doesn't exist — even our AI planner can't route you there.
      </p>
      <Link to="/" className="btn-primary mt-6">
        <Home size={15} /> Back to home
      </Link>
    </div>
  );
}
