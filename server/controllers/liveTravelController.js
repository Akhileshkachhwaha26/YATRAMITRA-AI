const asyncHandler = require('express-async-handler');
const Destination = require('../models/Destination');
const { getWeather, getRoute, getNearbyPlaces } = require('../services/liveTravelService');

const getDestinationLive = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id).select('name latitude longitude');
  if (!destination) { res.status(404); throw new Error('Destination not found'); }
  if (typeof destination.latitude !== 'number' || typeof destination.longitude !== 'number') {
    res.status(422); throw new Error('Live location data is unavailable for this destination');
  }
  let weather = null; let nearbyPlaces = null;
  try { weather = await getWeather(destination); } catch (err) { console.warn('[live] weather:', err.message); }
  try { nearbyPlaces = await getNearbyPlaces(destination); } catch (err) { console.warn('[live] places:', err.message); }
  res.json({ success: true, data: { destination: { name: destination.name, latitude: destination.latitude, longitude: destination.longitude }, weather, nearbyPlaces } });
});

const getRouteToDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id).select('name latitude longitude');
  if (!destination) { res.status(404); throw new Error('Destination not found'); }
  const fromLat = Number(req.query.fromLat), fromLng = Number(req.query.fromLng);
  if (!Number.isFinite(fromLat) || !Number.isFinite(fromLng)) { res.status(400); throw new Error('fromLat and fromLng are required'); }
  if (Math.abs(fromLat) > 90 || Math.abs(fromLng) > 180) { res.status(400); throw new Error('Invalid origin coordinates'); }
  const mode = ['driving', 'walking', 'cycling'].includes(req.query.mode) ? req.query.mode : 'driving';
  let route;
  try { route = await getRoute({ fromLat, fromLng, toLat: destination.latitude, toLng: destination.longitude, mode }); }
  catch (err) { res.status(503); throw new Error('Live route service is temporarily unavailable'); }
  res.json({ success: true, data: { destination: destination.name, route } });
});

module.exports = { getDestinationLive, getRouteToDestination };
