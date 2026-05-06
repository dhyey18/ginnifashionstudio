const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Hi');
    console.log('gemini-1.5-flash works:', result.response.text());
  } catch (err) {
    console.error('gemini-1.5-flash failed:', err.status, err.message);
  }
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });
    const result = await model.generateContent('Hi');
    console.log('gemini-1.5-flash-8b works:', result.response.text());
  } catch (err) {
    console.error('gemini-1.5-flash-8b failed:', err.status, err.message);
  }
}
test();
