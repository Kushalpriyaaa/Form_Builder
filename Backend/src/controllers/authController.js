// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const airtableSvc = require('../utils/airtable');
const { airtable: airtableConfig } = require('../config/env');

const FRONTEND_SUCCESS_REDIRECT = process.env.FRONTEND_SUCCESS_REDIRECT || ''; // optional

function signJwt(user) {
  return jwt.sign({ userId: user._id, email: user.profile?.email || null }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Step 1: redirect user to Airtable OAuth authorization URL
function redirectToAirtable(req, res) {
  const clientId = airtableConfig.clientId;
  const redirectUri = airtableConfig.redirectUri;
  const state = req.query.state || ''; // optional: random state for CSRF
  const url = `https://airtable.com/oauth2/v1/authorize?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent('data.records:read data.records:write data.bases:read')}&state=${encodeURIComponent(state)}`;
  return res.redirect(url);
}

// Step 2: callback endpoint
async function airtableCallback(req, res) {
  const code = req.query.code;
  const state = req.query.state;

  if (!code) return res.status(400).send('Missing code');

  try {
    // exchange code for token
    const tokenData = await airtableSvc.exchangeCodeForToken({
      code,
      clientId: airtableConfig.clientId,
      clientSecret: airtableConfig.clientSecret,
      redirectUri: airtableConfig.redirectUri
    });

    const accessToken = tokenData.access_token || tokenData.accessToken;
    const refreshToken = tokenData.refresh_token || tokenData.refreshToken;
    const expiresIn = tokenData.expires_in || tokenData.expiresIn;

    // get user/account info
    let accountInfo = null;
    try {
      accountInfo = await airtableSvc.getAirtableAccount(accessToken);
    } catch (err) {
      // fallback: store minimal token info if whoami endpoint not available
      accountInfo = { id: null, email: null, name: null, raw: null };
    }

    // find or create user by airtable account id or email
    const airtableUserId = accountInfo?.id || null;
    let user = null;
    if (airtableUserId) user = await User.findOne({ airtableUserId });
    if (!user && accountInfo?.email) user = await User.findOne({ 'profile.email': accountInfo.email });

    if (!user) {
      user = new User({
        airtableUserId,
        profile: { name: accountInfo?.name || '', email: accountInfo?.email || '' },
        oauth: {
          accessToken,
          refreshToken,
          expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000) : null
        }
      });
      await user.save();
    } else {
      user.oauth = { accessToken, refreshToken, expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000) : null };
      if (accountInfo?.name) user.profile.name = accountInfo.name;
      if (accountInfo?.email) user.profile.email = accountInfo.email;
      await user.save();
    }

    const token = signJwt(user);

    // Option: redirect to frontend with token as query param (be careful: tokens in URL)
    if (FRONTEND_SUCCESS_REDIRECT) {
      const redirectUrl = `${FRONTEND_SUCCESS_REDIRECT}?token=${token}`;
      return res.redirect(redirectUrl);
    }

    // Otherwise return token JSON
    return res.json({ token, user: { id: user._id, profile: user.profile } });
  } catch (err) {
    console.error('Airtable callback error', err.response ? err.response.data : err.message);
    return res.status(500).json({ message: 'OAuth failed', error: err.response ? err.response.data : err.message });
  }
}

module.exports = { redirectToAirtable, airtableCallback };
