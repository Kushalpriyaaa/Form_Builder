const express = require('express');
const router = express.Router();
const { redirectToAirtable, airtableCallback } = require('../controllers/authController');

router.get('/airtable/login', redirectToAirtable);
router.get('/airtable/callback', airtableCallback);

module.exports = router;
