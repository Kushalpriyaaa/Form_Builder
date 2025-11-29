const Response = require("../models/Response");
const Form = require("../models/Form");

// Validation helper
function validate(form, answers) {
  let errors = [];

  for (const q of form.questions) {
    const value = answers[q.questionKey];

    if (q.required && (value === undefined || value === "")) {
      errors.push({ field: q.questionKey, message: "Required" });
    }

    if (q.type === "single_select" && value && !q.options.includes(value)) {
      errors.push({ field: q.questionKey, message: "Invalid option" });
    }

    if (q.type === "multi_select" && Array.isArray(value)) {
      for (let v of value) {
        if (!q.options.includes(v)) {
          errors.push({ field: q.questionKey, message: "Invalid option" });
        }
      }
    }
  }

  return errors;
}

async function submitResponse(req, res) {
  const form = await Form.findById(req.params.formId);
  if (!form) return res.status(404).json({ message: "Form not found" });

  const answers = req.body.answers || {};
  const errors = validate(form, answers);

  if (errors.length) return res.status(400).json({ errors });

  const response = new Response({
    formId: req.params.formId,
    answers,
  });

  await response.save();
  res.status(201).json({ response });
}

async function listResponses(req, res) {
  const responses = await Response.find({ formId: req.params.formId }).sort({
    createdAt: -1,
  });
  res.json({ responses });
}

async function getResponse(req, res) {
  const response = await Response.findById(req.params.responseId);
  if (!response) return res.status(404).json({ message: "Not found" });
  res.json({ response });
}

module.exports = { submitResponse, listResponses, getResponse };
