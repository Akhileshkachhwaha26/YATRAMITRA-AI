export const INTERESTS = [
  'Adventure', 'Nature', 'History', 'Culture', 'Food', 'Spiritual',
  'Shopping', 'Beach', 'Wildlife', 'Photography', 'Nightlife',
];

export const BUDGET_TIERS = [
  { value: 'budget', label: 'Budget', hint: 'Hostels, local eats, public transport' },
  { value: 'moderate', label: 'Moderate', hint: '3-star stays, mix of local & touristy' },
  { value: 'premium', label: 'Premium', hint: '4-star stays, curated experiences' },
  { value: 'luxury', label: 'Luxury', hint: '5-star stays, private guides & transport' },
];

export const TRAVEL_STYLES = [
  { value: 'solo', label: 'Solo' },
  { value: 'couple', label: 'Couple' },
  { value: 'family', label: 'Family' },
  { value: 'friends', label: 'Friends' },
  { value: 'business', label: 'Business' },
];

export const BUSINESS_TYPES = [
  { value: 'guide', label: 'Local Guide' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'homestay', label: 'Homestay' },
  { value: 'shop', label: 'Shop / Artisan' },
  { value: 'transport', label: 'Transport Provider' },
  { value: 'experience-host', label: 'Experience Host' },
  { value: 'artisan', label: 'Artisan' },
];

export const EXPERIENCE_CATEGORIES = [
  { value: 'food-tour', label: 'Food Tours' },
  { value: 'handicrafts', label: 'Handicrafts' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'village-tourism', label: 'Village Tourism' },
  { value: 'trekking', label: 'Trekking' },
  { value: 'photography', label: 'Photography' },
  { value: 'festival', label: 'Local Festivals' },
  { value: 'cooking-class', label: 'Cooking Classes' },
  { value: 'nature', label: 'Nature Experiences' },
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'spiritual', label: 'Spiritual' },
];

export const EMERGENCY_NUMBERS = [
  { label: 'National Emergency Number', value: '112' },
  { label: 'Police', value: '100' },
  { label: 'Ambulance', value: '108' },
  { label: 'Fire', value: '101' },
  { label: 'Tourist Helpline', value: '1363' },
  { label: 'Women Helpline', value: '1091' },
];

export function formatINR(amount) {
  if (amount === undefined || amount === null) return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    amount
  );
}

export function buildWhatsAppLink(phone, message = '') {
  if (!phone) return null;
  const digits = String(phone).replace(/[^\d]/g, '');
  if (!digits) return null;
  const withCountryCode = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${withCountryCode}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}