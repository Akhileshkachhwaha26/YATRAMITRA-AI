import { wikimediaImage } from './imageData';

/**
 * Centralized destination-visual mapping.
 * ---------------------------------------------------------------
 * Every destination card requests a photo via imageForDestination() below,
 * which only ever returns a curated, hand-verified real photo (or nothing).
 * Scene.jsx renders that photo if present; if it's absent, or fails to
 * load, it falls back to an original illustrated "scene" (this file's
 * SCENE_PALETTES + keyword mapping) — so the UI never shows a broken-image
 * icon or an off-brand/irrelevant photo.
 *
 * REAL_IMAGES pins each of our seeded destinations to a specific,
 * hand-picked Wikimedia Commons photo of that exact place — all 20 seed
 * destinations are covered. TO ADD A NEW DESTINATION: add its slug and a
 * verified Wikimedia photo here; it renders as an illustration until you do.
 */

export const REAL_IMAGES = {
  // Madhya Pradesh — flagship demo region
  'bhedaghat-dhuandhar-falls': wikimediaImage('Dhuandhar_falls_at_Bhedaghat,_Madhya_Pradesh,_India.jpg'),
  pachmarhi: wikimediaImage('Pachmarhi_valley_Madhya_Pradesh_INDIA.jpg'),
  'kanha-national-park': wikimediaImage('Royal_Bengal_Tiger_Kanha.JPG'),
  'bandhavgarh-national-park': wikimediaImage('Bandhavgarh_National_Park.jpg'),
  khajuraho: wikimediaImage('Architecture_of_the_Khajuraho_temples.jpg'),
  sanchi: wikimediaImage('Great_Sanchi_Stupa.jpg'),
  ujjain: wikimediaImage('Mahakal_Temple_Ujjain.JPG'),
  orchha: wikimediaImage('West_gate_of_Orchha_Fort_01.jpg'),
  bhopal: wikimediaImage('Aerial_view_of_Upper_Lake,_Bhopal.jpg'),
  indore: wikimediaImage('Wide_Angle_view_of_Indore_Rajwada_at_night.jpg'),
  // Other seeded destinations
  jaipur: wikimediaImage('Hawa_Mahal_-_Jaipur_-_Rajasthan_-_001.jpg'),
  udaipur: wikimediaImage('Lake_Pichola_at_sunset,_Udaipur,_Rajasthan,_India.jpg'),
  goa: wikimediaImage('Goa_beautiful_beach.JPG'),
  varanasi: wikimediaImage('Ahilya_Ghat_by_the_Ganges,_Varanasi.jpg'),
  amritsar: wikimediaImage('Golden_Temple_(Harmandir_Sahib),_Amritsar.jpg'),
  rishikesh: wikimediaImage('Lakshman_Jhula_Bridge_-_Hrishikesh_-_Uttarakhand_001.jpg'),
  'munnar-kerala': wikimediaImage('View_of_tea_plantations_in_Munnar.jpg'),
  'alleppey-backwaters': wikimediaImage('Kerala_backwaters,_Vembanad_Lake,_Houseboats,_India.jpg'),
  chanderi: wikimediaImage('Bada_Madarsa-Chanderi-Madhya_Pradesh-001.jpg'),
  mandu: wikimediaImage('A_beautiful_Jahaz_Mahal.jpg'),
};

// scene keys -> [primary, secondary] tailwind-safe hex colors used for the sky gradient
export const SCENE_PALETTES = {
  waterfall: ['#0f3d63', '#1f9d77'],
  hillstation: ['#1b2a4a', '#2b3d75'],
  wildlife: ['#1b2a1a', '#3f5a2c'],
  heritageTemple: ['#3a2210', '#8f501c'],
  heritageFort: ['#4a2a10', '#b3661a'],
  backwater: ['#0a3d3a', '#1f9d77'],
  beach: ['#0d3b52', '#2b8fa8'],
  ghat: ['#3a1a10', '#8f501c'],
  desertCity: ['#4a2a1a', '#d98620'],
  lakePalace: ['#0f2a4a', '#546bb3'],
  cityLakes: ['#12233f', '#2b3d75'],
  handicraft: ['#3a2a10', '#b3661a'],
};

const KEYWORD_SCENE_MAP = [
  { keys: ['waterfall', 'falls', 'marble', 'boating'], scene: 'waterfall' },
  { keys: ['hills', 'trekking', 'caves'], scene: 'hillstation' },
  { keys: ['wildlife', 'safari'], scene: 'wildlife' },
  { keys: ['buddhist', 'unesco', 'temples', 'spiritual'], scene: 'heritageTemple' },
  { keys: ['fort', 'ruins', 'weaving', 'handicrafts'], scene: 'heritageFort' },
  { keys: ['backwaters', 'houseboat'], scene: 'backwater' },
  { keys: ['beach', 'nightlife'], scene: 'beach' },
  { keys: ['ghats', 'pilgrimage'], scene: 'ghat' },
  { keys: ['adventure', 'rafting', 'yoga'], scene: 'hillstation' },
  { keys: ['lakes', 'romantic'], scene: 'lakePalace' },
  { keys: ['shopping', 'city', 'museums'], scene: 'cityLakes' },
];

export function sceneForDestination(destination = {}) {
  const tags = [...(destination.tags || []), ...(destination.interests || [])].map((t) => t.toLowerCase());
  for (const { keys, scene } of KEYWORD_SCENE_MAP) {
    if (keys.some((k) => tags.includes(k) || tags.some((t) => t.includes(k)))) return scene;
  }
  // deterministic fallback so the same destination always gets the same scene
  const scenes = Object.keys(SCENE_PALETTES);
  const hash = (destination.name || 'x').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return scenes[hash % scenes.length];
}

/**
 * Real photo for a destination. Only ever returns a curated, hand-verified
 * Wikimedia Commons photo of the actual named place (REAL_IMAGES above) —
 * never a keyword-matched guess. LoremFlickr's fuzzy tag matching was tried
 * here previously and produced completely unrelated photos (e.g. a random
 * street statue) for anything outside the curated set, which is worse than
 * no photo at all on a "Verified" travel card. So: curated real photo, or
 * nothing — Scene.jsx's illustrated fallback handles "nothing" gracefully.
 * TO ADD A DESTINATION: pin a real photo in REAL_IMAGES above; don't wire a
 * generic photo-search fallback back in here.
 */
export function imageForDestination(destination = {}) {
  return REAL_IMAGES[destination.slug] || null;
}

// Maps each seeded destination's exact display name (as stored denormalized
// on Hotel/Experience/Business as `destinationName`) to its slug, so those
// listings can reuse the same curated real photo as their destination.
const NAME_TO_SLUG = {
  'Bhedaghat & Dhuandhar Falls': 'bhedaghat-dhuandhar-falls',
  Pachmarhi: 'pachmarhi',
  'Kanha National Park': 'kanha-national-park',
  'Bandhavgarh National Park': 'bandhavgarh-national-park',
  Khajuraho: 'khajuraho',
  Sanchi: 'sanchi',
  Ujjain: 'ujjain',
  Orchha: 'orchha',
  Bhopal: 'bhopal',
  Indore: 'indore',
  Jaipur: 'jaipur',
  Udaipur: 'udaipur',
  Goa: 'goa',
  Varanasi: 'varanasi',
  Rishikesh: 'rishikesh',
  Munnar: 'munnar-kerala',
  'Alleppey Backwaters': 'alleppey-backwaters',
  Amritsar: 'amritsar',
  Chanderi: 'chanderi',
  Mandu: 'mandu',
};

function imageForDestinationName(name) {
  const slug = NAME_TO_SLUG[name];
  return (slug && REAL_IMAGES[slug]) || null;
}

export function sceneForHotel(hotel = {}) {
  if (hotel.isEcoFriendly) return 'hillstation';
  if (hotel.priceTier === 'luxury') return 'lakePalace';
  if (hotel.priceTier === 'premium') return 'heritageFort';
  return 'cityLakes';
}

/**
 * Real photo for a hotel: reuses its destination's curated photo (a hotel
 * "in Chanderi" gets the same verified Chanderi photo the destination card
 * uses) when that destination is in REAL_IMAGES, else null. Never a
 * keyword-matched guess — LoremFlickr was tried here and, in practice,
 * returned the exact same unrelated photo for every hotel regardless of
 * location or tier, which is worse than the illustrated fallback (see
 * imageForDestination above for the full rationale).
 */
export function imageForHotel(hotel = {}) {
  return imageForDestinationName(hotel.destinationName);
}

const EXPERIENCE_SCENE_MAP = {
  'food-tour': 'cityLakes',
  handicrafts: 'handicraft',
  cultural: 'heritageTemple',
  'village-tourism': 'hillstation',
  trekking: 'hillstation',
  photography: 'waterfall',
  festival: 'heritageTemple',
  'cooking-class': 'handicraft',
  nature: 'hillstation',
  wildlife: 'wildlife',
  spiritual: 'ghat',
};

export function sceneForExperience(experience = {}) {
  return EXPERIENCE_SCENE_MAP[experience.category] || 'hillstation';
}

/** Same approach as imageForHotel — reuse the destination's curated photo,
 * or nothing. See imageForDestination above for the full rationale. */
export function imageForExperience(experience = {}) {
  return imageForDestinationName(experience.destinationName);
}

const BUSINESS_SCENE_MAP = {
  guide: 'hillstation',
  restaurant: 'cityLakes',
  homestay: 'heritageFort',
  shop: 'handicraft',
  transport: 'desertCity',
  'experience-host': 'waterfall',
  artisan: 'handicraft',
};

export function sceneForBusiness(business = {}) {
  return BUSINESS_SCENE_MAP[business.type] || 'cityLakes';
}

/** Same approach as imageForHotel — reuse the destination's curated photo,
 * or nothing. See imageForDestination above for the full rationale. */
export function imageForBusiness(business = {}) {
  return imageForDestinationName(business.destinationName);
}
