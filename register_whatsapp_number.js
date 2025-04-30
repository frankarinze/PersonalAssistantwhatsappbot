const axios = require('axios');
const readline = require('readline');

// Your provided details
const countryCode = '234';
const phoneNumber = '7069941477'; // without country code
const method = 'sms';
const cert = 'CmQKIAij+a/Ih8vAAhIGZW50OndhIgdjb3NwaXJlUM/iwsAGGkClVQgFgVDzfjisbLYjslJFBjFgoR3ZzVtXA0EUWZj9dhawoYYf5Mq8ydozGGE8qj+p8AtX8t73XtA0c5eghVwKEjBtZQjfxOmj2/Nas7CbqGopk1Pt4V3B9ypeA2OKTTrcXlNwhTZ6J5LXZz7rYfE7XJQ=';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

(async () => {
  const apiUrl = await ask('Enter your On-Premises WhatsApp API endpoint URL (e.g., https://your-server:your-port/v1/account): ');
  let pin = await ask('Enter your 6-digit PIN (leave blank if not using two-step verification): ');
  pin = pin.trim();

  const payload = {
    cc: countryCode,
    phone_number: phoneNumber,
    method,
    cert
  };
  if (pin) payload.pin = pin;

  try {
    const response = await axios.post(apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Registration response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    rl.close();
  }
})();
