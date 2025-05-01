const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const nlu = require('./nlu');
const calendar = require('./calendar');
const auth = require('./auth');
const session = require('express-session');
const passport = require('./auth/google');
const { createGoogleCalendarEventWithMeet } = require('./services/googleService');
const { sendMessage, replyMessage, sendList, sendReplyButtons } = require('./messages/messageHandlers');

dotenv.config();

const app = express();
app.use(express.json());

const WEBHOOK_VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;

console.log(WHATSAPP_ACCESS_TOKEN)


app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Google SSO routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.send('Google authentication successful! You can close this window.');
  }
);

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.get('/', (req, res) => {
  res.send('Whatsapp with Node.js and Webhooks')
})


app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode']
  const challenge = req.query['hub.challenge']
  const token = req.query['hub.verify_token']

  if (mode && token === WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge)
  } else {
    res.sendStatus(403)
  }
})

app.post('/webhook', async (req, res) => {
  const { entry } = req.body
  // console.log('checkentry',entry)

  if (!entry || entry.length === 0) {
    return res.status(400).send('Invalid Request')
  }

  const changes = entry[0].changes

  if (!changes || changes.length === 0) {
    return res.status(400).send('Invalid Request')
  }
  
  const statuses = changes[0].value.statuses ? changes[0].value.statuses[0] : null
  const messages = changes[0].value.messages ? changes[0].value.messages[0] : null
  console.log('messages', messages)

  if (statuses) {
    // Handle message status
    console.log(`
      MESSAGE STATUS UPDATE:
      ID: ${statuses.id},
      STATUS: ${statuses.status}
    `)
  }

  if (messages) {
    // Handle received messages
    if (messages.type === 'text') {
      if (messages.text.body.toLowerCase() === 'hello') {
        replyMessage(messages.from, 'Hello. How are you?', messages.id)
      }

      if (messages.text.body.toLowerCase() === 'list') {
        sendList(messages.from)
      }

      if (messages.text.body.toLowerCase() === 'buttons') {
        sendReplyButtons(messages.from)
      }
    }

    if (messages.type === 'interactive') {
      if (messages.interactive.type === 'list_reply') {
        sendMessage(messages.from, `You selected the option with ID ${messages.interactive.list_reply.id} - Title ${messages.interactive.list_reply.title}`)
      }

      if (messages.interactive.type === 'button_reply') {
        sendMessage(messages.from, `You selected the button with ID ${messages.interactive.button_reply.id} - Title ${messages.interactive.button_reply.title}`)
      }
    }
    
    // Log message details in a readable format
    console.log('--- Incoming WhatsApp Message ---');
    // console.log('From:', messages.from);
    // console.log('Timestamp:', messages.timestamp);
    if (messages.type === 'text') {
      console.log('Text:', messages.text.body);
    } else {
      console.log('Message Type:', messages.type);
      console.log('Message Content:', messages[messages.type]);
    }
    // console.log('Full message object:', JSON.stringify(messages, null, 2));
  }
  
  res.status(200).send('Webhook processed')
})

// Example: POST /create-meet-event
app.post('/create-meet-event', async (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).send('Not authenticated');
  }

  const eventDetails = {
    summary: req.body.summary || 'Test Meeting',
    description: req.body.description || 'Created via API',
    start: req.body.start || new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    end: req.body.end || new Date(Date.now() + 7200000).toISOString(),     // 2 hours from now
    attendees: req.body.attendees || [], // e.g., [{ email: 'someone@gmail.com' }]
  };

  try {
    const event = await createGoogleCalendarEventWithMeet(req.user.accessToken, eventDetails);
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`WhatsApp Meeting Assistant Bot running on port ${PORT}`);
}); 