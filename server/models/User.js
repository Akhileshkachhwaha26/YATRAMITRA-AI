const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['traveler', 'provider', 'admin'], default: 'traveler' },
    avatar: { type: String, default: '' },
    preferredLanguage: { type: String, default: 'en' },
    interests: [{ type: String }],
    travelStyle: { type: String, enum: ['solo', 'couple', 'family', 'friends', 'business'], default: 'solo' },
    budgetPreference: { type: String, enum: ['budget', 'moderate', 'premium', 'luxury'], default: 'moderate' },
    isProvider: { type: Boolean, default: false },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function matchPassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
