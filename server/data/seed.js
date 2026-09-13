/* eslint-disable no-console */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Destination = require('../models/Destination');
const Hotel = require('../models/Hotel');
const Experience = require('../models/Experience');
const Business = require('../models/Business');
const Trip = require('../models/Trip');
const SavedItem = require('../models/SavedItem');

const destinationSeed = require('./destinations');

const HOTEL_NAMES = ['Heritage Residency', 'Riverside Retreat', 'The Local Nest', 'Sunrise Homestay', 'Grand Palace Inn'];
const EXP_TITLES = {
  'food-tour': 'Street Food Walking Tour',
  handicrafts: 'Local Artisan Craft Workshop',
  cultural: 'Heritage Walk with a Local Guide',
  'village-tourism': 'Village Life Immersion Day',
  trekking: 'Guided Nature Trek',
  photography: 'Golden Hour Photography Walk',
  festival: 'Local Festival Experience',
  'cooking-class': 'Traditional Home-Cooking Class',
  nature: 'Nature & Birdwatching Walk',
  wildlife: 'Guided Wildlife Safari',
  spiritual: 'Sunrise Temple & Ghat Visit',
};

function pick(arr, i) {
  return arr[i % arr.length];
}

async function seed() {
  await connectDB();
  console.log('Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Destination.deleteMany({}),
    Hotel.deleteMany({}),
    Experience.deleteMany({}),
    Business.deleteMany({}),
    Trip.deleteMany({}),
    SavedItem.deleteMany({}),
  ]);

  console.log('Seeding destinations...');
  const created = await Destination.insertMany(
    destinationSeed.map(({ alternativeToRef, ...d }) => d)
  );

  const bySlug = Object.fromEntries(created.map((d) => [d.slug, d]));
  // Resolve hidden-gem -> popular-destination links
  await Promise.all(
    destinationSeed.map(async (d) => {
      if (d.alternativeToRef && bySlug[d.alternativeToRef]) {
        await Destination.findByIdAndUpdate(bySlug[d.slug]._id, { alternativeTo: bySlug[d.alternativeToRef]._id });
      }
    })
  );

  console.log('Seeding demo users...');
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@yatramitra.ai',
    password: 'Admin@123',
    role: 'admin',
    preferredLanguage: 'en',
  });
  const provider = await User.create({
    name: 'Ramesh Sharma',
    email: 'provider@yatramitra.ai',
    password: 'Provider@123',
    role: 'provider',
    isProvider: true,
    preferredLanguage: 'hi',
  });
  const traveler = await User.create({
    name: 'Aisha Verma',
    email: 'traveler@yatramitra.ai',
    password: 'Traveler@123',
    role: 'traveler',
    interests: ['Nature', 'Culture', 'Food'],
    travelStyle: 'friends',
    budgetPreference: 'moderate',
    preferredLanguage: 'en',
  });

  console.log('Seeding hotels, experiences and businesses...');
  const priceTierBase = { budget: 900, moderate: 2200, premium: 5500, luxury: 12000 };
  const categories = Object.keys(EXP_TITLES);

  for (const dest of created) {
    // 2-3 hotels per destination
    const hotelsForDest = [0, 1, 2].map((i) => {
      const tier = i === 0 ? dest.budgetLevel : pick(['budget', 'moderate', 'premium', 'luxury'], i);
      return {
        name: `${pick(HOTEL_NAMES, i)} — ${dest.name.split(' ')[0]}`,
        destination: dest._id,
        destinationName: dest.name,
        images: [],
        description: `A comfortable ${tier}-tier stay close to ${dest.name}, ideal for travelers exploring the area.`,
        rating: Math.round((3.8 + Math.random() * 1.1) * 10) / 10,
        reviewCount: Math.floor(50 + Math.random() * 900),
        pricePerNightINR: Math.round(priceTierBase[tier] * (0.85 + Math.random() * 0.3)),
        priceTier: tier,
        amenities: ['Free Wi-Fi', 'Breakfast included', '24/7 front desk', i === 2 ? 'Pool' : 'Local guided tours'],
        isEcoFriendly: i === 1,
        isLocalBusiness: i !== 2,
        address: `Near ${dest.name}, ${dest.state}`,
      };
    });
    await Hotel.insertMany(hotelsForDest);

    // 2 experiences per destination
    const expCategories = [categories[created.indexOf(dest) % categories.length], categories[(created.indexOf(dest) + 3) % categories.length]];
    const expsForDest = expCategories.map((cat, i) => ({
      title: `${EXP_TITLES[cat]} — ${dest.name.split(' ')[0]}`,
      category: cat,
      destination: dest._id,
      destinationName: dest.name,
      images: [],
      description: `${EXP_TITLES[cat]} led by a local host, showcasing authentic ${dest.name} traditions and everyday life.`,
      priceINR: Math.round(400 + Math.random() * 2200),
      durationHours: [2, 3, 4, 6][i % 4],
      rating: Math.round((4.2 + Math.random() * 0.7) * 10) / 10,
      reviewCount: Math.floor(20 + Math.random() * 400),
      host: `${['Ravi', 'Meena', 'Suresh', 'Priya', 'Anil'][i % 5]}'s Local Tours`,
      hostIsLocal: true,
      groupSize: 'Up to 8 people',
    }));
    await Experience.insertMany(expsForDest);

    // 1 local business (guide) per destination, owned by demo provider for the first 3
    const idx = created.indexOf(dest);
    const business = await Business.create({
      owner: idx < 3 ? provider._id : undefined,
      name: `${dest.name.split(' ')[0]} Local Guides Collective`,
      type: pick(['guide', 'homestay', 'restaurant', 'artisan', 'transport'], idx),
      destination: dest._id,
      destinationName: dest.name,
      description: `A community-run local service supporting sustainable tourism around ${dest.name}.`,
      contact: { phone: '+91-90000-00000', email: `hello@${dest.slug}.example.com` },
      languagesSpoken: ['English', 'Hindi'],
      rating: Math.round((4.0 + Math.random() * 0.9) * 10) / 10,
      reviewCount: Math.floor(10 + Math.random() * 150),
      verified: idx % 2 === 0,
      status: 'approved',
    });
    if (idx < 3) {
      provider.businessId = business._id;
    }
  }
  await provider.save();

  console.log('Seeding a sample trip for the demo traveler...');
  const sampleDest = created.find((d) => d.slug === 'bhedaghat-dhuandhar-falls');
  await Trip.create({
    user: traveler._id,
    destination: sampleDest._id,
    destinationName: sampleDest.name,
    title: `${sampleDest.name} — 3-Day friends Trip`,
    startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
    travelers: 3,
    budgetTier: 'moderate',
    estimatedTotalCostINR: 18500,
    interests: ['Nature', 'Photography'],
    travelStyle: 'friends',
    status: 'upcoming',
    generatedBy: 'local-engine',
    itinerary: [
      {
        day: 1,
        morning: { title: 'Marble Rocks boat ride', description: 'Glide past the marble cliffs at sunrise.', cost: 400 },
        afternoon: { title: 'Dhuandhar Falls', description: 'View the falls and enjoy local snacks nearby.', cost: 600 },
        evening: { title: 'Local dinner', description: 'Try regional Jabalpur cuisine.', cost: 900 },
        suggestedHotel: 'Riverside Retreat — Bhedaghat',
        estimatedDistanceKm: 12,
        localTip: 'Wear a life jacket during the boat ride.',
      },
    ],
  });

  console.log('\n✅ Seed complete!');
  console.log('Demo credentials:');
  console.log('  Admin:    admin@yatramitra.ai / Admin@123');
  console.log('  Provider: provider@yatramitra.ai / Provider@123');
  console.log('  Traveler: traveler@yatramitra.ai / Traveler@123');

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
