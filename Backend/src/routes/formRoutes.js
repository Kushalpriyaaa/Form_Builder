// src/routes/formRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createForm, getForm, updateForm, deleteForm } = require('../controllers/formController');

router.post('/', auth, createForm);
router.get('/:formId', getForm);
router.put('/:formId', auth, updateForm);
router.delete('/:formId', auth, deleteForm);

module.exports = router;
