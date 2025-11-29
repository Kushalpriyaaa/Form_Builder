// src/models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  airtableUserId: { type: String, index: true },
  profile: {
    name: String,
    email: String,
    avatarUrl: String,
  },
  oauth: {
    accessToken: String,
    refreshToken: String,
    expiresAt: Date,
  },
  createdAt: { type: Date, default: Date.now },
});

// Prevent OverwriteModelError during hot reloads
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
