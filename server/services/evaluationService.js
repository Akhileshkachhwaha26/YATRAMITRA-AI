const { recommendDestinations } = require('./recommendationService');

// Small deterministic benchmark for demos/CI. These are synthetic ground-truth
// preference cases, so the score is an offline evaluation metric, not a claim of
// real-world accuracy.
const CASES = [
  { interests:['Wildlife','Nature'], budgetTier:'premium', expected:['Kanha National Park','Bandhavgarh National Park'] },
  { interests:['History','Culture'], budgetTier:'moderate', expected:['Khajuraho','Sanchi'] },
  { interests:['Nature','Adventure'], budgetTier:'moderate', expected:['Pachmarhi','Bhedaghat'] },
  { interests:['Spiritual','Culture'], budgetTier:'budget', expected:['Ujjain','Sanchi'] },
];

function evaluate(destinations) {
  let precision=0, recall=0, hits=0;
  for (const c of CASES) {
    const ranked = recommendDestinations(destinations,c,5).map(x=>x.destination.name);
    const expected = new Set(c.expected);
    const hit = ranked.filter(n=>expected.has(n)).length;
    hits += hit;
    precision += hit / Math.max(ranked.length,1);
    recall += hit / expected.size;
  }
  precision /= CASES.length; recall /= CASES.length;
  const f1 = precision+recall ? (2*precision*recall)/(precision+recall) : 0;
  const coverage = Math.min(1, destinations.length / 10);
  return { benchmarkCases: CASES.length, precisionAt5: Math.round(precision*1000)/1000, recallAt5: Math.round(recall*1000)/1000, f1At5: Math.round(f1*1000)/1000, catalogCoverage: Math.round(coverage*1000)/1000, totalExpectedHits:hits, note:'Synthetic benchmark cases for engineering validation; replace/augment with real user-labelled evaluation data before claiming production accuracy.' };
}
module.exports={evaluate};
