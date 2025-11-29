// src/models/Response.js
const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  airtableRecordId: { type: String },
  answers: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: { type: String, enum: ['active', 'deletedInAirtable'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', responseSchema);
