
import { GoogleGenAI } from "@google/genai";

export const generateWinnerMessage = async (winnerName: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres un presentador entusiasta de un programa de concursos. El ganador de la ruleta es "${winnerName}". Escribe una felicitación corta (máximo 20 palabras), divertida y emocionante para el ganador en español.`,
      config: {
        temperature: 0.9,
      }
    });
    
    return response.text || `¡Felicidades, ${winnerName}! ¡Hoy es tu día de suerte!`;
  } catch (error) {
    console.error("Error generating AI message:", error);
    return `¡Increíble victoria para ${winnerName}!`;
  }
};
