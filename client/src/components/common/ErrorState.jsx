import { AlertTriangle, RotateCw } from 'lucide-react';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-red-500/20 bg-red-500/5 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <AlertTriangle size={26} />
      </div>
      <h3 className="font-display text-lg font-semibold">We hit a snag</h3>
      <p className="mt-2 max-w-sm text-sm text-brand-900/60 dark:text-stone-50/60">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary mt-6">
          <RotateCw size={16} /> Try again
        </button>
      )}
    </div>
  );
}
