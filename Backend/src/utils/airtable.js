const axios = require("axios");

const TOKEN_URL = "https://airtable.com/oauth2/v1/token";
const API = "https://api.airtable.com/v0";
const META = "https://api.airtable.com/v0/meta";

async function exchangeCodeForToken({ code, clientId, clientSecret, redirectUri }) {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("redirect_uri", redirectUri);

  const res = await axios.post(TOKEN_URL, params);
  return res.data;
}

async function getAirtableAccount(token) {
  try {
    const res = await axios.get(`${META}/whoami`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (e) {
    return { id: null, email: null };
  }
}

async function listBases(token) {
  const res = await axios.get(`${META}/bases`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

async function listTables(token, baseId) {
  const res = await axios.get(`${META}/bases/${baseId}/tables`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

module.exports = {
  exchangeCodeForToken,
  getAirtableAccount,
  listBases,
  listTables,
};
