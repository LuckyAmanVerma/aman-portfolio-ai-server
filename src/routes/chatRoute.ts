import express from "express";
import { generateResponse } from "../services/ragService";
import { loadDocuments } from "../utils/documentLoader";
import { splitText } from "../utils/textSplitter";
import { retrieveRelevantChunks } from "../utils/simpleRetriever";

const router = express.Router();

// ✅ Load once (not per request)
const allDocs = loadDocuments();
const chunks = splitText(allDocs);

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Message is required and must be a string.",
      });
    }

    // 🔥 Step 1: Retrieve relevant chunks
    const relevantChunks = retrieveRelevantChunks(message, chunks);

    // 🔴 STRICT OUT-OF-SCOPE CHECK
    if (relevantChunks.length === 0) {
      return res.status(200).json({
        success: true,
        reply:
          "I'm sorry, but I can only answer questions related to Aman Verma’s professional experience, skills, and projects.",
      });
    }

    // 🔥 Step 2: Send only relevant context to RAG service
    const context = relevantChunks.join("\n\n");

    const result = await generateResponse(message, context);

    if (!result.success) {
      return res.status(result.statusCode || 500).json({
        success: false,
        error: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      reply: result.data,
    });

  } catch (error) {
    console.error("Route Error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
});

export default router;
