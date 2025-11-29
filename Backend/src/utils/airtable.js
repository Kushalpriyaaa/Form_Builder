// src/utils/airtable.js
const axios = require('axios');

const AIRTABLE_OAUTH_TOKEN_URL = 'https://airtable.com/oauth2/v1/token';
const AIRTABLE_API_BASE = 'https://api.airtable.com/v0';

async function exchangeCodeForToken({ code, clientId, clientSecret, redirectUri }) {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUri);

  const res = await axios.post(AIRTABLE_OAUTH_TOKEN_URL, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return res.data; // access_token, refresh_token, expires_in
}

async function refreshAccessToken({ refreshToken, clientId, clientSecret }) {
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);

  const res = await axios.post(AIRTABLE_OAUTH_TOKEN_URL, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return res.data;
}

async function getAirtableAccount(accessToken) {
  // Airtable has an endpoint to get current user/account info via metadata or accounts endpoint in some versions;
  // If unavailable, use token to call endpoints like list bases if permissioned. For safety, call /meta (if API supports).
  // We'll attempt a simple call to the user endpoint — if it fails adapt.
  const res = await axios.get('https://api.airtable.com/v0/meta/whoami', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data;
}

async function listBases(accessToken) {
  // Airtable's API for listing bases is in metadata endpoints (beta). Alternative: store base IDs from user.
  const res = await axios.get('https://api.airtable.com/v0/meta/bases', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data;
}

async function listTables(accessToken, baseId) {
  const res = await axios.get(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data;
}

async function getTableFields(accessToken, baseId, tableId) {
  const res = await axios.get(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${tableId}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data;
}

async function createRecord(accessToken, baseId, tableNameOrId, fieldsPayload) {
  // fieldsPayload should be object: { FieldName: value, ... }
  const url = `${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableNameOrId)}`;
  const res = await axios.post(url, { fields: fieldsPayload }, {
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
  });
  return res.data;
}

module.exports = {
  exchangeCodeForToken,
  refreshAccessToken,
  getAirtableAccount,
  listBases,
  listTables,
  getTableFields,
  createRecord
};
