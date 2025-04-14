import axios from 'axios';

// Base URL and API configuration
const BASE_URL = 'https://public-api.beatoven.ai';
const API_KEY = process.env.BEATOVEN_API_KEY;

// Check if required keys are available, useful for fallback logic
const isBeatovenConfigured = !!API_KEY;

// Interfaces for API requests and responses
interface ComposeTrackRequest {
  prompt: {
    text: string;
  };
  format?: 'mp3' | 'wav' | 'aac';
  looping?: boolean;
}

interface ComposeTrackResponse {
  status: string;
  task_id: string;
}

interface TaskStatusResponse {
  status: string;
  meta?: {
    project_id: string;
    track_id: string;
    prompt: {
      text: string;
    };
    version: number;
    track_url: string;
    stems_url: {
      bass: string;
      chords: string;
      melody: string;
      percussion: string;
    };
  };
}

// Helper to get API headers
const getHeaders = () => ({
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
});

/**
 * Initiates track composition with Beatoven.ai API
 * @param promptText The emotional description/prompt for music generation
 * @returns Task ID for tracking composition status
 */
export async function composeTrack(promptText: string): Promise<string> {
  if (!isBeatovenConfigured) {
    throw new Error('Beatoven API key not configured');
  }
  
  try {
    const payload: ComposeTrackRequest = {
      prompt: {
        text: promptText
      },
      format: 'mp3',
      looping: false
    };
    
    const response = await axios.post<ComposeTrackResponse>(
      `${BASE_URL}/api/v1/tracks/compose`,
      payload,
      { headers: getHeaders() }
    );
    
    return response.data.task_id;
  } catch (error: any) {
    console.error('Beatoven Compose Track Error:', error.response?.data || error.message);
    throw new Error(`Failed to compose track: ${error.message}`);
  }
}

/**
 * Checks the status of a composition task
 * @param taskId The task ID returned from composeTrack
 * @returns Task status information
 */
export async function checkTaskStatus(taskId: string): Promise<TaskStatusResponse> {
  if (!isBeatovenConfigured) {
    throw new Error('Beatoven API key not configured');
  }
  
  try {
    const response = await axios.get<TaskStatusResponse>(
      `${BASE_URL}/api/v1/tasks/${taskId}`,
      { headers: getHeaders() }
    );
    
    return response.data;
  } catch (error: any) {
    console.error('Beatoven Check Task Status Error:', error.response?.data || error.message);
    throw new Error(`Failed to check task status: ${error.message}`);
  }
}

/**
 * Wrapper function to handle the entire music generation process
 * @param emotionalDescription The emotional description to generate music from
 * @param maxRetries Maximum number of status check retries
 * @param delayMs Delay between status checks in milliseconds
 * @returns URL to the generated music track
 */
export async function generateMusicWithBeatoven(
  emotionalDescription: string,
  maxRetries = 20,
  delayMs = 3000
): Promise<string> {
  if (!isBeatovenConfigured) {
    throw new Error('Beatoven API key not configured');
  }
  
  try {
    // Format the prompt to produce better results with Beatoven.ai
    const formattedPrompt = formatPromptForBeatoven(emotionalDescription);
    
    // Start the composition
    const taskId = await composeTrack(formattedPrompt);
    
    // Poll for completion
    let trackUrl = '';
    let retries = 0;
    
    while (retries < maxRetries) {
      // Wait between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, delayMs));
      
      const statusResponse = await checkTaskStatus(taskId);
      
      if (statusResponse.status === 'composed' && statusResponse.meta?.track_url) {
        trackUrl = statusResponse.meta.track_url;
        break;
      } else if (statusResponse.status === 'failed') {
        throw new Error('Music composition failed');
      }
      
      retries++;
    }
    
    if (!trackUrl) {
      throw new Error('Music composition timed out');
    }
    
    return trackUrl;
  } catch (error: any) {
    console.error('Beatoven Music Generation Error:', error);
    throw new Error(`Failed to generate music: ${error.message}`);
  }
}

/**
 * Formats an emotional description into a prompt optimized for Beatoven.ai
 * @param emotionalDescription Original emotional description
 * @returns Formatted prompt for Beatoven
 */
function formatPromptForBeatoven(emotionalDescription: string): string {
  // Extract key emotions and moods from the description
  const description = emotionalDescription.toLowerCase();
  
  // Base duration for tracks
  const duration = '30 seconds';
  
  // Determine general mood category and appropriate genre
  let genre = 'ambient';
  let mood = 'neutral';
  
  if (description.includes('joy') || description.includes('happy') || 
      description.includes('excite') || description.includes('cheerful') ||
      description.includes('upbeat') || description.includes('energetic')) {
    genre = 'upbeat lo-fi';
    mood = 'cheerful';
  } else if (description.includes('calm') || description.includes('peaceful') || 
             description.includes('serene') || description.includes('tranquil')) {
    genre = 'peaceful ambient';
    mood = 'calming';
  } else if (description.includes('sad') || description.includes('melancholy') || 
             description.includes('somber') || description.includes('gloomy')) {
    genre = 'gentle piano';
    mood = 'melancholic';
  } else if (description.includes('tense') || description.includes('dramatic') || 
             description.includes('suspense') || description.includes('mysterious')) {
    genre = 'cinematic';
    mood = 'suspenseful';
  } else if (description.includes('wonder') || description.includes('magical') || 
             description.includes('fantasy') || description.includes('dreamy')) {
    genre = 'fantasy ambient';
    mood = 'magical';
  }
  
  // Build final prompt
  return `${duration} ${mood} ${genre} music that conveys ${emotionalDescription}`;
}