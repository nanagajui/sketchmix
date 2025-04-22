import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Log the key (first few characters only for security)
console.log('OpenAI Key (first 8 chars):', process.env.OPENAI_API_KEY?.substring(0, 8) + '...');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Test the API key with a simple request
async function testKey() {
  try {
    const response = await openai.models.list();
    console.log('API Key is valid! Available models:', response.data.map(model => model.id));
  } catch (error) {
    console.error('Error testing API key:', error.message);
    if (error.status === 401) {
      console.error('The API key is invalid or has expired');
    } else if (error.status === 429) {
      console.error('Rate limit exceeded');
    } else {
      console.error('Other error:', error);
    }
  }
}

testKey(); 