const Form = require("../models/Form");

async function createForm(req, res) {
  const ownerId = req.user?.userId;
  if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

  const data = req.body;

  if (!data.airtableBaseId || !data.airtableTableId)
    return res.status(400).json({ message: "Missing Airtable base/table" });

  const form = new Form({
    ownerId,
    title: data.title || "Untitled Form",
    airtableBaseId: data.airtableBaseId,
    airtableTableId: data.airtableTableId,
    airtableTableName: data.airtableTableName || "",
    questions: data.questions || [],
  });

  await form.save();
  res.status(201).json({ form });
}

async function getForm(req, res) {
  const form = await Form.findById(req.params.formId);
  if (!form) return res.status(404).json({ message: "Form not found" });
  res.json({ form });
}

async function updateForm(req, res) {
  const form = await Form.findByIdAndUpdate(
    req.params.formId,
    { ...req.body, updatedAt: Date.now() },
    { new: true }
  );

  if (!form) return res.status(404).json({ message: "Form not found" });
  res.json({ form });
}

async function deleteForm(req, res) {
  await Form.findByIdAndDelete(req.params.formId);
  res.json({ message: "Deleted" });
}

module.exports = { createForm, getForm, updateForm, deleteForm };
