import { GoogleGenAI } from "@google/genai";
import { Permit, Condition, Evidence } from '../types';

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

    if (!apiKey) {
      console.error("❌ Missing VITE_GEMINI_API_KEY environment variable");
    }

    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

// Helper to format system context
const createSystemContext = (permits: Permit[], conditions: Condition[]) => {
  return `
    You are an intelligent AI assistant for FirstCarbon Solutions (FCS) called "AI Permit Tracker".
    Your role is to help Project Managers and Compliance Staff track environmental permits, milestones, and conditions.
    
    Here is the current database of permits and conditions in JSON format:
    PERMITS: ${JSON.stringify(permits)}
    CONDITIONS: ${JSON.stringify(conditions)}

    Guidelines:
    1. Be professional, concise, and helpful.
    2. When asked about specific permits, refer to them by Name or ID.
    3. If asked to draft a digest or report, format it clearly with Markdown headers and bullet points.
    4. "At Risk" means a due date is approaching without evidence. "Overdue" means the date has passed.
    5. Always assume today's date is 2024-05-15 for context on what is overdue.
  `;
};

export const generateAIResponse = async (
  prompt: string, 
  permits: Permit[], 
  conditions: Condition[],
  history: {role: 'user' | 'model', content: string}[] = []
): Promise<string> => {
  try {
    const client = getAI();
    const systemInstruction = createSystemContext(permits, conditions);
    
    const model = 'gemini-2.5-flash';
    
    // Construct chat history for context
    // Note: The new SDK uses a specific format for history if we used chat.sendMessage, 
    // but here we are doing a single generation for simplicity or we can use chat.
    // Let's use chat for better conversational flow.
    
    const chat = client.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.content }]
      }))
    });

    const result = await chat.sendMessage({
      message: prompt
    });

    return result.text || "I couldn't generate a response at this time.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I'm having trouble connecting to the AI service right now. Please ensure the API Key is configured.";
  }
};
