import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, animate, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Search, Sparkles, Leaf, Users, ArrowRight, ChevronDown, ChevronLeft, ChevronRight,
  Quote, ShieldCheck, Wallet, MapPinned, Compass, BadgeCheck, Languages,
  BedDouble, UserCheck, PhoneCall, Store, MessageSquareWarning, ShieldAlert,
  WifiOff, Accessibility, Mic, Clock, UtensilsCrossed,
} from 'lucide-react';import DestinationCard from '../components/cards/DestinationCard';
import ExperienceCard from '../components/cards/ExperienceCard';
import Scene from '../components/visuals/Scene';
import { SkeletonGrid } from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';
import api from '../services/api';
import { HERO_BACKDROPS } from '../utils/imageData';

const SEARCH_SUGGESTIONS = ['Jabalpur', 'Bhedaghat', 'Pachmarhi', 'Khajuraho', 'Goa', 'Kerala', 'Rajasthan'];

const TRUST_STRIP = [
  { icon: BadgeCheck, label: 'Verified Destinations' },
  { icon: Sparkles, label: 'AI-Powered Planning' },
  { icon: Users, label: 'Local Experiences' },
  { icon: ShieldCheck, label: 'Travel Safety' },
  { icon: Languages, label: 'Multilingual Support' },
];

const MOODS = [
  { emoji: '🌿', label: 'Escape into Nature', tag: 'nature' },
  { emoji: '🏔️', label: 'Adventure', tag: 'adventure' },
  { emoji: '🏛️', label: 'History & Culture', tag: 'heritage' },
  { emoji: '🍜', label: 'Food Explorer', tag: 'food' },
  { emoji: '🧘', label: 'Peace & Spirituality', tag: 'spiritual' },
  { emoji: '🏖️', label: 'Relax & Unwind', tag: 'beach' },
  { emoji: '📸', label: 'Photography', tag: 'photography' },
  { emoji: '🎉', label: 'Fun & Nightlife', tag: 'nightlife' },
];

const TESTIMONIALS = [
  {
    name: 'Aisha, Bengaluru',
    trip: 'Planned a 4-day Pachmarhi trip',
    quote:
      "I typed my budget and how many days off I had, and got a real plan — not a blog post. Found a waterfall I'd never even heard of.",
  },
  {
    name: 'Rohan, Delhi',
    trip: 'Booked a homestay via a local guide listing',
    quote:
      'The local guide we booked through YatraMitra knew Orchha better than any guidebook. That entire day was the highlight of the trip.',
  },
  {
    name: 'Meera, Pune',
    trip: 'Used the hidden-gem suggestion near Khajuraho',
    quote:
      "We were set on Khajuraho, but the app nudged us toward Orchha for a day too — quieter, cheaper, and honestly just as stunning.",
  },
];

const CONFIDENCE_CARDS = [
  {
    icon: BedDouble,
    title: 'Verified stays & homestays',
    text: 'Every hotel and homestay listing is checked by our team before it goes live — not open, unmoderated submissions.',
    to: '/hotels',
    cta: 'Browse stays',
  },
  {
    icon: UserCheck,
    title: 'Trusted local guides',
    text: "Guides are listed with real experience and specialties, so you know who you're booking before you arrive.",
    to: '/guides',
    cta: 'Meet guides',
  },
  {
    icon: PhoneCall,
    title: 'Safety info & emergency numbers',
    text: "State-wise emergency numbers and a pre-trip safety checklist — this app doesn't connect to live dispatch, so always call directly in a real emergency.",
    to: '/safety',
    cta: 'View safety info',
  },
  {
    icon: Accessibility,
    title: 'Accessibility-friendly filtering',
    text: 'Filter destinations by general terrain guidance — wheelchair-friendly stops, step-free walkways and more. Editorial guidance, not a certified audit.',
    to: '/explore?wheelchairFriendly=true',
    cta: 'Filter destinations',
  },
  {
    icon: WifiOff,
    title: 'Works offline, once visited',
    text: "Install YatraMitra as an app and pages you've already opened — plans, destinations, photos — stay available without signal.",
    to: null,
    cta: null,
  },
  {
    icon: Languages,
    title: 'Multilingual by design',
    text: 'The whole platform is available in English, Hindi, Marathi, Bengali, Tamil and Telugu — not just a translated homepage.',
    to: null,
    cta: null,
  },
];

const ROADMAP_ITEMS = [
  { icon: MessageSquareWarning, label: 'Fake review detection' },
  { icon: ShieldAlert, label: 'Tourism scam alerts' },
  { icon: Mic, label: 'Voice assistant' },
];

const JOURNEY_STAGES = [
  { id: 'discover', label: 'Discover' },
  { id: 'plan', label: 'Plan' },
  { id: 'book', label: 'Book' },
  { id: 'experience', label: 'Experience' },
  { id: 'safely', label: 'Travel Safely' },
  { id: 'support-local', label: 'Support Local' },
  { id: 'memories', label: 'Save Memories' },
];

const SAMPLE_ITINERARY = {
  destination: 'Pachmarhi, Madhya Pradesh',
  travelers: '2 travelers · 3 days',
  estCost: '₹8,400',
  days: [
    {
      label: 'Day 1',
      stay: 'Check in — Hillside homestay, Pachmarhi',
      activities: 'Bee Falls + evening market walk',
      food: 'Local thali at a family-run dhaba',
    },
    {
      label: 'Day 2',
      stay: 'Same homestay',
      activities: 'Pandav Caves, then Dhoopgarh sunset point with a local guide',
      food: 'Packed lunch + Dhoopgarh chai stall',
    },
    {
      label: 'Day 3',
      stay: 'Check out by 11 AM',
      activities: 'Rajendragiri viewpoint, then departure',
      food: 'Breakfast at the homestay',
    },
  ],
  safetyTip: 'Evenings above 1,000m get cool fast — carry a light jacket even in summer.',
};

function AnimatedNumber({ value, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-4xl font-semibold sm:text-5xl">
      {display.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

function useCarouselScroll() {
  const trackRef = useRef(null);
  function scrollBy(dir) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: 'smooth' });
  }
  return { trackRef, scrollBy };
}

/** Cinematic, slowly-zooming hero backdrop that crossfades through real,
 * hand-picked photos of India's tourism landmarks (see HERO_BACKDROPS in
 * utils/imageData.js). Each slide is tracked independently — if one
 * photo fails to load (offline, dead link), only that slide falls back
 * to the illustrated Scene art; the rotation keeps going through the
 * rest instead of getting stuck. The hero never shows a broken image
 * or an empty/mismatched frame. */
function HeroBackdrop() {
  const [index, setIndex] = useState(0);
  const [failedSlides, setFailedSlides] = useState(() => new Set());
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % HERO_BACKDROPS.length), 6000);
    return () => clearInterval(timer);
  }, [reducedMotion]);

  const current = HERO_BACKDROPS[index];
  const slideFailed = failedSlides.has(index);

  return (
    <div className="absolute inset-0 overflow-hidden bg-brand-950">
      {slideFailed ? (
        <Scene scene="hillstation" className="h-full w-full" kenBurns={!reducedMotion} />
      ) : (
        <AnimatePresence>
          <motion.img
            key={index}
            src={current.src}
            alt={current.label}
            onError={() => setFailedSlides((prev) => new Set(prev).add(index))}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: reducedMotion ? 1 : 1.12 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.4 }, scale: { duration: 7, ease: 'easeOut' } }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      )}
    </div>
  );
}

/** Slim scroll-spy rail (desktop only) that tracks which stage of the
 * Discover → Plan → Book → Experience → Travel Safely → Support Local →
 * Save Memories journey the visitor is currently scrolled past, and lets
 * them jump straight to any stage. Purely a wayfinding aid — it never
 * blocks scrolling and adds no extra network requests. */
function JourneyRail() {
  const [active, setActive] = useState('discover');
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    function onScroll() {
      const anchor = window.innerHeight * 0.4;
      let current = JOURNEY_STAGES[0].id;
      for (const stage of JOURNEY_STAGES) {
        const el = document.getElementById(stage.id);
        if (el && el.getBoundingClientRect().top <= anchor) current = stage.id;
      }
      setActive(current);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function goTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  return (
    <div className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 xl:flex">
      {JOURNEY_STAGES.map((stage) => {
        const isActive = active === stage.id;
        return (
          <button key={stage.id} type="button" onClick={() => goTo(stage.id)} className="group flex items-center gap-2" aria-label={`Jump to ${stage.label}`}>
            <span
              className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 ${
                isActive ? 'bg-brand-900 text-white dark:bg-white dark:text-brand-900' : 'bg-white text-brand-900 dark:bg-brand-800 dark:text-white'
              }`}
            >
              {stage.label}
            </span>
            <span
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                isActive ? 'scale-125 bg-saffron-500 ring-4 ring-saffron-500/25' : 'bg-brand-900/25 dark:bg-white/30'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

/** Interactive sample itinerary preview for the AI Planner feature section —
 * a concrete stand-in (not the live planner) showing the shape of what the
 * real AI Planner (see /planner) generates: day-by-day stay, activities,
 * food and a safety tip. */
function ItineraryPreview() {
  const [activeDay, setActiveDay] = useState(0);
  const day = SAMPLE_ITINERARY.days[activeDay];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="card overflow-hidden p-0"
    >
      <div className="flex items-center justify-between border-b border-black/5 px-5 py-3 dark:border-white/10">
        <div>
          <p className="text-sm font-semibold">{SAMPLE_ITINERARY.destination}</p>
          <p className="text-xs text-brand-900/55 dark:text-stone-50/55">{SAMPLE_ITINERARY.travelers}</p>
        </div>
        <span className="chip !border-jade-500/30 !text-jade-700 dark:!text-jade-300">Sample plan</span>
      </div>

      <div className="flex gap-1.5 px-5 pt-4">
        {SAMPLE_ITINERARY.days.map((d, i) => (
          <button
            key={d.label}
            type="button"
            onClick={() => setActiveDay(i)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              activeDay === i
                ? 'bg-brand-800 text-saffron-300 dark:bg-saffron-500 dark:text-brand-900'
                : 'bg-black/5 text-brand-900/60 hover:bg-black/10 dark:bg-white/10 dark:text-stone-50/60 dark:hover:bg-white/15'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeDay}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-3 px-5 py-4"
        >
          <div className="flex items-start gap-2.5 text-sm">
            <BedDouble size={16} className="mt-0.5 shrink-0 text-saffron-500" />
            <span className="text-brand-900/75 dark:text-stone-50/75">{day.stay}</span>
          </div>
          <div className="flex items-start gap-2.5 text-sm">
            <MapPinned size={16} className="mt-0.5 shrink-0 text-saffron-500" />
            <span className="text-brand-900/75 dark:text-stone-50/75">{day.activities}</span>
          </div>
          <div className="flex items-start gap-2.5 text-sm">
            <UtensilsCrossed size={16} className="mt-0.5 shrink-0 text-saffron-500" />
            <span className="text-brand-900/75 dark:text-stone-50/75">{day.food}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between border-t border-black/5 px-5 py-3 dark:border-white/10">
        <span className="text-xs text-brand-900/55 dark:text-stone-50/55">Estimated total cost</span>
        <span className="font-display text-base font-semibold text-jade-600 dark:text-jade-300">{SAMPLE_ITINERARY.estCost}</span>
      </div>
      <div className="flex items-start gap-2 bg-saffron-50 px-5 py-3 text-xs text-brand-900/70 dark:bg-saffron-500/10 dark:text-stone-50/70">
        <ShieldCheck size={14} className="mt-0.5 shrink-0 text-saffron-600 dark:text-saffron-300" />
        {SAMPLE_ITINERARY.safetyTip}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [trending, setTrending] = useState(null);
  const [hiddenGems, setHiddenGems] = useState(null);
  const [localExperiences, setLocalExperiences] = useState(null);
  const [error, setError] = useState(false);
  const { trackRef, scrollBy } = useCarouselScroll();

  async function load() {
    setError(false);
    setTrending(null);
    setHiddenGems(null);
    setLocalExperiences(null);
    try {
      const [tRes, hRes, eRes] = await Promise.all([
        api.get('/destinations', { params: { trending: true, limit: 8 } }),
        api.get('/destinations', { params: { hiddenGems: true, limit: 3 } }),
        api.get('/experiences', { params: { limit: 4 } }),
      ]);
      setTrending(tRes.data.data);
      setHiddenGems(hRes.data.data);
      setLocalExperiences(eRes.data.data);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="overflow-x-clip">
      <JourneyRail />
      {/* ============ CINEMATIC HERO ============ */}
      <section id="discover" className="relative flex min-h-[92vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <HeroBackdrop />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-brand-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/15 to-transparent" />
        </div>

        {/* hero image position indicator dots */}
        <div className="absolute bottom-24 right-6 hidden flex-col gap-1.5 sm:flex lg:right-10">
          {HERO_BACKDROPS.map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/40" />
          ))}
        </div>

        {/* floating glass accent shapes for depth */}
        <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-saffron-500/20 blur-3xl animate-aurora" />
        <div className="pointer-events-none absolute -left-16 bottom-24 h-64 w-64 rounded-full bg-jade-500/20 blur-3xl animate-aurora-reverse" />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl text-white"
          >
            <span className="chip !border-white/25 !bg-white/10 !text-saffron-300 backdrop-blur-sm">
              <Sparkles size={13} /> {t('home.heroEyebrow')}
            </span>
            <h1 className="mt-5 whitespace-pre-line font-display text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
              {t('home.heroTitle')}
            </h1>
            <p className="mt-5 max-w-lg text-base text-white/75 sm:text-lg">{t('home.heroSubtitle')}</p>

            {/* Animated search with suggestions */}
            <div className="relative mt-8 max-w-lg">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  navigate(`/explore?search=${encodeURIComponent(search)}`);
                }}
                className="flex items-center gap-2 rounded-full bg-white/95 p-1.5 pl-4 shadow-xl dark:bg-white/10"
              >
                <Search size={18} className="text-brand-900/50 dark:text-white/50" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                  placeholder="Where do you want to explore?"
                  className="flex-1 bg-transparent py-2.5 text-sm text-brand-900 placeholder:text-brand-900/40 focus:outline-none dark:text-white dark:placeholder:text-white/40"
                />
                <button type="submit" className="btn-primary !py-2.5">
                  {t('common.search')}
                </button>
              </form>
              <AnimatePresence>
                {searchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="glass absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl p-2"
                  >
                    <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-white/50">
                      Popular searches
                    </p>
                    {SEARCH_SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onMouseDown={() => navigate(`/explore?search=${encodeURIComponent(s)}`)}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/85 transition-colors hover:bg-white/10"
                      >
                        <Search size={13} className="text-white/40" /> {s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/planner"
                className="btn-primary !px-7 !py-3.5 !text-base shadow-lg shadow-saffron-500/30 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
              >
                {t('home.ctaPlan')} <ArrowRight size={16} />
              </Link>
              <Link
                to="/explore"
                className="btn-ghost !text-white transition-transform duration-200 hover:scale-[1.03] hover:!bg-white/10 active:scale-[0.97]"
              >
                {t('home.ctaExplore')}
              </Link>
            </motion.div>

            {/* Trust / value strip */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/15 pt-5"
            >
              {TRUST_STRIP.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-xs text-white/65 sm:text-sm">
                  <Icon size={14} className="text-saffron-300" /> {label}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/60 sm:block"
        >
          <ChevronDown size={22} />
        </motion.div>
      </section>

      {/* ============ STATS ============ */}
      <div className="relative border-t border-black/5 bg-white dark:border-white/10 dark:bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="text-center">
            <AnimatedNumber value={10000} suffix="+" />
            <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">{t('home.statsDestinations')}</p>
          </div>
          <div className="text-center">
            <AnimatedNumber value={25000} suffix="+" />
            <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">{t('home.statsExperiences')}</p>
          </div>
          <div className="text-center">
            <AnimatedNumber value={50000} suffix="+" />
            <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">{t('home.statsTravelers')}</p>
          </div>
          <div className="text-center">
            <span className="font-display text-4xl font-semibold sm:text-5xl">AI</span>
            <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">{t('home.statsAI')}</p>
          </div>
        </div>
      </div>

      {/* ============ TRAVEL MOOD PICKER ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span className="chip mx-auto w-fit">
            <Compass size={13} /> Start with a feeling, not a form
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">What's your travel mood?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-brand-900/60 dark:text-stone-50/60">
            Pick a mood and we'll surface destinations that actually match it — no generic top-10 lists.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MOODS.map((m, i) => (
            <motion.button
              key={m.tag}
              type="button"
              onClick={() => navigate(`/explore?tag=${m.tag}`)}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="card flex flex-col items-center gap-2 px-3 py-6 text-center transition-shadow hover:shadow-lg"
            >
              <span className="text-3xl">{m.emoji}</span>
              <span className="text-sm font-medium">{m.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ============ TRENDING CAROUSEL ============ */}
      <section className="py-16">
        <div className="mx-auto flex max-w-7xl items-end justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">{t('home.sectionTrending')}</h2>
            <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">Where everyone's headed right now.</p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button type="button" onClick={() => scrollBy(-1)} className="btn-ghost !p-2.5" aria-label="Scroll left">
              <ChevronLeft size={18} />
            </button>
            <button type="button" onClick={() => scrollBy(1)} className="btn-ghost !p-2.5" aria-label="Scroll right">
              <ChevronRight size={18} />
            </button>
            <Link to="/explore" className="ml-2 text-sm font-medium text-saffron-600 hover:underline dark:text-saffron-300">
              {t('common.viewAll')}
            </Link>
          </div>
        </div>

        <div className="mt-6 px-4 sm:px-6 lg:px-8">
          {error && <ErrorState message="Couldn't load destinations. Is the backend server running?" onRetry={load} />}
          {!error && !trending && <SkeletonGrid count={3} className="mx-auto max-w-7xl lg:grid-cols-3" />}
          {!error && trending && (
            <div ref={trackRef} className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4">
              {trending.map((d, i) => (
                <div key={d._id} className="w-[80%] shrink-0 snap-start sm:w-[45%] lg:w-[30%]">
                  <DestinationCard destination={d} index={i} size="lg" />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-2 px-4 text-center sm:hidden">
          <Link to="/explore" className="text-sm font-medium text-saffron-600 hover:underline dark:text-saffron-300">
            {t('common.viewAll')}
          </Link>
        </div>
      </section>

      {/* ============ AI PLANNER FEATURE ============ */}
      <section id="plan" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="card relative overflow-hidden p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-saffron-500/10 blur-3xl" />
          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="chip">
                <Sparkles size={13} /> The core feature
              </span>
              <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
                Planning that understands you, not just your destination
              </h2>
              <p className="mt-3 text-brand-900/65 dark:text-stone-50/65">
                Tell us your budget, dates, interests and who's coming. YatraMitra AI builds a real day-by-day
                itinerary with costs, timings and local recommendations in seconds — not a copy-pasted blog post.
              </p>
              <Link to="/planner" className="btn-primary mt-6 w-fit">
                Plan my trip <ArrowRight size={16} />
              </Link>
              <div className="mt-8 grid grid-cols-1 gap-4">
                <PlannerStep icon={Search} step="01" title="Tell us your style" text="Budget, dates, interests, who's traveling." />
                <PlannerStep icon={Sparkles} step="02" title="AI builds your itinerary" text="A full day-by-day plan, generated in seconds." />
                <PlannerStep icon={Users} step="03" title="Support local along the way" text="Guides, homestays and experiences, not just chains." />
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-brand-900/45 dark:text-stone-50/45">
                What the planner actually gives you
              </p>
              <ItineraryPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ============ HIDDEN GEMS ============ */}
      <section id="book" className="bg-jade-50/50 py-16 dark:bg-jade-500/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-2">
            <span className="chip w-fit !border-jade-500/30 !text-jade-700 dark:!text-jade-300">
              <Leaf size={13} /> {t('home.hiddenGemsTitle')}
            </span>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Looking for something quieter?</h2>
            <p className="max-w-2xl text-sm text-brand-900/60 dark:text-stone-50/60">{t('home.hiddenGemsSubtitle')}</p>
          </div>
          {!error && !hiddenGems && <SkeletonGrid count={3} className="lg:grid-cols-3" />}
          {!error && hiddenGems && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hiddenGems.map((d, i) => (
                <DestinationCard key={d._id} destination={d} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ TRAVEL LIKE A LOCAL ============ */}
      <section id="experience" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2">
          <span className="chip w-fit">
            <Users size={13} /> Travel like a local
          </span>
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Food tours, craft workshops, village life — not just sightseeing
          </h2>
          <p className="max-w-2xl text-sm text-brand-900/60 dark:text-stone-50/60">
            Hosted by local guides and families, priced fairly, and bookable straight from the experience page.
          </p>
        </div>
        {error && <ErrorState message="Couldn't load experiences." onRetry={load} />}
        {!error && !localExperiences && <SkeletonGrid count={4} className="lg:grid-cols-4" />}
        {!error && localExperiences && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {localExperiences.map((exp, i) => (
              <ExperienceCard key={exp._id} experience={exp} index={i} />
            ))}
          </div>
        )}
        <div className="mt-6 text-center">
          <Link to="/experiences" className="text-sm font-medium text-saffron-600 hover:underline dark:text-saffron-300">
            {t('common.viewAll')}
          </Link>
        </div>
      </section>

      {/* ============ TRAVEL WITH CONFIDENCE ============ */}
      <section id="safely" className="bg-white py-16 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <span className="chip">
              <ShieldCheck size={13} /> Travel with confidence
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
              Verified places, real safety information — no surprises
            </h2>
            <p className="mt-3 text-sm text-brand-900/60 dark:text-stone-50/60">
              We keep the claims here honest: everything below is a real, working part of the platform today.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CONFIDENCE_CARDS.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="card flex flex-col p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-800 text-saffron-400 dark:bg-white/10 dark:text-saffron-300">
                  <c.icon size={18} />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm text-brand-900/60 dark:text-stone-50/60">{c.text}</p>
                {c.to && (
                  <Link to={c.to} className="mt-4 flex items-center gap-1 text-sm font-medium text-saffron-600 hover:underline dark:text-saffron-300">
                    {c.cta} <ArrowRight size={14} />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SMART BUDGET PLANNER TEASER ============ */}
      <section className="bg-white py-16 dark:bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="chip">
              <Wallet size={13} /> Smart budget planner
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">Know your trip before you go</h2>
            <p className="mt-3 text-brand-900/65 dark:text-stone-50/65">
              Every AI-generated itinerary comes with a real cost breakdown — transport, stay, food, activities
              and a little cushion for shopping — not just a single guessed total.
            </p>
            <Link to="/planner" className="btn-secondary mt-6 w-fit">
              Plan with a budget <ArrowRight size={16} />
            </Link>
          </div>
          <BudgetPreviewCard />
        </div>
      </section>

      {/* ============ SUSTAINABILITY TEASER ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="chip !border-jade-500/30 !text-jade-700 dark:!text-jade-300">
              <Leaf size={13} /> Sustainable tourism
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
              Travel better. Leave a smaller footprint.
            </h2>
            <p className="mt-3 text-brand-900/65 dark:text-stone-50/65">
              Every destination carries a sustainability score across environment, local economy, crowd
              management, waste and transport — so you can choose trips that are better for the places you visit.
            </p>
            <Link to="/sustainability" className="btn-secondary mt-6 w-fit">
              See sustainable picks <ArrowRight size={16} />
            </Link>
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-semibold">Bhedaghat &amp; Dhuandhar Falls</span>
              <span className="flex items-center gap-1 text-jade-600 dark:text-jade-300">
                <Leaf size={14} /> 84/100
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {[
                ['Environment', 82],
                ['Local economy', 78],
                ['Crowd management', 88],
                ['Waste', 80],
                ['Transport', 76],
              ].map(([label, val]) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-xs text-brand-900/60 dark:text-stone-50/60">
                    <span>{label}</span>
                    <span>{val}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${val}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full bg-jade-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ SUPPORT LOCAL + ROADMAP ============ */}
      <section id="support-local" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <div>
            <span className="chip">
              <Store size={13} /> Support local
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">Support local. Travel further.</h2>
            <p className="mt-3 text-brand-900/65 dark:text-stone-50/65">
              Local guides, homestays, artisans and transport operators get their own listings and a provider
              dashboard for inquiries and analytics — not buried under national chains.
            </p>
            <Link to="/businesses" className="btn-secondary mt-6 w-fit">
              Browse local businesses <ArrowRight size={16} />
            </Link>
          </div>
          <div className="card p-6">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Clock size={15} className="text-saffron-500" /> Also on our roadmap
            </p>
            <p className="mt-1 text-xs text-brand-900/55 dark:text-stone-50/55">
              Being honest about what's built vs. what's next — these aren't live yet.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {ROADMAP_ITEMS.map((item) => (
                <span
                  key={item.label}
                  className="flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.02] px-3 py-1.5 text-xs text-brand-900/70 dark:border-white/10 dark:bg-white/5 dark:text-stone-50/70"
                >
                  <item.icon size={13} className="text-brand-900/40 dark:text-stone-50/40" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section id="memories" className="bg-brand-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-2xl font-semibold sm:text-3xl">Real trips, real plans</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-white/60">
            Illustrative traveler stories from the YatraMitra beta.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {TESTIMONIALS.map((t2, i) => (
              <motion.div
                key={t2.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-card border border-white/10 bg-white/5 p-6"
              >
                <Quote size={20} className="text-saffron-400" />
                <p className="mt-3 text-sm text-white/80">{t2.quote}</p>
                <p className="mt-4 text-sm font-semibold">{t2.name}</p>
                <p className="text-xs text-white/50">{t2.trip}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <Scene scene="lakePalace" image={HERO_BACKDROPS[4].src} className="h-full w-full" kenBurns>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
          </Scene>
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center text-white sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Your next trip is one plan away</h2>
          <p className="mt-3 text-white/70">Free to plan. No generic checklists. Built for real Indian travel.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/planner" className="btn-primary">
              Plan my trip <ArrowRight size={16} />
            </Link>
            <Link to="/register" className="btn-secondary !bg-white/10 hover:!bg-white/20">
              Create free account
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-white/60">
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> No spam, ever</span>
            <span className="flex items-center gap-1.5"><Wallet size={14} /> Free to plan</span>
            <span className="flex items-center gap-1.5"><MapPinned size={14} /> 20+ real destinations</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function BudgetPreviewCard() {
  const rows = [
    ['Transport', 22, 'saffron'],
    ['Stay', 34, 'brand'],
    ['Food', 18, 'jade'],
    ['Activities', 16, 'saffron'],
    ['Shopping / misc.', 10, 'jade'],
  ];
  const barColor = { saffron: 'bg-saffron-500', brand: 'bg-brand-700 dark:bg-brand-400', jade: 'bg-jade-500' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-brand-900/60 dark:text-stone-50/60">Sample 4-day trip · 2 travelers</span>
        <span className="font-display text-2xl font-semibold">₹18,500</span>
      </div>
      <div className="mt-5 space-y-3">
        {rows.map(([label, pct, color]) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-xs text-brand-900/60 dark:text-stone-50/60">
              <span>{label}</span>
              <span>{pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${barColor[color]}`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function PlannerStep({ icon: Icon, step, title, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="flex items-start gap-4 rounded-2xl border border-black/5 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-800 text-saffron-400 dark:bg-white/10 dark:text-saffron-300">
        <Icon size={17} />
      </div>
      <div>
        <p className="text-xs font-semibold text-saffron-600 dark:text-saffron-300">STEP {step}</p>
        <h3 className="font-display text-base font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">{text}</p>
      </div>
    </motion.div>
  );
}
