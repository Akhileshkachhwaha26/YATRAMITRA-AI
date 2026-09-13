/**
 * Optional external LLM-backed itinerary generation.
 * ------------------------------------------------------------------
 * Wired in from aiController.js as a first attempt before falling back
 * to the deterministic local engine in recommendationService.js — this
 * fulfils the extension point documented in that file's header comment.
 *
 * Supports Anthropic Claude, OpenAI, and Google Gemini — whichever API
 * key is present in the environment (checked in that order; only one is
 * ever called per request). If none are configured, or the call fails,
 * times out, or returns something that doesn't match the expected shape,
 * this returns null and the caller falls back to the local engine —
 * nothing here is required for the app to work.
 *
 * The itinerary is grounded in the real destination record (its actual
 * attractions, average cost, safety notes, best season) and the model is
 * explicitly instructed to work only from that data, so it recommends
 * real known attractions rather than inventing unrelated places or named
 * hotels that don't exist in our data.
 */

const TIMEOUT_MS = 20000;

function activeProvider() {
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.GEMINI_API_KEY) return 'gemini';
  return null;
}

function buildPrompt({ destination, days, budgetTier, interests, travelers, travelStyle }) {
  const attractions = destination.attractions?.length
    ? destination.attractions.map((a) => `- ${a.name}: ${a.description || 'no description on file'}`).join('\n')
    : '- No specific attractions on file for this destination; suggest only generic local exploration.';

  return `You are YatraMitra AI, a travel planner for trips within India. Build a real, day-by-day itinerary using ONLY the destination facts given below. Do not invent attractions, landmarks, or named hotels that aren't implied by this data.

DESTINATION FACTS
Name: ${destination.name}
State: ${destination.state}
Description: ${destination.shortDescription || destination.description}
Known attractions:
${attractions}
Average cost per day in INR (moderate tier baseline): ${destination.avgCostPerDayINR}
Best season(s) to visit: ${(destination.bestSeason || []).join(', ') || 'not specified'}
Safety notes on file: ${destination.safetyNotes || 'none on file'}

TRIP REQUEST
Duration: ${days} day(s)
Budget tier: ${budgetTier}
Travelers: ${travelers}
Travel style: ${travelStyle}
Interests: ${interests.length ? interests.join(', ') : 'general sightseeing'}

Respond with ONLY valid JSON — no markdown code fences, no commentary before or after — matching exactly this shape:
{
  "itinerary": [
    {
      "day": 1,
      "morning": { "title": "string", "description": "string", "cost": 0 },
      "afternoon": { "title": "string", "description": "string", "cost": 0 },
      "evening": { "title": "string", "description": "string", "cost": 0 },
      "suggestedHotel": "a short generic description like 'a moderate-tier homestay near the town center' — never a specific named property that isn't in the facts above",
      "estimatedDistanceKm": 0,
      "localTip": "string"
    }
  ],
  "estimatedTotalCostINR": 0
}
Include exactly ${days} day object(s), numbered 1 to ${days}. All "cost" fields and "estimatedTotalCostINR" must be plain numbers (INR), scaled realistically for a ${budgetTier} budget with ${travelers} traveler(s) using the average daily cost above as your anchor. Ground every "title" and "description" in the known attractions list wherever possible.`;
}

function extractJson(text) {
  const cleaned = text.trim().replace(/^```json\s*|^```\s*|\s*```$/g, '').trim();
  return JSON.parse(cleaned);
}

function validateShape(parsed, days) {
  if (!parsed || !Array.isArray(parsed.itinerary) || parsed.itinerary.length !== days) return false;
  return parsed.itinerary.every(
    (d) => d?.morning?.title && d?.afternoon?.title && d?.evening?.title && typeof d.day === 'number'
  );
}

async function withTimeout(fn) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fn(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

async function callAnthropic(prompt) {
  return withTimeout(async (signal) => {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal,
    });
    if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`);
    const data = await res.json();
    const text = data.content?.find((b) => b.type === 'text')?.text;
    if (!text) throw new Error('No text content in Anthropic response');
    return extractJson(text);
  });
}

async function callOpenAI(prompt) {
  return withTimeout(async (signal) => {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      }),
      signal,
    });
    if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('No content in OpenAI response');
    return extractJson(text);
  });
}

async function callGemini(prompt) {
  return withTimeout(async (signal) => {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
        signal,
      }
    );
    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No content in Gemini response');
    return extractJson(text);
  });
}

/**
 * Attempts external-AI itinerary generation. Never throws to the caller —
 * returns null if no provider is configured, or the call/parse fails, so
 * aiController.js can transparently fall back to the local engine.
 */
async function generateItineraryWithExternalAI(params) {
  const provider = activeProvider();
  if (!provider) return null;

  const prompt = buildPrompt(params);
  try {
    let parsed;
    if (provider === 'anthropic') parsed = await callAnthropic(prompt);
    else if (provider === 'openai') parsed = await callOpenAI(prompt);
    else parsed = await callGemini(prompt);

    if (!validateShape(parsed, params.days)) {
      console.warn(`[externalAIService] ${provider} response failed shape validation; falling back to local engine.`);
      return null;
    }
    return {
      itinerary: parsed.itinerary,
      estimatedTotalCostINR: Math.round(parsed.estimatedTotalCostINR) || 0,
      provider,
    };
  } catch (err) {
    console.warn(`[externalAIService] ${provider} call failed (${err.message}); falling back to local engine.`);
    return null;
  }
}

function buildChatPrompt({ message, history, destinations }) {
  const context = destinations.length
    ? destinations
        .map(
          (d) =>
            `- ${d.name} (${d.state}): ${d.shortDescription || d.description}. Avg cost/day: ₹${d.avgCostPerDayINR}. Tags: ${(d.tags || []).join(', ')}.`
        )
        .join('\n')
    : 'No specific destinations from our catalog matched this query well.';

  const historyText = (history || [])
    .slice(-6)
    .map((h) => `${h.role === 'user' ? 'Traveler' : 'YatraMitra AI'}: ${h.text}`)
    .join('\n');

  return `You are YatraMitra AI, a friendly travel assistant embedded in a chat widget on the YatraMitra AI website, for trips within India. Keep replies warm, conversational and under 70 words. Only recommend destinations, stays or attractions grounded in the CATALOG DATA below — never invent specific hotel names or attractions that aren't implied by it. If the traveler asks something unrelated to Indian travel, gently redirect them back to travel planning.

CATALOG DATA (destinations that may be relevant to this query):
${context}

CONVERSATION SO FAR:
${historyText}

Traveler: ${message}

Respond with ONLY the assistant's reply text — no labels, no markdown, no JSON.`;
}

async function callAnthropicText(prompt) {
  return withTimeout(async (signal) => {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal,
    });
    if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`);
    const data = await res.json();
    const text = data.content?.find((b) => b.type === 'text')?.text;
    if (!text) throw new Error('No text content in Anthropic response');
    return text.trim();
  });
}

async function callOpenAIText(prompt) {
  return withTimeout(async (signal) => {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
      }),
      signal,
    });
    if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('No content in OpenAI response');
    return text.trim();
  });
}

async function callGeminiText(prompt) {
  return withTimeout(async (signal) => {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        signal,
      }
    );
    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No content in Gemini response');
    return text.trim();
  });
}

/**
 * Attempts an external-LLM chat reply, grounded in real catalog data passed
 * in via `destinations`. Same honest contract as generateItineraryWithExternalAI:
 * never throws, returns null (so the caller falls back to the local
 * keyword-matched reply) if no provider is configured or the call fails.
 */
async function generateChatReplyWithExternalAI({ message, history, destinations }) {
  const provider = activeProvider();
  if (!provider) return null;

  const prompt = buildChatPrompt({ message, history, destinations });
  try {
    let text;
    if (provider === 'anthropic') text = await callAnthropicText(prompt);
    else if (provider === 'openai') text = await callOpenAIText(prompt);
    else text = await callGeminiText(prompt);

    if (!text) return null;
    return { text, provider };
  } catch (err) {
    console.warn(`[externalAIService] chat via ${provider} failed (${err.message}); falling back to local reply.`);
    return null;
  }
}

module.exports = { generateItineraryWithExternalAI, generateChatReplyWithExternalAI, activeProvider };
