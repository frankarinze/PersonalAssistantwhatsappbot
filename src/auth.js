const users = {};
const { google } = require('googleapis');
const querystring = require('querystring');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

function getUser(phone) {
  return users[phone];
}

function getGoogleOAuthUrl(phone) {
  const state = phone;
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/userinfo.email',
  ];
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state,
    prompt: 'consent',
  });
}

async function handleOAuthCallback(req, res) {
  const code = req.query.code;
  const phone = req.query.state;
  if (!code || !phone) return res.status(400).send('Missing code or state');
  try {
    const { tokens } = await oauth2Client.getToken(code);
    users[phone] = { tokens };
    res.send('✅ Google account connected! You can return to WhatsApp.');
  } catch (err) {
    res.status(500).send('OAuth error: ' + err.message);
  }
}

module.exports = { getUser, getGoogleOAuthUrl, handleOAuthCallback }; 