// Placeholder for NLU (DeepSeek/OpenAI)
async function parse(msg, phone) {
  // Very basic intent detection for now
  msg = msg.toLowerCase();
  if (msg.includes('meeting') && (msg.includes('schedule') || msg.includes('set up') || msg.includes('create'))) {
    return { intent: 'create_meeting', text: msg };
  }
  if (msg.includes('upcoming') || msg.includes('next meeting')) {
    return { intent: 'list_meetings', text: msg };
  }
  if (msg.includes('cancel')) {
    return { intent: 'cancel_meeting', text: msg };
  }
  if (msg.includes('reschedule')) {
    return { intent: 'reschedule_meeting', text: msg };
  }
  return { intent: 'unknown', text: msg };
}

module.exports = { parse }; 