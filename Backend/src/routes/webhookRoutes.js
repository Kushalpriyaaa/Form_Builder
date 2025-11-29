// src/routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const { handleAirtableWebhook } = require('../controllers/webhookController');

// Airtable webhook (POST)
router.post('/', express.json({ limit: '1mb' }), handleAirtableWebhook);

module.exports = router;
