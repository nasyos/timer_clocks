
import { GoogleGenAI, Type } from "@google/genai";
import { QuoteData } from "../types";

export const getZenQuote = async (): Promise<QuoteData> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            author: { type: Type.STRING }
          },
          required: ["text", "author"]
        }
      }
    });

    const data = JSON.parse(response.text);
    return data as QuoteData;
  } catch (error) {
    // APIキーがログに出力されないように、エラーメッセージのみを出力
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to fetch zen quote:", errorMessage);
    return {
      text: "静かな水面は、心を映し出す鏡のようなものです。",
      author: "湖畔の知恵"
    };
  }
};
