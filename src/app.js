const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const nlu = require('./nlu');
const calendar = require('./calendar');
const auth = require('./auth');

dotenv.config();

const app = express();
app.use(express.json());

const WEBHOOK_VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

console.log(WHATSAPP_ACCESS_TOKEN)

const ADMIN_NOTIFY_NUMBER = '2348139094700';

async function notifyAdmin(action, to, details) {
  const adminMsg = `NOTIFY: Sending ${action} to ${to}\nDetails: ${details}`;
  await axios({
    url: `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    method: 'post',
    headers: {
      'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      messaging_product: 'whatsapp',
      to: ADMIN_NOTIFY_NUMBER,
      type: 'text',
      text: { body: adminMsg }
    })
  });
}

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

  if (!entry || entry.length === 0) {
    return res.status(400).send('Invalid Request')
  }

  const changes = entry[0].changes

  if (!changes || changes.length === 0) {
    return res.status(400).send('Invalid Request')
  }

  const statuses = changes[0].value.statuses ? changes[0].value.statuses[0] : null
  const messages = changes[0].value.messages ? changes[0].value.messages[0] : null

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
    
    console.log(JSON.stringify(messages, null, 2))
  }
  
  res.status(200).send('Webhook processed')
})

async function sendMessage(to, body) {
  await notifyAdmin('text message', to, body);
  await axios({
    url: `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    method: 'post',
    headers: {
      'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: {
        body
      }
    })
  })
}

async function replyMessage(to, body, messageId) {
  await notifyAdmin('reply message', to, body);
  await axios({
    url: `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    method: 'post',
    headers: {
      'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: {
        body
      },
      context: {
        message_id: messageId
      }
    })
  })
}

async function sendList(to) {
  await notifyAdmin('list message', to, 'Sending interactive list');
  await axios({
    url: `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    method: 'post',
    headers: {
      'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'list',
        header: {
          type: 'text',
          text: 'Message Header'
        },
        body: {
          text: 'This is a interactive list message'
        },
        footer: {
          text: 'This is the message footer'
        },
        action: {
          button: 'Tap for the options',
          sections: [
            {
              title: 'First Section',
              rows: [
                {
                  id: 'first_option',
                  title: 'First option',
                  description: 'This is the description of the first option'
                },
                {
                  id: 'second_option',
                  title: 'Second option',
                  description: 'This is the description of the second option'
                }
              ]
            },
            {
              title: 'Second Section',
              rows: [
                {
                  id: 'third_option',
                  title: 'Third option'
                }
              ]
            }
          ]
        }
      }
    })
  })
}

async function sendReplyButtons(to) {
  await notifyAdmin('reply buttons', to, 'Sending interactive reply buttons');
  await axios({
    url: `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    method: 'post',
    headers: {
      'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        header: {
          type: 'text',
          text: 'Message Header'
        },
        body: {
          text: 'This is a interactive reply buttons message'
        },
        footer: {
          text: 'This is the message footer'
        },
        action: {
          buttons: [
            {
              type: 'reply',
              reply: {
                id: 'first_button',
                title: 'First Button'
              }
            },
            {
              type: 'reply',
              reply: {
                id: 'second_button',
                title: 'Second Button'
              }
            }
          ]
        }
      }
    })
  })
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`WhatsApp Meeting Assistant Bot running on port ${PORT}`);
}); 