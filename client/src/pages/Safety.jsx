import { useState } from 'react';
import { Phone, ShieldCheck, ListChecks, Info } from 'lucide-react';
import { EMERGENCY_NUMBERS } from '../utils/constants';

const SAFETY_TIPS = [
  'Share your itinerary with a friend or family member before you travel.',
  'Keep digital and physical copies of your ID, tickets and hotel bookings.',
  'Use registered taxis or ride-hailing apps rather than unmarked vehicles, especially at night.',
  'Check current weather and road advisories before travel to hill or forest regions.',
  'Respect photography restrictions at religious sites, military zones and wildlife reserves.',
  'Carry a basic first-aid kit and any personal medication with a copy of the prescription.',
];

const CHECKLIST = [
  'Valid government ID / passport',
  'Travel insurance details',
  'Emergency contacts saved offline',
  'Copies of hotel and transport bookings',
  'Local emergency numbers noted',
  'Basic first-aid kit',
  'Power bank and offline maps downloaded',
];

export default function Safety() {
  const [checked, setChecked] = useState({});

  function toggle(item) {
    setChecked((c) => ({ ...c, [item]: !c[item] }));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="chip"><ShieldCheck size={13} /> Travel safety</span>
      <h1 className="mt-3 font-display text-3xl font-semibold">Stay informed, travel confidently</h1>
      <p className="mt-2 max-w-2xl text-sm text-brand-900/60 dark:text-stone-50/60">
        General safety information for travel in India. This is not a substitute for local advisories or official
        emergency services.
      </p>

      <div className="mt-8 rounded-card border border-saffron-500/20 bg-saffron-50 p-4 text-sm text-brand-900/70 dark:bg-saffron-500/10 dark:text-stone-50/70">
        <p className="flex items-center gap-2 font-medium text-saffron-700 dark:text-saffron-300">
          <Info size={16} /> This app does not connect to live emergency dispatch
        </p>
        <p className="mt-1">In a real emergency, always call the numbers below directly rather than relying on any app.</p>
      </div>

      <h2 className="mt-10 flex items-center gap-2 font-display text-xl font-semibold">
        <Phone size={18} /> Emergency numbers
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {EMERGENCY_NUMBERS.map((n) => (
          <div key={n.value} className="card flex items-center justify-between p-4">
            <span className="text-sm">{n.label}</span>
            <span className="font-display text-lg font-semibold text-saffron-600 dark:text-saffron-300">{n.value}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold">Safety tips</h2>
      <ul className="mt-4 space-y-3">
        {SAFETY_TIPS.map((tip) => (
          <li key={tip} className="card flex gap-3 p-4 text-sm text-brand-900/80 dark:text-stone-50/80">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-jade-500" /> {tip}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 flex items-center gap-2 font-display text-xl font-semibold">
        <ListChecks size={18} /> Travel checklist
      </h2>
      <div className="card mt-4 divide-y divide-black/5 dark:divide-white/10">
        {CHECKLIST.map((item) => (
          <label key={item} className="flex cursor-pointer items-center gap-3 p-4 text-sm">
            <input
              type="checkbox"
              checked={!!checked[item]}
              onChange={() => toggle(item)}
              className="h-4 w-4 rounded accent-saffron-500"
            />
            <span className={checked[item] ? 'line-through text-brand-900/40 dark:text-stone-50/40' : ''}>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
