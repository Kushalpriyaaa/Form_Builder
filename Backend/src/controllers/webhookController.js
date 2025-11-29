// src/controllers/webhookController.js
const ResponseModel = require('../models/Response');
const { airtable: airtableConfig } = require('../config/env');

// Basic webhook validation by shared header secret
function verifyWebhook(req) {
  const headerSecret = req.headers['x-webhook-secret'] || req.headers['x-airtable-signature'] || '';
  if (!airtableConfig.webhookSecret) return true; // no secret configured — accept (dev)
  return headerSecret && headerSecret === airtableConfig.webhookSecret;
}

async function handleAirtableWebhook(req, res) {
  try {
    if (!verifyWebhook(req)) return res.status(401).json({ ok: false, message: 'Invalid webhook signature' });

    const payload = req.body;
    // Airtable webhook structure varies. Expecting something like { event: 'record.updated', recordId, baseId, tableId, fields }
    const eventType = payload.eventType || payload.type || (payload.event && payload.event.type) || null;

    // Example minimal handling:
    if (payload.recordId) {
      const recordId = payload.recordId;
      // find db record by airtableRecordId
      const doc = await ResponseModel.findOne({ airtableRecordId: recordId });
      if (doc) {
        if (eventType && eventType.includes('deleted')) {
          doc.status = 'deletedInAirtable';
          await doc.save();
        } else {
          // update answers/fields mapping if provided
          if (payload.fields) {
            doc.answers = { ...doc.answers, ...payload.fields };
            await doc.save();
          }
        }
      } else {
        // If not found, optionally create or ignore
        console.log('Webhook: record not found in DB for id', recordId);
      }
    } else if (Array.isArray(payload.records)) {
      // bulk handling
      for (const r of payload.records) {
        if (!r.id) continue;
        const doc = await ResponseModel.findOne({ airtableRecordId: r.id });
        if (doc) {
          if (r.type && r.type === 'deleted') {
            doc.status = 'deletedInAirtable';
            await doc.save();
          } else {
            if (r.fields) {
              doc.answers = { ...doc.answers, ...r.fields };
              await doc.save();
            }
          }
        }
      }
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Webhook handler error', err);
    res.status(500).json({ ok: false, error: err.message || err });
  }
}

module.exports = { handleAirtableWebhook };
