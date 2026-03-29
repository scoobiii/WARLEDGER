import { GoogleGenAI } from "@google/genai";
import { WARLEDGER_DATA } from "../data/damage";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askAssistant(userMessage: string, chatHistory: { role: 'user' | 'model', text: string }[]) {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are the WarLedger Assistant, a humanized, empathetic, and objective AI integrated into the WarLedger dashboard.
    WarLedger is an open-source accountability tool tracking the human, economic, and geopolitical costs of the Middle East conflict (2023-2026).
    
    YOUR GOAL:
    - Help users understand the complex data in the ledger.
    - Provide context on specific events or metrics (civilian deaths, economic loss, etc.).
    - Explain the "Corrections" and why they are blocked.
    - Maintain a somber, respectful, and humanized tone. Avoid being overly "robotic" or "corporate".
    - Be objective. Stick to the facts provided in the ledger, but acknowledge the human suffering involved.
    
    CONTEXT DATA (The Ledger):
    ${JSON.stringify(WARLEDGER_DATA, null, 2)}
    
    CONSTRAINTS:
    - If a user asks something not in the ledger, state that the ledger doesn't have that specific data but provide general context if it's widely known and relevant.
    - Do not take political sides. Focus on the cost of conflict and the path to solutions (corrections).
    - Keep responses concise but meaningful.
  `;

  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction,
    },
  });

  // Reconstruct history for the chat session
  // Note: sendMessage doesn't take full history in the same way as some other SDKs, 
  // but we can simulate it or just send the current message with context.
  // Actually, @google/genai chat.sendMessage takes a message string.
  
  // For simplicity and better context, we'll use generateContent with the history included in contents
  const contents = [
    ...chatHistory.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    })),
    {
      role: 'user' as const,
      parts: [{ text: userMessage }]
    }
  ];

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction,
      temperature: 0.7,
    }
  });

  return response.text;
}
