
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getPPESuggestions = async (taskDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Siz O'zbekiston Temir Yo'llari (OTY) xavfsizlik muhandisisiz. Berilgan ish tavsifiga asosan qanday maxsus kiyim va SHHV (Personal Protective Equipment) kiyish kerakligini tavsiya qiling. Javobni o'zbek tilida bering. Ish: "${taskDescription}"`,
      config: {
        systemInstruction: "You are a professional safety engineer specializing in Uzbekistan industrial safety standards (GOST).",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.";
  }
};
