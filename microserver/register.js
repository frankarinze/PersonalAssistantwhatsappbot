const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Mock POST /v1/account endpoint
app.post('/v1/account', (req, res) => {
  const { cc, phone_number, method, cert, pin } = req.body;

  // Validate required fields
  if (!cc || !phone_number || !method || !cert) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Simulate registration logic
  if (
    cc === process.env.COUNTRY_CODE &&
    phone_number === process.env.PHONE_NUMBER &&
    method === process.env.METHOD &&
    cert === process.env.CERT &&
    (process.env.PIN === '' || pin === process.env.PIN)
  ) {
    return res.status(201).json({
      account: [{ vname: 'mock-decoded-vname-from-cert' }],
      message: 'Mock registration successful (local microserver)'
    });
  } else {
    return res.status(400).json({ error: 'Registration details do not match .env' });
  }
});

app.listen(PORT, () => {
  console.log(`Mock WhatsApp registration microserver running on port ${PORT}`);
}); 