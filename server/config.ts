import 'dotenv/config';

// Validate required environment variables
const requiredEnvVars = [
  'OPENAI_API_KEY',
  'BEATOVEN_API_KEY'
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY
  },
  beatoven: {
    apiKey: process.env.BEATOVEN_API_KEY
  }
} as const;