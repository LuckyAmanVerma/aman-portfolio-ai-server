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
Looks for keywords like: 1.skills which can be Frontend , React.js , Node.js ,  data related to it. , 
2.like experience at companies like Accenture , Netlink ,etc refer Experience related it , 
3. Total Experience , lke total experience in React.js , Total Experience in Node.js , then answer accordingly.
4. Contact , then properly format the answer , like First Email , then Phone number , then LinkedIn profile link, Portfolio link, etc.
5.Projects , then answer accordingly look for Projects related keywords like 1. Project Name , 2. Project Description , 3. Technologies Used , 4. Role in the project , etc.
After generating the response, Properly format the answer also , Like if link is there then make it clickable , if email is there then make it mailto link , if phone number is there then make it clickable for calling, etc.
Use bullet points for listing items like skills, projects, etc. and use paragraphs for explanations.

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
