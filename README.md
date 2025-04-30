# WhatsApp Meeting Assistant Bot

A WhatsApp bot for scheduling and managing Google Meet meetings with Google Calendar integration.

## Features
- Natural language meeting scheduling via WhatsApp
- Google OAuth onboarding per user
- Google Calendar conflict checking (stub)
- Google Meet link creation (stub)
- Human-like conversational flow

## Prerequisites
- Node.js 16+
- WhatsApp Business Cloud API setup
- Google Cloud project with OAuth credentials
- (Optional) OpenAI/DeepSeek API key for advanced NLU

## Setup
1. Clone this repo and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root directory:
   ```env
   WHATSAPP_TOKEN=your_whatsapp_api_token_here
   WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
   PORT=3000

   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   GOOGLE_REDIRECT_URI=https://your-server.com/oauth2callback

   OPENAI_API_KEY=your_openai_or_deepseek_api_key_here
   ```
3. Set your WhatsApp webhook URL in the Meta Developer Portal to `https://your-server.com/webhook` and use the verify token `whatsapp_meeting_assistant_verify`.
4. Set up your Google OAuth consent screen and credentials in the Google Cloud Console.

## Running the Bot
```bash
npm start
```

## How it Works
- User sends a message to your WhatsApp number
- Bot onboards new users and requests Google authentication
- After authentication, bot parses meeting requests and (soon) manages Google Calendar/Meet

## Extending
- Implement Google Calendar/Meet logic in `src/calendar.js`
- Integrate DeepSeek/OpenAI in `src/nlu.js` for advanced NLU
- Use a database for persistent user/token storage

## License
MIT 