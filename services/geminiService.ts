import { GoogleGenAI } from "@google/genai";

// Note: In a real production app, you would proxy this through your backend
// to keep the API Key secure. For this demo, we assume it's available in env.
const API_KEY = process.env.API_KEY || '';

export const generateCaption = async (topic: string, tone: string): Promise<string> => {
  if (!API_KEY) {
    console.warn("No API Key found for Gemini. Returning mock response.");
    return `[Mock AI Output]: Here is a catchy caption about "${topic}" written in a ${tone} tone. Don't forget to like and subscribe! #fangage #content`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a social media caption for a post about: "${topic}". The tone should be ${tone}. Include 3 relevant hashtags. Keep it under 280 characters.`,
    });
    return response.text || "Could not generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating caption. Please check your API configuration.";
  }
};