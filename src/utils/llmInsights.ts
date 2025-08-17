import type { Session } from "../types/insights";

/**
 * Prepares a summary text from session data for LLM input.
 */
export function prepareDataText(sessions: Session[]): string {
  const byDept = sessions.reduce((acc, s) => {
    if (!acc[s.department]) acc[s.department] = [];
    acc[s.department].push(s.overallScore);
    return acc;
  }, {} as Record<string, number[]>);

  return Object.entries(byDept)
    .map(([dept, scores]) => {
      const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(
        1
      );
      return `${dept} department average score is ${avg} across ${scores.length} sessions.`;
    })
    .join(" ");
}

/**
 * Uses Hugging Face Inference API to summarize insights from session data.
 * Returns a promise that resolves to an array of summary strings.
 */
export async function getLLMInsights(sessions: Session[]): Promise<string[]> {
  if (!sessions || sessions.length === 0) return ["No insights available."];

  const HF_API_KEY = import.meta.env.VITE_HF_API_KEY as string; // <-- Loaded from .env
  const dataText = prepareDataText(sessions);

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: dataText }),
      }
    );
    const result = await response.json();
    if (result.error) {
      throw new Error(result.error);
    }
    return [result[0]?.summary_text || "No summary generated."];
  } catch (err) {
    console.error("Hugging Face summarization error:", err);
    return ["LLM summarization failed."];
  }
}
