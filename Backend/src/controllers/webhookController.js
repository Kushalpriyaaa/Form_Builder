const Response = require("../models/Response");

async function handleAirtableWebhook(req, res) {
  const event = req.body;

  // If deleted
  if (event.type === "record.deleted") {
    await Response.updateMany(
      { airtableRecordId: event.recordId },
      { status: "deletedInAirtable" }
    );
  }

  // If updated
  if (event.type === "record.updated") {
    await Response.updateMany(
      { airtableRecordId: event.record.id },
      {
        answers: event.record.fields,
        updatedAt: new Date(),
      }
    );
  }

  res.json({ ok: true });
}

module.exports = { handleAirtableWebhook };
