import { useState } from 'react';
import toast from 'react-hot-toast';
import { CreditCard, MessageCircle } from 'lucide-react';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import { formatINR, buildWhatsAppLink } from '../../utils/constants';

/**
 * Books an experience/hotel via Razorpay checkout if the backend has
 * RAZORPAY_KEY_ID/SECRET configured, otherwise falls back to a WhatsApp
 * inquiry link so the button is never dead — just degrades to "ask
 * first, pay later" the way most local operators already work.
 *
 * NOTE: the Razorpay checkout path is untested against a live account
 * in this build (see server/services/paymentService.js) — verify with
 * your own test-mode keys before a real demo.
 */
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BookingButton({ itemType, itemId, itemName, amountINR, contactPhone, paymentsConfigured }) {
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const whatsappLink = buildWhatsAppLink(
    contactPhone,
    `Hi, I'd like to book "${itemName}" (${formatINR(amountINR)}) via YatraMitra AI.`
  );

  async function handlePay() {
    if (!token) {
      toast.error('Please log in to book');
      return;
    }
    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Could not load payment gateway. Check your connection.');

      const { data } = await api.post('/payments/create-order', { itemType, itemId });
      const order = data.data;

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'YatraMitra AI',
        description: itemName,
        order_id: order.orderId,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#f4a93b' },
        handler: async (response) => {
          try {
            await api.post('/payments/verify', {
              paymentRecordId: order.paymentRecordId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success('Payment successful — booking confirmed!');
          } catch {
            toast.error('Payment verification failed. Contact support if you were charged.');
          }
        },
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Could not start payment');
    } finally {
      setLoading(false);
    }
  }

  if (!paymentsConfigured) {
    // Graceful fallback: no Razorpay keys set up yet, so offer the
    // WhatsApp inquiry path instead of a dead "Book now" button.
    return whatsappLink ? (
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-secondary">
        <MessageCircle size={15} /> Enquire on WhatsApp
      </a>
    ) : null;
  }

  return (
    <button type="button" onClick={handlePay} disabled={loading} className="btn-primary">
      <CreditCard size={15} /> {loading ? 'Starting payment...' : `Book now — ${formatINR(amountINR)}`}
    </button>
  );
}
