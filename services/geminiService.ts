
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeProblem(base64Image: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            },
            {
              text: `Analyze this image for home repair problems (leaks, cracks, electrical issues, etc.). 
              Identify the possible problem, suggest a diagnosis, and categorize it (Electrical, Plumbing, Furniture, etc.).
              Return the result in JSON format with fields: diagnosis, category, confidence (0-1), and suggestedTasks (list of strings).`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING },
            category: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            suggestedTasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["diagnosis", "category", "suggestedTasks"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
}
