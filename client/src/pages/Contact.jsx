import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    // No dedicated contact endpoint yet — this simulates submission so the
    // flow is fully usable; wire to a real /api/contact route when ready.
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Get in touch</h1>
        <p className="mt-3 max-w-xl text-brand-900/70 dark:text-stone-50/70">
          Questions about the platform, partnership ideas, or want to list your tourism business? Send us a
          note.
        </p>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-4">
          <ContactRow icon={Mail} label="Email" value="hello@yatramitra.ai" />
          <ContactRow icon={Phone} label="Phone" value="+91 90000 00000" />
          <ContactRow icon={MapPin} label="Based in" value="Jabalpur, Madhya Pradesh, India" />
        </div>

        <div className="lg:col-span-3">
          <div className="card p-6 sm:p-8">
            {submitted ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-8 text-center">
                <CheckCircle2 size={40} className="text-jade-500" />
                <h3 className="mt-4 font-display text-lg font-semibold">Message sent</h3>
                <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">
                  Thanks, {form.name.split(' ')[0] || 'traveler'} — we'll get back to you soon.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm text-brand-900/60 dark:text-stone-50/60">Name</label>
                  <input name="name" required value={form.name} onChange={handleChange} className="input" placeholder="Your name" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-brand-900/60 dark:text-stone-50/60">Email</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange} className="input" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-brand-900/60 dark:text-stone-50/60">Message</label>
                  <textarea name="message" required rows={5} value={form.message} onChange={handleChange} className="input resize-none" placeholder="How can we help?" />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
                  <Send size={15} /> {submitting ? 'Sending...' : 'Send message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-800 text-saffron-400 dark:bg-white/10 dark:text-saffron-300">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs text-brand-900/50 dark:text-stone-50/50">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
