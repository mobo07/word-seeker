import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_PUBLIC_KEY as string
);

export const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: process.env.NEXT_PUBLIC_SYSTEM_INSTRUCTIONS,
});

// const result = await model.generateContent(prompt);
// console.log(result.response.text());
