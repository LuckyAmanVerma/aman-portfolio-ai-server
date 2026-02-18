import { ai } from "../config/gemini"; // or wherever you initialized it

export async function generateResponse(
  message: string,
  context: string
) {
  try {
    const finalPrompt = `
You are an AI assistant for Aman's portfolio website.

You must answer ONLY using the provided portfolio context.

If the question is unclear, try to interpret it as related to Aman's profile.

If the answer is not found in the context, politely say:
"I'm sorry, but I can only answer questions related to Aman Verma's professional experience, skills, and projects."


Context:
${context}

Question:
${message}

Answer:
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // free tier
      contents: [
        {
          role: "user",
          parts: [{ text: finalPrompt }],
        },
      ],
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return {
        success: false,
        error: "No response from AI model.",
        statusCode: 500,
      };
    }

    return {
      success: true,
      data: text,
    };

  } catch (error) {
    console.error("RAG Service Error:", error);

    return {
      success: false,
      error: "AI service is temporarily unavailable.",
      statusCode: 500,
    };
  }
}
