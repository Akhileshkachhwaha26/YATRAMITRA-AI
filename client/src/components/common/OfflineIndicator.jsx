import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';

/**
 * A small, honest connectivity banner backed by the real navigator.onLine
 * API and the window online/offline events — not a simulated state. Pages
 * and data already visited in this session stay reachable while offline
 * because the service worker (see vite.config.js) has them cached; this
 * banner just makes that state visible instead of a page silently failing.
 */
export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-brand-900 px-4 py-2 text-center text-xs font-medium text-white"
          role="status"
        >
          <WifiOff size={13} /> You're offline — pages and data you've already viewed are still available.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
