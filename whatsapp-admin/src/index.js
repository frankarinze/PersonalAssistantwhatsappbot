const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER = process.env.WHATSAPP_PHONE_NUMBER;
const CERTIFICATE_PATH = process.env.WHATSAPP_CERTIFICATE_PATH;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get account status
app.get('/status', async (req, res) => {
  try {
    const response = await axios.get(`${WHATSAPP_API_URL}/v1/account/status`, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload certificate
app.post('/upload-certificate', async (req, res) => {
  try {
    const { certificate } = req.body;
    if (!certificate) {
      return res.status(400).json({ error: 'Certificate is required' });
    }

    // Save the certificate
    const certificatePath = path.join(__dirname, '../../whatsapp/certificates/certificate.pem');
    fs.writeFileSync(certificatePath, certificate);

    // Verify the certificate
    const response = await axios.post(`${WHATSAPP_API_URL}/v1/account/verify`, {
      certificate: certificate
    }, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send test message
app.post('/send-test', async (req, res) => {
  try {
    const { to, message } = req.body;
    const response = await axios.post(`${WHATSAPP_API_URL}/v1/messages`, {
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: { body: message }
    }, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`WhatsApp Admin Service running on port ${PORT}`);
}); 