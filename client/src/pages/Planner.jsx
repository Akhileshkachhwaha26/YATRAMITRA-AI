import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Calendar, Users, Wallet, Heart, Compass, Sparkles,
  ChevronLeft, ChevronRight, Save, RotateCw, Share2, Printer, MapPin, Clock, Mic,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import useVoiceInput from '../hooks/useVoiceInput';
import useNotifications from '../hooks/useNotifications';
import usePlannerStore from '../store/plannerStore';
import { INTERESTS, BUDGET_TIERS, TRAVEL_STYLES, formatINR } from '../utils/constants';

const STEP_LABELS = [
  'Destination', 'Travel dates', 'Travelers', 'Budget', 'Interests', 'Travel style', 'Generate',
];

const AI_PROVIDER_LABELS = {
  anthropic: 'Claude',
  openai: 'GPT-4o mini',
  gemini: 'Gemini',
};

export default function Planner() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const {
    step, totalSteps, form, generatedTrip, isGenerating,
    setField, toggleInterest, nextStep, prevStep, goToStep, setGenerating, setGeneratedTrip, reset,
  } = usePlannerStore();

  const [destinations, setDestinations] = useState([]);
  const [destSearch, setDestSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const { listening, supported: voiceSupported, start: startListening } = useVoiceInput('en-IN', setDestSearch);
  const { notify } = useNotifications();

  useEffect(() => {
    const prefId = params.get('destinationId');
    const prefName = params.get('destinationName');
    if (prefId && !form.destinationId) {
      setField('destinationId', prefId);
      setField('destinationName', prefName || '');
    }
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let active = true;
    api.get('/destinations', { params: { search: destSearch || undefined, limit: 8, sort: 'popularity' } }).then(({ data }) => {
      if (active) setDestinations(data.data);
    }).catch(() => {});
    return () => { active = false; };
  }, [destSearch]);

  async function handleGenerate() {
    setGenerating(true);
    goToStep(7);
    try {
      const { data } = await api.post('/ai/plan-trip', {
        destinationId: form.destinationId || undefined,
        destinationName: form.destinationName || undefined,
        days: form.days,
        budgetTier: form.budgetTier,
        interests: form.interests,
        travelers: form.travelers,
        travelStyle: form.travelStyle,
      });
      setGeneratedTrip(data.data);
      localStorage.setItem('yatramitra:last-trip', JSON.stringify({ savedAt: new Date().toISOString(), trip: data.data }));
    } catch (err) {
      const cached = localStorage.getItem('yatramitra:last-trip');
      if (cached) {
        try { const parsed = JSON.parse(cached); if (parsed.trip?.destinationId === form.destinationId) { setGeneratedTrip(parsed.trip); toast('Showing your last saved offline itinerary.', { icon: '📶' }); return; } } catch {}
      }
      toast.error(err.response?.data?.message || 'Could not generate itinerary. Pick a destination from the list.');
      goToStep(1);
    } finally {
      setGenerating(false);
    }
  }

  async function handleSaveTrip() {
    if (!token) {
      toast.error('Log in to save your trip');
      navigate('/login', { state: { from: '/planner' } });
      return;
    }
    setSaving(true);
    try {
      await api.post('/trips', {
        destination: generatedTrip.destinationId,
        destinationName: generatedTrip.destinationName,
        title: generatedTrip.title,
        travelers: generatedTrip.travelers,
        budgetTier: generatedTrip.budgetTier,
        estimatedTotalCostINR: generatedTrip.estimatedTotalCostINR,
        interests: generatedTrip.interests,
        travelStyle: generatedTrip.travelStyle,
        itinerary: generatedTrip.itinerary,
        safetyNotes: generatedTrip.safetyNotes,
        startDate: form.startDate || undefined,
      });
      toast.success('Trip saved to My Trips');
      notify('YatraMitra AI', { body: `${generatedTrip.destinationName} itinerary saved to My Trips.` });
      navigate('/my-trips');
    } catch {
      toast.error('Could not save the trip right now');
    } finally {
      setSaving(false);
    }
  }

  function handleShare() {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Link copied — sharing full itineraries by link is coming soon');
  }

  const canProceed = {
    1: !!form.destinationId,
    2: form.days >= 1,
    3: form.travelers >= 1,
    4: !!form.budgetTier,
    5: form.interests.length > 0,
    6: !!form.travelStyle,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <span className="chip mx-auto w-fit"><Sparkles size={13} /> AI Trip Planner</span>
        <h1 className="mt-3 font-display text-3xl font-semibold">Let's build your perfect trip</h1>
      </div>

      {step <= 6 && typeof navigator !== 'undefined' && !navigator.onLine && localStorage.getItem('yatramitra:last-trip') && (
        <button type="button" onClick={() => { try { const cached = JSON.parse(localStorage.getItem('yatramitra:last-trip')); setGeneratedTrip(cached.trip); goToStep(7); } catch {} }} className="mb-5 w-full rounded-card border border-jade-500/30 bg-jade-50 p-3 text-left text-sm dark:bg-jade-500/10">
          <strong>Offline mode:</strong> Open your last generated itinerary from this device.
        </button>
      )}

      {step <= 6 && (
        <div className="mb-8 flex items-center gap-1.5">
          {STEP_LABELS.slice(0, 6).map((label, i) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={`h-1.5 w-full rounded-full transition-colors ${
                  i + 1 <= step ? 'bg-saffron-500' : 'bg-black/10 dark:bg-white/10'
                }`}
              />
              <span className="hidden text-[11px] text-brand-900/50 dark:text-stone-50/50 sm:block">{label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="card min-h-[22rem] p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepWrapper key="1">
              <h2 className="font-display text-xl font-semibold">Where would you like to go?</h2>
              <div className="relative mt-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-900/40 dark:text-stone-50/40" />
                <input
                  value={destSearch}
                  onChange={(e) => setDestSearch(e.target.value)}
                  placeholder={listening ? 'Listening...' : 'Search destinations...'}
                  className={`input !pl-9 ${voiceSupported ? '!pr-11' : ''}`}
                />
                {voiceSupported && (
                  <button type="button" onClick={startListening} aria-label="Search by voice" title="Search by voice" className={`absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full ${listening ? 'animate-pulse bg-red-500 text-white' : 'text-brand-900/40 hover:bg-black/5 dark:text-stone-50/50 dark:hover:bg-white/10'}`}><Mic size={15}/></button>
                )}
              </div>
              <div className="mt-4 grid max-h-72 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
                {destinations.map((d) => (
                  <button
                    key={d._id}
                    type="button"
                    onClick={() => {
                      setField('destinationId', d._id);
                      setField('destinationName', d.name);
                    }}
                    className={`flex items-center justify-between rounded-control border px-4 py-3 text-left text-sm transition-colors ${
                      form.destinationId === d._id
                        ? 'border-saffron-400 bg-saffron-50 dark:bg-saffron-500/10'
                        : 'border-black/10 hover:border-black/20 dark:border-white/10 dark:hover:border-white/20'
                    }`}
                  >
                    <span>
                      <span className="font-medium">{d.name}</span>
                      <span className="block text-xs text-brand-900/50 dark:text-stone-50/50">{d.state}</span>
                    </span>
                    {d.isHiddenGem && <span className="chip !py-0.5 !text-[10px]">Hidden gem</span>}
                  </button>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 2 && (
            <StepWrapper key="2">
              <h2 className="font-display text-xl font-semibold">When are you traveling?</h2>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm text-brand-900/60 dark:text-stone-50/60">
                    <Calendar size={14} /> Start date
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setField('startDate', e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-brand-900/60 dark:text-stone-50/60">Number of days</label>
                  <input
                    type="number"
                    min={1}
                    max={21}
                    value={form.days}
                    onChange={(e) => setField('days', Math.max(1, Math.min(21, Number(e.target.value))))}
                    className="input"
                  />
                </div>
              </div>
            </StepWrapper>
          )}

          {step === 3 && (
            <StepWrapper key="3">
              <h2 className="font-display text-xl font-semibold">Who's traveling?</h2>
              <label className="mb-1.5 mt-6 flex items-center gap-1.5 text-sm text-brand-900/60 dark:text-stone-50/60">
                <Users size={14} /> Number of travelers
              </label>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => setField('travelers', Math.max(1, form.travelers - 1))} className="btn-secondary !h-10 !w-10 !p-0">-</button>
                <span className="font-display text-2xl font-semibold">{form.travelers}</span>
                <button type="button" onClick={() => setField('travelers', Math.min(20, form.travelers + 1))} className="btn-secondary !h-10 !w-10 !p-0">+</button>
              </div>
            </StepWrapper>
          )}

          {step === 4 && (
            <StepWrapper key="4">
              <h2 className="font-display text-xl font-semibold">What's your budget?</h2>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {BUDGET_TIERS.map((tier) => (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => setField('budgetTier', tier.value)}
                    className={`rounded-control border p-4 text-left transition-colors ${
                      form.budgetTier === tier.value
                        ? 'border-saffron-400 bg-saffron-50 dark:bg-saffron-500/10'
                        : 'border-black/10 hover:border-black/20 dark:border-white/10 dark:hover:border-white/20'
                    }`}
                  >
                    <p className="flex items-center gap-1.5 font-semibold"><Wallet size={14} /> {tier.label}</p>
                    <p className="mt-1 text-xs text-brand-900/50 dark:text-stone-50/50">{tier.hint}</p>
                  </button>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 5 && (
            <StepWrapper key="5">
              <h2 className="font-display text-xl font-semibold">What are you interested in?</h2>
              <p className="mt-1 text-sm text-brand-900/50 dark:text-stone-50/50">Pick as many as you like.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {INTERESTS.map((interest) => {
                  const active = form.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors ${
                        active
                          ? 'border-saffron-400 bg-saffron-500 text-brand-900'
                          : 'border-black/10 text-brand-900/70 hover:border-black/20 dark:border-white/10 dark:text-stone-50/70'
                      }`}
                    >
                      {active && <Heart size={12} fill="currentColor" />} {interest}
                    </button>
                  );
                })}
              </div>
            </StepWrapper>
          )}

          {step === 6 && (
            <StepWrapper key="6">
              <h2 className="font-display text-xl font-semibold">What's your travel style?</h2>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {TRAVEL_STYLES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setField('travelStyle', s.value)}
                    className={`rounded-control border p-4 text-center text-sm font-medium transition-colors ${
                      form.travelStyle === s.value
                        ? 'border-saffron-400 bg-saffron-50 dark:bg-saffron-500/10'
                        : 'border-black/10 hover:border-black/20 dark:border-white/10'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 7 && (
            <StepWrapper key="7">
              {isGenerating || !generatedTrip ? <GeneratingScreen /> : (
                <GeneratedItinerary
                  trip={generatedTrip}
                  onSave={handleSaveTrip}
                  onRegenerate={handleGenerate}
                  onShare={handleShare}
                  onNewTrip={() => { reset(); }}
                  saving={saving}
                />
              )}
            </StepWrapper>
          )}
        </AnimatePresence>
      </div>

      {step <= 6 && typeof navigator !== 'undefined' && !navigator.onLine && localStorage.getItem('yatramitra:last-trip') && (
        <button type="button" onClick={() => { try { const cached = JSON.parse(localStorage.getItem('yatramitra:last-trip')); setGeneratedTrip(cached.trip); goToStep(7); } catch {} }} className="mb-5 w-full rounded-card border border-jade-500/30 bg-jade-50 p-3 text-left text-sm dark:bg-jade-500/10">
          <strong>Offline mode:</strong> Open your last generated itinerary from this device.
        </button>
      )}

      {step <= 6 && (
        <div className="mt-6 flex items-center justify-between">
          <button type="button" onClick={prevStep} disabled={step === 1} className="btn-ghost disabled:opacity-30">
            <ChevronLeft size={16} /> Back
          </button>
          {step < 6 ? (
            <button type="button" onClick={nextStep} disabled={!canProceed[step]} className="btn-primary">
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button type="button" onClick={handleGenerate} disabled={!canProceed[6]} className="btn-primary">
              <Sparkles size={16} /> Generate trip
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function StepWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

function GeneratingScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-saffron-500 to-brand-800 text-white"
      >
        <Compass size={28} />
      </motion.div>
      <h2 className="font-display text-xl font-semibold">YatraMitra AI is crafting your perfect journey...</h2>
      <p className="mt-2 text-sm text-brand-900/50 dark:text-stone-50/50">
        Matching your interests, budget and dates to real local recommendations.
      </p>
    </div>
  );
}

function GeneratedItinerary({ trip, onSave, onRegenerate, onShare, onNewTrip, saving }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} id="itinerary-print-area">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="chip"><Sparkles size={12} /> Personalized itinerary</span>
          <span className="chip ml-1.5 !border-jade-500/30 !text-jade-700 dark:!text-jade-300">
            {trip.generatedBy && trip.generatedBy !== 'local-engine'
              ? `✦ Generated by ${AI_PROVIDER_LABELS[trip.generatedBy] || 'AI'}`
              : 'Generated by our planning engine'}
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold">{trip.title}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-900/60 dark:text-stone-50/60">
            <MapPin size={14} /> {trip.destinationName} · {trip.itinerary.length} days · {formatINR(trip.estimatedTotalCostINR)} estimated
          </p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <button type="button" onClick={onSave} disabled={saving} className="btn-primary !py-2 text-sm">
            <Save size={14} /> Save Trip
          </button>
          <button type="button" onClick={onRegenerate} className="btn-secondary !py-2 text-sm">
            <RotateCw size={14} /> Regenerate
          </button>
          <button type="button" onClick={onShare} className="btn-ghost !py-2 text-sm">
            <Share2 size={14} /> Share
          </button>
          <button type="button" onClick={() => window.print()} className="btn-ghost !py-2 text-sm">
            <Printer size={14} /> Export PDF
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {trip.itinerary.map((day) => (
          <div key={day.day} className="card p-5">
            <h3 className="font-display text-lg font-semibold">Day {day.day}</h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {['morning', 'afternoon', 'evening'].map((slot) => (
                <div key={slot} className="rounded-control bg-black/[0.03] p-3 dark:bg-white/5">
                  <p className="flex items-center gap-1.5 text-xs font-medium capitalize text-saffron-600 dark:text-saffron-300">
                    <Clock size={12} /> {slot}
                  </p>
                  <p className="mt-1 text-sm font-medium">{day[slot].title}</p>
                  <p className="mt-1 text-xs text-brand-900/60 dark:text-stone-50/60">{day[slot].description}</p>
                  <p className="mt-2 text-xs font-medium">{formatINR(day[slot].cost)}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-900/50 dark:text-stone-50/50">
              <span>Suggested stay: {day.suggestedHotel}</span>
              <span>~{day.estimatedDistanceKm} km of travel</span>
            </div>
            {day.localTip && (
              <p className="mt-2 rounded-control bg-jade-50 p-2 text-xs text-jade-700 dark:bg-jade-500/10 dark:text-jade-300">
                Local tip: {day.localTip}
              </p>
            )}
          </div>
        ))}
      </div>

      <button type="button" onClick={onNewTrip} className="btn-ghost mt-6 print:hidden">
        Plan another trip
      </button>
    </motion.div>
  );
}
