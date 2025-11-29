// src/config/env.js
// simple env validation & export (optional)
const required = ['MONGO_URI', 'JWT_SECRET', 'AIRTABLE_CLIENT_ID', 'AIRTABLE_CLIENT_SECRET', 'AIRTABLE_REDIRECT_URI'];
const missing = required.filter((k) => !process.env[k]);

if (missing.length) {
  console.warn('⚠️ Missing env variables:', missing.join(', '));
  // Do not exit here — allow some routes (like dev) to run if needed.
}

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  airtable: {
    clientId: process.env.AIRTABLE_CLIENT_ID,
    clientSecret: process.env.AIRTABLE_CLIENT_SECRET,
    redirectUri: process.env.AIRTABLE_REDIRECT_URI,
    webhookSecret: process.env.WEBHOOK_SECRET,
  },
};
