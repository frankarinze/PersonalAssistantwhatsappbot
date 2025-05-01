const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Sends a user message to OpenAI and returns a detailed, multi-line response focused on scheduling meetings.
 * The LLM acts as a middleman, guiding the user and preparing for meeting setup, but does not create meetings directly.
 * Uses multi-shot prompting for best results.
 * @param {string} userMessage - The user's message
 * @returns {Promise<string>} - The LLM's response
 */
async function getLLMResponse(userMessage) {
  if (!OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API key in environment variables.');
  }

const systemPrompt = `You are a helpful assistant whose only job is to help users schedule and set up meetings. \
You do not create meetings yourself, but you guide the user, gather necessary information, and prepare them for the meeting setup process. \
Your responses should be detailed, friendly, and always not more than 2-3 lines. If the user asks for something unrelated, politely redirect them to scheduling meetings.`;

  // Multi-shot examples
  const examples = [
    { role: 'user', content: 'Hi, I want to set up a meeting with my team.' },
    { role: 'assistant', content: `Absolutely! I can help you get started with scheduling your team meeting. Could you please provide the preferred date, time, and the names or emails of the participants? Once I have these details, I'll guide you through the next steps.`},
    { role: 'user', content: 'Can you book a meeting for me tomorrow at 3pm with John and Sarah?' },
    { role: 'assistant', content: `I'd be happy to help you organize this meeting. To proceed, could you confirm the email addresses of John and Sarah? ` },
    { role: 'user', content: `What's the weather like today?` },
    { role: 'assistant', content: `I'm here to assist you with scheduling and setting up meetings. If you'd like to arrange a meeting or need help with the process, just let me know the details!` }
  ];

  const messages = [
    { role: 'system', content: systemPrompt },
    ...examples,
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 350,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const llmReply = response.data.choices[0].message.content;
    return llmReply;
  } catch (error) {
    console.error('Error communicating with OpenAI:', error.response?.data || error.message);
    return 'Sorry, I am having trouble processing your request right now. Please try again later.';
  }
}

module.exports = {
  getLLMResponse
}; 