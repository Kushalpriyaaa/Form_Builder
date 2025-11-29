// src/controllers/responseController.js
const ResponseModel = require('../models/Response');
const Form = require('../models/Form');
const airtableSvc = require('../utils/airtable');

// minimal validation helper
function validateAnswers(form, answers) {
  const errors = [];
  for (const q of form.questions) {
    const val = answers[q.questionKey];
    if (q.required && (val === undefined || val === null || val === '')) {
      errors.push({ questionKey: q.questionKey, message: 'Required' });
    }
    if (val && (q.type === 'single_select' || q.type === 'multi_select')) {
      const arr = Array.isArray(val) ? val : [val];
      for (const v of arr) {
        if (!q.options.includes(v)) errors.push({ questionKey: q.questionKey, message: `Invalid option ${v}` });
      }
    }
  }
  return errors;
}

async function submitResponse(req, res) {
  const { formId } = req.params;
  const answers = req.body.answers || {};

  const form = await Form.findById(formId);
  if (!form) return res.status(404).json({ message: 'Form not found' });

  const errors = validateAnswers(form, answers);
  if (errors.length) return res.status(400).json({ errors });

  // Build Airtable fields map (questionKey -> airtableFieldName or ID)
  const fieldsPayload = {};
  for (const q of form.questions) {
    const val = answers[q.questionKey];
    if (val === undefined) continue;
    // Map based on type — this is a simple mapping; adapt as needed
    if (q.type === 'attachment') {
      // attachments: expecting array of { url, filename } or URLs; Airtable expects [{url: "..."}]
      fieldsPayload[q.airtableFieldId || q.label] = Array.isArray(val) ? val : [val];
    } else if (q.type === 'multi_select') {
      fieldsPayload[q.airtableFieldId || q.label] = Array.isArray(val) ? val : [val];
    } else {
      fieldsPayload[q.airtableFieldId || q.label] = val;
    }
  }

  // fetch user to get access token
  // NOTE: req.user.userId is set by JWT; use it to find access token if stored
  // For now, attempt to use backend server token stored elsewhere or require client to provide accessToken (not recommended)
  // We'll not block DB save if Airtable fails — store DB and return both statuses.

  const responseDoc = new ResponseModel({ formId, answers });
  await responseDoc.save();

  // Attempt to save to Airtable (best-effort)
  try {
    // In real flow we need user's access token. Here we assume server has necessary token (e.g., service account)
    // If you have user's stored oauth, fetch it and use.
    // Example: const user = await User.findById(form.ownerId); const accessToken = user.oauth.accessToken;
    const accessToken = null;
    if (accessToken) {
      const airtableResp = await airtableSvc.createRecord(accessToken, form.airtableBaseId, form.airtableTableName || form.airtableTableId, fieldsPayload);
      responseDoc.airtableRecordId = airtableResp.id || airtableResp?.records?.[0]?.id;
      await responseDoc.save();
    }
  } catch (err) {
    console.warn('Airtable save failed (non-blocking):', err.message || err);
  }

  res.status(201).json({ response: responseDoc });
}

async function listResponses(req, res) {
  const { formId } = req.params;
  const responses = await ResponseModel.find({ formId }).sort({ createdAt: -1 }).limit(100);
  res.json({ responses });
}

async function getResponse(req, res) {
  const { responseId } = req.params;
  const response = await ResponseModel.findById(responseId);
  if (!response) return res.status(404).json({ message: 'Not found' });
  res.json({ response });
}

module.exports = { submitResponse, listResponses, getResponse };
