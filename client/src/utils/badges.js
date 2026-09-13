/**
 * Client-side badge computation. Deliberately NOT stored in the
 * database — badges are derived on the fly from the user's real trips,
 * saved items, and the platform's own destination data (hidden-gem
 * flags, sustainability scores), so they can never drift out of sync
 * with what actually happened, and adding a new badge never needs a
 * migration.
 */
export function computeBadges({ trips = [], saved = [], destinations = [] }) {
  const destByName = new Map(destinations.map((d) => [d.name, d]));

  const tripDestinations = trips.map((t) => destByName.get(t.destinationName)).filter(Boolean);
  const savedDestinationNames = saved.filter((s) => s.itemType === 'destination').map((s) => s.itemName);
  const savedDestinations = savedDestinationNames.map((n) => destByName.get(n)).filter(Boolean);
  const allTouched = [...tripDestinations, ...savedDestinations];

  const hiddenGemCount = allTouched.filter((d) => d.isHiddenGem).length;
  const avgSustainability = allTouched.length
    ? allTouched.reduce((sum, d) => sum + (d.sustainability?.score || 0), 0) / allTouched.length
    : 0;
  const hasAITrip = trips.some((t) => t.generatedBy === 'external-ai');
  const hasBudgetTrip = trips.some((t) => t.budgetTier === 'budget');

  return [
    {
      id: 'first-trip',
      label: 'First Journey',
      description: 'Planned your first trip with YatraMitra AI',
      icon: 'Compass',
      earned: trips.length >= 1,
    },
    {
      id: 'explorer',
      label: 'Explorer',
      description: 'Planned 3 or more trips',
      icon: 'MapPin',
      earned: trips.length >= 3,
    },
    {
      id: 'hidden-gem-hunter',
      label: 'Hidden Gem Explorer',
      description: 'Trip-planned or saved a hidden-gem destination',
      icon: 'Gem',
      earned: hiddenGemCount >= 1,
    },
    {
      id: 'sustainability-champion',
      label: 'Sustainability Champion',
      description: 'Your visited/saved destinations average 80+ sustainability score',
      icon: 'Leaf',
      earned: allTouched.length >= 2 && avgSustainability >= 80,
    },
    {
      id: 'budget-master',
      label: 'Budget Master',
      description: 'Planned a trip on a budget-tier itinerary',
      icon: 'Wallet',
      earned: hasBudgetTrip,
    },
    {
      id: 'curator',
      label: 'Curator',
      description: 'Saved 5 or more places to your list',
      icon: 'Bookmark',
      earned: saved.length >= 5,
    },
    {
      id: 'ai-pioneer',
      label: 'AI Pioneer',
      description: 'Generated an itinerary polished by the LLM-enhanced planner',
      icon: 'Sparkles',
      earned: hasAITrip,
    },
  ];
}
