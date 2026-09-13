import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`relative flex h-9 w-16 items-center rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 transition-colors ${className}`}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-brand-800 shadow-md"
        style={{ left: isDark ? 'calc(100% - 1.75rem - 0.25rem)' : '0.25rem' }}
      >
        {isDark ? <Moon size={14} className="text-saffron-300" /> : <Sun size={14} className="text-saffron-500" />}
      </motion.span>
    </button>
  );
}
