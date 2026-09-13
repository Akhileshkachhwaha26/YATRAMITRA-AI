/**
 * Centralized image-data layer.
 * -----------------------------------------------------------------
 * Every image URL in the app is generated from this single file, so
 * swapping to a paid stock API (Unsplash API, Pexels API) or to your
 * own CDN later means editing only wikimediaImage() below — nothing in
 * the component tree needs to change.
 *
 * Only one source is used: wikimediaImage() — real, hand-picked
 * photography of the actual named place (Bhedaghat, Khajuraho, Hawa
 * Mahal, etc.) served via Wikimedia Commons' Special:FilePath redirect.
 * This powers the hero backdrop and every destination/hotel/experience/
 * business we've curated a photo for (see REAL_IMAGES in scenes.js).
 *
 * An earlier version of this file also used LoremFlickr, a free
 * keyword-matched photo service, as a fallback for anything without a
 * curated photo. In practice its fuzzy matching produced completely
 * unrelated photos (most visibly, the same random street-statue photo
 * showing up across totally unrelated cards), so it's been removed
 * entirely — a listing either gets a real, verified photo, or the
 * illustrated Scene fallback (components/visuals/Scene.jsx). Never a
 * keyword-matched guess.
 */

/** Real photo, keyed to a specific Wikimedia Commons file. Reliable,
 * hotlink-friendly, freely licensed — no API key required. `width`
 * requests an appropriately downscaled render from Commons' thumbnail
 * pipeline instead of shipping a multi-MB original to the browser. */
export function wikimediaImage(filename, width = 1600) {
  const clean = String(filename).trim().replace(/ /g, '_');
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(clean)}?width=${width}`;
}

/**
 * Curated cinematic hero backdrops — real photography of actual Indian
 * tourism landmarks, led by Madhya Pradesh (this project's flagship demo
 * region) and rounded out with a couple of other iconic destinations.
 * Each crossfades in on the homepage hero; see HeroBackdrop in Home.jsx.
 */
export const HERO_BACKDROPS = [
  { src: wikimediaImage('Dhuandhar_falls_at_Bhedaghat,_Madhya_Pradesh,_India.jpg', 1920), label: 'Dhuandhar Falls, Bhedaghat' },
  { src: wikimediaImage('Pachmarhi_valley_Madhya_Pradesh_INDIA.jpg', 1920), label: 'Pachmarhi valley' },
  { src: wikimediaImage('Architecture_of_the_Khajuraho_temples.jpg', 1920), label: 'Khajuraho temples' },
  { src: wikimediaImage('Great_Sanchi_Stupa.jpg', 1920), label: 'The Great Stupa, Sanchi' },
  { src: wikimediaImage('Lake_Pichola_at_sunset,_Udaipur,_Rajasthan,_India.jpg', 1920), label: 'Lake Pichola, Udaipur' },
  { src: wikimediaImage('Goa_beautiful_beach.JPG', 1920), label: 'Goa coastline' },
];

/** Mood-picker thumbnails on the homepage — reuses curated destination
 * photos where the mood maps cleanly onto one; moods without a natural
 * real-photo match use `null`, which renders the illustrated fallback. */
export const MOOD_IMAGES = {
  nature: wikimediaImage('Pachmarhi_valley_Madhya_Pradesh_INDIA.jpg', 640),
  adventure: wikimediaImage('Dhuandhar_falls_at_Bhedaghat,_Madhya_Pradesh,_India.jpg', 640),
  culture: wikimediaImage('Architecture_of_the_Khajuraho_temples.jpg', 640),
  food: null,
  spiritual: wikimediaImage('Mahakal_Temple_Ujjain.JPG', 640),
  relax: wikimediaImage('Goa_beautiful_beach.JPG', 640),
  photography: wikimediaImage('Lake_Pichola_at_sunset,_Udaipur,_Rajasthan,_India.jpg', 640),
  nightlife: wikimediaImage('Wide_Angle_view_of_Indore_Rajwada_at_night.jpg', 640),
};
