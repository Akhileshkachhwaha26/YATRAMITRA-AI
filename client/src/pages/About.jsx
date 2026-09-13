import { motion } from 'framer-motion';
import { Compass, Target, Lightbulb, TrendingUp, Leaf, Users, MapPin } from 'lucide-react';

const IMPACTS = [
  { icon: MapPin, text: 'More tourism reaching lesser-known destinations, not just the same dozen hotspots' },
  { icon: Users, text: 'Greater visibility for local guides, homestays, artisans and small operators' },
  { icon: Leaf, text: 'Measurable sustainability scoring that nudges travelers toward responsible choices' },
  { icon: TrendingUp, text: 'Personalized planning that replaces generic checklists with a real itinerary' },
];

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="chip"><Compass size={13} /> Smart India Hackathon 2026 · PS 26204</span>
        <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
          Built for a fragmented tourism industry
        </h1>
        <p className="mt-4 max-w-2xl text-brand-900/70 dark:text-stone-50/70">
          YatraMitra AI is a student-built response to AICTE's problem statement on boosting India's tourism
          industry. Instead of another static booking site, it's an AI-powered ecosystem that plans trips,
          surfaces hidden destinations, and gives local tourism businesses a real online presence.
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <InfoCard
          icon={Target}
          title="The problem"
          text="Tourism services are scattered across apps and word-of-mouth. Planning is generic, popular spots are overcrowded, hidden gems stay hidden, and local businesses have almost no digital visibility."
        />
        <InfoCard
          icon={Lightbulb}
          title="The solution"
          text="One platform: an AI trip planner that understands budget, interests and travel style; a discovery engine that actively promotes hidden gems near overcrowded spots; and a marketplace for local guides, homestays and experience hosts."
        />
        <InfoCard
          icon={TrendingUp}
          title="The impact"
          text="Better tourism distribution across states, real income opportunities for local operators, and travelers who get a plan that actually fits them — not a one-size-fits-all itinerary."
        />
      </div>

      <div className="mt-16">
        <h2 className="font-display text-2xl font-semibold">What changes for travelers and local businesses</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {IMPACTS.map(({ icon: Icon, text }) => (
            <div key={text} className="card flex items-start gap-3 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-jade-500/10 text-jade-600 dark:text-jade-300">
                <Icon size={16} />
              </div>
              <p className="text-sm text-brand-900/80 dark:text-stone-50/80">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 card p-8">
        <h2 className="font-display text-xl font-semibold">How the AI actually works</h2>
        <p className="mt-3 text-sm text-brand-900/70 dark:text-stone-50/70">
          YatraMitra AI's recommendation and itinerary engine runs entirely on structured destination data —
          interests, budget tiers, seasonality, sustainability scores and crowd levels — so it works fully
          offline from any external AI provider. The architecture is intentionally provider-agnostic: a future
          integration with an LLM API (for richer natural-language itineraries or the chat assistant) can be
          added without changing how the rest of the app calls it, since both paths return the same
          trip-shaped response.
        </p>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45 }}
      className="card p-6"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron-500/15 text-saffron-600 dark:text-saffron-300">
        <Icon size={18} />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-brand-900/65 dark:text-stone-50/65">{text}</p>
    </motion.div>
  );
}
