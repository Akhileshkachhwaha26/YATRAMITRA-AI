import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    // No email provider is integrated yet — this simulates the request so
    // the flow is fully clickable, without claiming a real email was sent.
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
  }

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-jade-500/15 text-jade-300">
          <CheckCircle2 size={26} />
        </div>
        <h1 className="font-display text-xl font-semibold">Request received</h1>
        <p className="mt-2 text-sm text-white/60">
          If <span className="text-white">{email}</span> matches an account, reset instructions would be sent there.
          Email delivery isn't connected in this demo build yet — wire up a provider like SendGrid or SES in
          production to complete this flow.
        </p>
        <Link to="/login" className="btn-secondary mt-6 inline-flex">
          <ArrowLeft size={16} /> Back to login
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="text-white">
      <h1 className="text-center font-display text-xl font-semibold">Forgot your password?</h1>
      <p className="mt-1 text-center text-sm text-white/60">
        Enter your email and we'll explain how to reset it.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-white/80">
            Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input !border-white/15 !bg-white/5 !pl-9 !text-white"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Sending...' : 'Send reset instructions'}
        </button>
      </form>

      <Link to="/login" className="mt-6 flex items-center justify-center gap-1.5 text-sm text-white/60 hover:text-white">
        <ArrowLeft size={14} /> Back to login
      </Link>
    </div>
  );
}
