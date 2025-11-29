// src/routes/responseRoutes.js
const express = require('express');
const router = express.Router();
const { submitResponse, listResponses, getResponse } = require('../controllers/responseController');

router.post('/:formId/responses', submitResponse);
router.get('/:formId/responses', listResponses);
router.get('/responses/:responseId', getResponse);

module.exports = router;
