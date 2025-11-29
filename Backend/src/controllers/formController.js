// src/controllers/formController.js
const Form = require('../models/Form');

async function createForm(req, res) {
  const ownerId = req.user.userId;
  const payload = req.body;
  if (!payload.airtableBaseId || !payload.airtableTableId) return res.status(400).json({ message: 'Missing base/table' });

  const form = new Form({
    ownerId,
    title: payload.title || 'Untitled',
    airtableBaseId: payload.airtableBaseId,
    airtableTableId: payload.airtableTableId,
    airtableTableName: payload.airtableTableName || '',
    questions: payload.questions || []
  });

  await form.save();
  res.status(201).json({ form });
}

async function getForm(req, res) {
  const { formId } = req.params;
  const form = await Form.findById(formId);
  if (!form) return res.status(404).json({ message: 'Form not found' });
  res.json({ form });
}

async function updateForm(req, res) {
  const { formId } = req.params;
  const updates = req.body;
  const form = await Form.findByIdAndUpdate(formId, { ...updates, updatedAt: Date.now() }, { new: true });
  if (!form) return res.status(404).json({ message: 'Form not found' });
  res.json({ form });
}

async function deleteForm(req, res) {
  const { formId } = req.params;
  await Form.findByIdAndDelete(formId);
  res.json({ message: 'Deleted' });
}

module.exports = { createForm, getForm, updateForm, deleteForm };
