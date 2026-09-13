import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Compass } from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const QUICK_PROMPTS = [
  'Suggest a hidden gem in Madhya Pradesh',
  'Best time to visit Goa',
  'Plan a 3-day budget trip',
  'Family-friendly destinations',
];

/**
 * Lightweight local intent-matcher used when no external LLM API key is
 * configured. It calls the same /api/ai/recommend endpoint the rest of the
 * app uses, so the answer is grounded in real destination data rather than
 * being invented.
 */
async function answerLocally(message) {
  const lower = message.toLowerCase();
  const budgetMatch = /budget|cheap|affordable/.test(lower)
    ? 'budget'
    : /luxury|premium/.test(lower)
    ? 'premium'
    : 'moderate';

  const interestKeywords = {
    Nature: ['nature', 'waterfall', 'hill', 'forest'],
    Wildlife: ['wildlife', 'tiger', 'safari', 'jungle'],
    History: ['history', 'fort', 'heritage', 'ancient'],
    Spiritual: ['spiritual', 'temple', 'pilgrim'],
    Food: ['food', 'cuisine', 'eat'],
    Beach: ['beach', 'coast', 'sea'],
    Adventure: ['adventure', 'trek', 'raft'],
  };
  const interests = Object.entries(interestKeywords)
    .filter(([, words]) => words.some((w) => lower.includes(w)))
    .map(([key]) => key);

  try {
    const { data } = await api.post('/ai/recommend', {
      interests: interests.length ? interests : undefined,
      budgetTier: budgetMatch,
      limit: 3,
    });
    if (data?.data?.length) {
      const top = data.data[0];
      const names = data.data.map((r) => r.destination.name).join(', ');
      return {
        text: `Based on what you're looking for, I'd suggest starting with ${top.destination.name} — ${top.reasons[0] || 'it matches your preferences well'}. A few other options worth a look: ${names}.`,
        destinationId: top.destination._id,
      };
    }
  } catch {
    /* fall through to generic reply below */
  }
  return {
    text: "I couldn't reach live destination data right now, but I can still help — try the AI Planner for a full day-by-day itinerary, or browse Explore for hidden gems near you.",
  };
}

const PROVIDER_LABELS = {
  anthropic: 'Claude',
  openai: 'GPT-4o mini',
  gemini: 'Gemini',
};

/**
 * Sends the message to the real backend chat endpoint (server/controllers/
 * aiController.js), which tries a real LLM — grounded in actual destination
 * data — first, and transparently falls back to a local keyword-matched
 * reply if no API key is configured. If the request itself can't be made
 * (offline, server down), we fall back to the same local matcher client-side
 * so the widget still responds instead of just failing silently.
 */
async function answer(message, history) {
  try {
    const { data } = await api.post('/ai/chat', {
      message,
      history: history.slice(-6).map((m) => ({ role: m.role, text: m.text })),
    });
    return { text: data.data.text, destinationId: data.data.destinationId, generatedBy: data.generatedBy };
  } catch {
    const local = await answerLocally(message);
    return { ...local, generatedBy: 'local-engine' };
  }
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi, I'm YatraMitra AI.\nWhere would you like to travel?" },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [lastProvider, setLastProvider] = useState(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  async function send(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const nextHistory = [...messages, { role: 'user', text: trimmed }];
    setMessages(nextHistory);
    setInput('');
    setThinking(true);
    const reply = await answer(trimmed, messages);
    setThinking(false);
    setLastProvider(reply.generatedBy);
    setMessages((m) => [...m, { role: 'assistant', text: reply.text, destinationId: reply.destinationId }]);
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.92 }}
        aria-label="Open AI travel assistant"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-saffron-500 text-brand-900 shadow-lg shadow-saffron-500/30 animate-float"
      >
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass fixed bottom-24 right-6 z-50 flex h-[28rem] w-[22rem] max-w-[90vw] flex-col overflow-hidden rounded-card"
          >
            <div className="flex items-center gap-2 border-b border-black/10 px-4 py-3 dark:border-white/10">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-800 text-saffron-400 dark:bg-saffron-500 dark:text-brand-900">
                <Compass size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold">YatraMitra AI</p>
                <p className="text-xs text-jade-600 dark:text-jade-300">
                  {lastProvider && lastProvider !== 'local-engine'
                    ? `✦ ${PROVIDER_LABELS[lastProvider] || 'AI'}-powered`
                    : '● Grounded in real destination data'}
                </p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm ${
                    m.role === 'user'
                      ? 'ml-auto bg-saffron-500 text-brand-900'
                      : 'bg-black/5 dark:bg-white/10'
                  }`}
                >
                  {m.text}
                  {m.destinationId && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        navigate(`/destination/${m.destinationId}`);
                      }}
                      className="mt-2 block text-xs font-semibold text-brand-800 underline dark:text-brand-900"
                    >
                      View destination →
                    </button>
                  )}
                </motion.div>
              ))}
              {thinking && (
                <div className="flex w-fit items-center gap-1 rounded-2xl bg-black/5 px-3 py-2 dark:bg-white/10">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-brand-900/50 dark:bg-white/60"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => send(p)}
                  className="chip hover:border-saffron-400 hover:text-saffron-600"
                >
                  {p}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-black/10 p-3 dark:border-white/10"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about destinations, budget, food..."
                className="input !py-2 flex-1 !rounded-full"
                aria-label="Message YatraMitra AI"
              />
              <button type="submit" className="btn-primary !p-2.5" aria-label="Send message">
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
