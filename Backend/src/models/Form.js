// src/models/Form.js
const mongoose = require('mongoose');

// Condition Schema
const conditionSchema = new mongoose.Schema({
  questionKey: { type: String, required: true },
  operator: { type: String, enum: ['equals', 'notEquals', 'contains'], required: true },
  value: { type: mongoose.Schema.Types.Mixed }
}, { _id: false });

// Conditional Rules Schema
const conditionalRulesSchema = new mongoose.Schema({
  logic: { type: String, enum: ['AND', 'OR'], default: 'AND' },
  conditions: { type: [conditionSchema], default: [] }
}, { _id: false });

// Question Schema
const questionSchema = new mongoose.Schema({
  questionKey: { type: String, required: true },
  airtableFieldId: { type: String, required: true },
  label: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['short_text', 'long_text', 'single_select', 'multi_select', 'attachment'], 
    required: true 
  },
  required: { type: Boolean, default: false },
  options: { type: [String], default: [] },
  conditionalRules: { type: conditionalRulesSchema, default: null }
}, { _id: false });

// Main Form Schema
const formSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Untitled Form' },
  airtableBaseId: { type: String, required: true },
  airtableTableId: { type: String, required: true },
  airtableTableName: { type: String },
  questions: { type: [questionSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Prevent OverwriteModelError
module.exports = mongoose.models.Form || mongoose.model('Form', formSchema);
