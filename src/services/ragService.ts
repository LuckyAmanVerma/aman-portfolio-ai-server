import { ai } from "../config/gemini"; // or wherever you initialized it

export async function generateResponse(
  message: string,
  context: string
) {
  try {
    const finalPrompt = `
You are an AI assistant for Aman's portfolio website.

You must answer ONLY using the provided portfolio context.

Guidelines:
• If the question is unclear, interpret it as related to Aman's profile.
• Look for keywords in these categories:
  - Skills: Frontend, React.js, Node.js, etc.
  - Experience: Companies like Accenture, Netlink, etc.
  - Total Experience: e.g., total experience in React.js or Node.js.
  - Contact: Email, phone number, LinkedIn profile, portfolio link.
  - Projects: Project name, description, technologies used, role.

Formatting Instructions:
• Use **GitHub-flavored Markdown**.
• Use bullet points (-) for lists (skills, projects, etc.).
• Use paragraphs for explanations.
• Make links clickable with [text](url).
• Format email as '[Email](mailto:someone@example.com)'.
• Format phone number as '[Call](tel:+911234567890)'.


If the answer is not found in the context, politely reply:
'I'm sorry, but I can only answer questions related to Aman Verma's professional experience, skills, and projects.'
;

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
