
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_TEXT } from '../constants';

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

export const generateDashboardTip = async (): Promise<string> => {
  if (!ai) {
    return "💡 Tip: Configure your Gemini API key to get helpful tips!";
  }

  try {
    const prompt = "Provide a concise and actionable productivity tip for a user of a web application dashboard. The tip should be a single sentence or two short sentences.";
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 60,
      }
    });

    const tip = response.text;
    if (tip) {
      return `💡 Tip: ${tip.trim()}`;
    }
    return "💡 Tip: Keep your workspace organized for better focus!";
  } catch (error) {
    console.error("Error generating dashboard tip from Gemini:", error);
    // Provide a generic fallback tip
    if (error instanceof Error && error.message.includes('API key not valid')) {
         return "💡 Tip: Your Gemini API key is invalid. Please check your configuration.";
    }
    return "💡 Tip: Take short breaks to stay refreshed and productive!";
  }
};

export const summarizeTextWithGemini = async (textToSummarize: string): Promise<string> => {
  if (!ai) {
    return "Gemini API not available. Summary feature disabled.";
  }

  try {
    const prompt = `Summarize the following text concisely: \n\n${textToSummarize}`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: {
        temperature: 0.5,
        maxOutputTokens: 150,
      }
    });

    const summary = response.text;
    return summary ? summary.trim() : "Could not generate summary.";
  } catch (error) {
    console.error("Error summarizing text with Gemini:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        return "Summary failed: Invalid Gemini API key.";
    }
    return "Failed to generate summary due to an API error.";
  }
};
