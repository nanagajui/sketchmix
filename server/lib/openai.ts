import OpenAI from "openai";
import { EmotionData } from "@shared/schema";
import sharp from "sharp";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate artistic image from drawing
export async function generateImage(drawingBase64: string): Promise<{ imageUrl: string }> {
  try {
    // Remove the data:image/png;base64, part if present
    const base64Data = drawingBase64.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Resize and optimize the image using sharp
    // Resize to a smaller size and convert to PNG with white background
    const processedImageBuffer = await sharp(imageBuffer)
      .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png({ quality: 80 })
      .toBuffer();
    
    console.log("Original image size:", imageBuffer.length, "bytes");
    console.log("Processed image size:", processedImageBuffer.length, "bytes");
    
    // Create a base64 string from the processed image
    const processedBase64 = processedImageBuffer.toString('base64');
    
    // First analyze the content of the drawing
    const drawingAnalysis = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an assistant who analyzes drawing content. Describe what you see in the image in a concise manner."
        },
        {
          role: "user",
          content: [
            { type: "text", text: "What's drawn in this simple sketch?" },
            { 
              type: "image_url", 
              image_url: { 
                url: `data:image/png;base64,${processedBase64}` 
              } 
            }
          ]
        }
      ]
    });
    
    const drawingDescription = drawingAnalysis.choices[0].message.content;
    console.log("Drawing description:", drawingDescription);
    
    // Now use the description to generate a cartoon image
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Transform this into a vibrant, professional artistic image: ${drawingDescription}. Use colorful, animated style with clean lines. Give it a dynamic, polished artistic look while staying true to the original concept, bring out emotions and consider it in the style of a known artist.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return { imageUrl: response.data[0].url || "" };
  } catch (error: any) {
    console.error("OpenAI Image Generation Error:", error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}

// Analyze image to extract emotions
export async function analyzeImage(imageUrl: string): Promise<EmotionData> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing images and extracting emotional context. Analyze the provided image and extract the emotional tone and mood. Provide a detailed description focused on emotions, and identify the dominant emotions with percentage values. Respond with JSON in the format: { 'description': 'detailed emotional description', 'dominantEmotions': [{ 'name': 'emotion name', 'percentage': 85 }, ...] }"
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this image for its emotional content and mood." },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      description: result.description || "No emotional description generated",
      dominantEmotions: result.dominantEmotions || []
    };
  } catch (error: any) {
    console.error("OpenAI Image Analysis Error:", error);
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}

// Import Beatoven API integration
import { generateMusicWithBeatoven } from "./beatoven";

// Generate music based on emotional description
export async function generateMusic(emotionalDescription: string): Promise<{ 
  musicUrl: string, 
  attributes: { name: string; value: string; percentage: number }[] 
}> {
  try {
    // First, generate music attributes from the emotional description
    const attributesResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert at translating emotional descriptions into musical attributes. Convert the emotional description into musical attributes with percentage values. Respond with JSON in the format: { 'attributes': [{ 'name': 'Tempo', 'value': 'Upbeat', 'percentage': 75 }, { 'name': 'Mood', 'value': 'Cheerful', 'percentage': 85 }, { 'name': 'Intensity', 'value': 'Medium', 'percentage': 60 }, { 'name': 'Complexity', 'value': 'Layered', 'percentage': 70 }] }"
        },
        {
          role: "user",
          content: `Create musical attributes based on this emotional description: ${emotionalDescription}`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const attributesResult = JSON.parse(attributesResponse.choices[0].message.content || "{}");
    
    // Try to generate music using Beatoven.ai API
    try {
      console.log("Attempting to generate music with Beatoven.ai API...");
      const musicUrl = await generateMusicWithBeatoven(emotionalDescription);
      console.log("Beatoven.ai music generation successful:", musicUrl);
      
      return {
        musicUrl,
        attributes: attributesResult.attributes || []
      };
    } catch (beatovenError) {
      // If Beatoven API fails, log the error and fall back to sample music
      console.error("Beatoven API Error:", beatovenError);
      console.log("Falling back to sample music...");
      
      // Fallback to reliable sample music URLs from a public source
      const sampleMusicUrls = [
        "https://cdn.freesound.org/previews/413/413854_4708614-lq.mp3", // Happy, upbeat
        "https://cdn.freesound.org/previews/476/476340_5903033-lq.mp3", // Peaceful, calm
        "https://cdn.freesound.org/previews/369/369515_5549257-lq.mp3", // Energetic
        "https://cdn.freesound.org/previews/527/527507_2586050-lq.mp3", // Mysterious, pensive
        "https://cdn.freesound.org/previews/542/542828_9558986-lq.mp3"  // Melancholic
      ];
      
      // Choose music based on dominant emotion mentioned in the description
      let musicIndex = 0; // Default to happy
      const description = emotionalDescription.toLowerCase();
      
      if (description.includes("calm") || description.includes("peaceful") || description.includes("serene")) {
        musicIndex = 1;
      } else if (description.includes("energy") || description.includes("dynamic") || description.includes("exciting")) {
        musicIndex = 2;
      } else if (description.includes("mysterious") || description.includes("curious") || description.includes("wonder")) {
        musicIndex = 3;
      } else if (description.includes("sad") || description.includes("melancholy") || description.includes("somber")) {
        musicIndex = 4;
      }
      
      return {
        musicUrl: sampleMusicUrls[musicIndex],
        attributes: attributesResult.attributes || []
      };
    }
  } catch (error: any) {
    console.error("Music Generation Error:", error);
    throw new Error(`Failed to generate music: ${error.message}`);
  }
}
