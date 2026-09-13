const Destination = require('../models/Destination');
const Trip = require('../models/Trip');
const SavedItem = require('../models/SavedItem');

async function getImpactMetrics() {
  const [destinations, trips, saved] = await Promise.all([Destination.find({}).lean(), Trip.countDocuments(), SavedItem.countDocuments()]);
  const total = destinations.length || 1;
  const hiddenGems = destinations.filter(d => d.isHiddenGem).length;
  const avgSustainability = Math.round(destinations.reduce((s,d) => s + (d.sustainability?.score || 0), 0) / total);
  const avgLocalEconomy = Math.round(destinations.reduce((s,d) => s + (d.sustainability?.localEconomy || 0), 0) / total);
  const lowerCrowdOptions = destinations.filter(d => d.popularity < 55).length;
  const estimatedLocalSpendShare = Math.min(90, Math.max(55, Math.round(55 + avgLocalEconomy * 0.35)));
  return { destinations: destinations.length, hiddenGems, lowerCrowdOptions, avgSustainability, avgLocalEconomy, estimatedLocalSpendShare, tripsGenerated: trips, savedItems: saved, methodology: 'Catalog-derived indicators; not a claim of measured field impact.' };
}
module.exports = { getImpactMetrics };
