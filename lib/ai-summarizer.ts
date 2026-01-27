// lib/news-summarizer.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function summarizeArticle(
  text: string,
  title?: string,
): Promise<string> {
  if (!text || text.length < 800) {
    throw new Error("Text too short to summarize");
  }

  // Keep input well within Gemini 1.0 Pro limits
  const input = text.slice(0, 3000);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });

  const prompt = `
You are a professional news editor.

TASK:
Write a 3–4 sentence abstract summary of the article below.

RULES:
- Do NOT copy any sentence from the article
- Do NOT paraphrase the opening paragraph
- Write fully in your own words
- Focus on key events and outcomes
- Neutral, factual tone

ARTICLE:
${input}
`;

  const result = await model.generateContent(prompt);
  const output = result.response.text();

  const cleaned = clean(output);

  // Reject extractive output
  if (isExtractive(cleaned, text)) {
    throw new Error("Extractive summary detected");
  }

  return cleaned;
}

// ======================
// HELPERS
// ======================
function clean(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isExtractive(summary: string, source: string): boolean {
  const sourceLower = source.toLowerCase();
  return summary
    .split(".")
    .map((s) => s.trim())
    .some((s) => s.length > 25 && sourceLower.includes(s.toLowerCase()));
}
