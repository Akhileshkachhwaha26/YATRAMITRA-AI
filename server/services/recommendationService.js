/**
 * YatraMitra AI - Recommendation Engine
 * ---------------------------------------------------------------
 * This is a fully working, deterministic, explainable recommendation
 * engine that runs entirely on local data (no external API required).
 *
 * If an external LLM API key (OpenAI / Gemini / Anthropic) is added in
 * the future, `generateItineraryWithExternalAI()` can be implemented and
 * wired in from `aiController.js` — the rest of the app does not need to
 * change, because both paths return the same Trip-shaped object.
 */

const BUDGET_ORDER = ['budget', 'moderate', 'premium', 'luxury'];

function budgetDistance(a, b) {
  return Math.abs(BUDGET_ORDER.indexOf(a) - BUDGET_ORDER.indexOf(b));
}

/**
 * Score a destination against a traveler's stated preferences.
 * Returns a 0-100 relevance score plus a human-readable reason list
 * (used by the UI to explain "why this was recommended").
 */
function scoreDestination(destination, prefs) {
  let score = 0;
  const reasons = [];

  // Interest overlap (heaviest weight)
  const overlap = (destination.interests || []).filter((i) => (prefs.interests || []).includes(i));
  if (overlap.length) {
    score += overlap.length * 18;
    reasons.push(`Matches your interests: ${overlap.join(', ')}`);
  }

  // Budget fit
  const bDist = budgetDistance(destination.budgetLevel, prefs.budgetTier || 'moderate');
  score += Math.max(0, 30 - bDist * 12);
  if (bDist === 0) reasons.push('Fits your budget preference exactly');

  // Season fit
  if (prefs.season && (destination.bestSeason || []).includes(prefs.season)) {
    score += 15;
    reasons.push(`Great to visit during ${prefs.season}`);
  }

  // Rating boost
  score += (destination.rating || 4) * 4;

  // Sustainability nudge (small, so it doesn't override intent, but rewards responsible options)
  if (destination.sustainability?.score) {
    score += destination.sustainability.score * 0.08;
  }

  // Over-tourism dampening + hidden gem promotion
  if (destination.popularity > 80 && !prefs.preferPopular) {
    score -= 8;
    reasons.push('Note: this is a very popular spot — consider a hidden-gem alternative below');
  }
  if (destination.isHiddenGem) {
    score += 6;
    reasons.push('Hidden gem — supports local communities and reduces overcrowding');
  }

  return { score: Math.round(Math.max(0, Math.min(100, score))), reasons };
}

/**
 * Rank all destinations for a given preference set.
 */
function recommendDestinations(destinations, prefs, limit = 8) {
  const ranked = destinations
    .map((d) => ({ destination: d, ...scoreDestination(d, prefs) }))
    .sort((a, b) => b.score - a.score);
  return ranked.slice(0, limit);
}

/**
 * For a popular/overcrowded destination, find a lesser-known alternative
 * with overlapping tags/interests and a decent sustainability score.
 */
function findHiddenGemAlternative(destination, allDestinations) {
  if (destination.alternativeTo) return null; // it IS the alternative
  const candidates = allDestinations.filter(
    (d) =>
      d._id.toString() !== destination._id.toString() &&
      d.isHiddenGem &&
      d.state === destination.state &&
      (d.tags || []).some((t) => (destination.tags || []).includes(t))
  );
  if (!candidates.length) return null;
  candidates.sort((a, b) => (b.sustainability?.score || 0) - (a.sustainability?.score || 0));
  return candidates[0];
}

const MEAL_COSTS = { budget: 300, moderate: 700, premium: 1500, luxury: 3500 };
const ACTIVITY_COSTS = { budget: 400, moderate: 900, premium: 2000, luxury: 5000 };

/**
 * Deterministic day-by-day itinerary generator. This is the local
 * "fallback" engine used whenever no external generative AI API key is
 * configured — it is a real, working generator, not a stub.
 */
function generateItinerary({ destination, days, budgetTier, interests, travelers, travelStyle }) {
  const attractions = destination.attractions?.length
    ? destination.attractions
    : [{ name: `${destination.name} town center`, description: 'Explore the local area at your own pace.' }];

  const itinerary = [];
  let totalCost = 0;
  const mealCost = MEAL_COSTS[budgetTier] || MEAL_COSTS.moderate;
  const activityCost = ACTIVITY_COSTS[budgetTier] || ACTIVITY_COSTS.moderate;

  for (let day = 1; day <= days; day += 1) {
    const morningSpot = attractions[(day - 1) % attractions.length];
    const afternoonSpot = attractions[day % attractions.length];
    const eveningSpot = attractions[(day + 1) % attractions.length];

    const dayCost = activityCost * 3 + mealCost * travelers;
    totalCost += dayCost;

    itinerary.push({
      day,
      morning: {
        title: `Visit ${morningSpot.name}`,
        description: morningSpot.description || `Start your day exploring ${morningSpot.name}.`,
        cost: Math.round(activityCost * 0.4),
      },
      afternoon: {
        title: `Explore ${afternoonSpot.name}`,
        description: afternoonSpot.description || `Enjoy local food and culture near ${afternoonSpot.name}.`,
        cost: Math.round(activityCost * 0.35 + mealCost * 0.6),
      },
      evening: {
        title: day === days ? 'Relax and depart' : `Sunset at ${eveningSpot.name}`,
        description:
          day === days
            ? 'Wrap up souvenir shopping and prepare for departure.'
            : `Wind down with local cuisine and reflect on the day near ${eveningSpot.name}.`,
        cost: Math.round(activityCost * 0.25 + mealCost * 0.4),
      },
      suggestedHotel: `A ${budgetTier}-tier stay near ${destination.name}`,
      estimatedDistanceKm: 5 + (day % 4) * 3,
      localTip:
        destination.safetyNotes ||
        'Carry a copy of ID, stay hydrated, and respect local customs and sacred sites.',
    });
  }

  return {
    itinerary,
    estimatedTotalCostINR: Math.round(totalCost),
  };
}

module.exports = {
  scoreDestination,
  recommendDestinations,
  findHiddenGemAlternative,
  generateItinerary,
};
