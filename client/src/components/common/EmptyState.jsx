import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center rounded-card border border-dashed border-black/10 dark:border-white/15 px-6 py-16 text-center"
    >
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-saffron-100 dark:bg-saffron-500/10 text-saffron-600 dark:text-saffron-300">
          <Icon size={26} />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-brand-900/60 dark:text-stone-50/60">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
