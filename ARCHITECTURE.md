# RAG Architecture Documentation

## 1. Overview

This project implements a strict domain-controlled Retrieval-Augmented Generation (RAG) system for Aman Verma’s portfolio.

The assistant:

- Answers only from uploaded knowledge documents
- Uses Google Gemini `gemini-2.5-flash`
- Prevents hallucination through context restriction
- Blocks out-of-scope questions
- Ensures deterministic behavior
- Backend Url :- https://aman-portfolio-ai-server.onrender.com/api/*


## 2. High-Level Request Flow

User → /chat
        ↓
Retriever
        ↓
No relevant chunks → Immediate fallback
        ↓
Relevant chunks found
        ↓
ai.models.generateContent()
        ↓
Return structured response


## 3. Knowledge Base

All knowledge documents are stored in:

src/data/

### Current Files

- resume.txt
- linkedin.txt
- portfolio.txt

Characteristics:

- Plain text (.txt)
- Cleaned and structured
- Optimized for chunking
- Loaded once at server startup


## 4. Model Configuration

Model: gemini-2.5-flash  
API Method: ai.models.generateContent()

### Rationale

- Low latency
- Cost-efficient
- Suitable for contextual Q&A
- Adequate reasoning capability for portfolio RAG

### Upgrade Options

- gemini-2.5-pro → Advanced reasoning
- Gemini Embeddings → Semantic retrieval


## 5. System Components

### 5.1 Document Loader

File:
src/utils/documentLoader.ts

Responsibilities:

- Reads all .txt files from src/data
- Combines them into a single text corpus
- Adds source labeling
- Executed once at server startup


### 5.2 Text Splitter

File:
src/utils/textSplitter.ts

Responsibilities:

- Splits corpus into fixed-size chunks (~800 characters)
- Prevents excessive context size
- Improves retrieval efficiency


### 5.3 Simple Retriever

File:
src/utils/simpleRetriever.ts

Responsibilities:

- Scores chunks using keyword overlap
- Returns top relevant chunks
- Filters zero-score results
- Returns empty array if no match found


### 5.4 Chat Route Layer

File:
src/routes/chatRoute.ts

Responsibilities:

- Validates request payload
- Calls retriever
- Blocks out-of-scope questions
- Sends relevant context to RAG service

If no relevant chunks are found:

"I'm sorry, but I can only answer questions related to Aman Verma’s professional experience, skills, and projects."

The model is not called in this case.


### 5.5 RAG Service Layer

File:
src/services/ragService.ts

Responsibilities:

- Builds final prompt
- Injects retrieved context
- Calls ai.models.generateContent()
- Extracts response safely
- Returns structured result


## 6. Scope Enforcement

The system blocks:

- General knowledge questions
- Political questions
- Mathematical queries
- Random trivia
- Technology explanations outside portfolio context

Example:

Allowed:
"What cloud experience does Aman have?"

Blocked:
"What is React?"
"Who is the Prime Minister of India?"


## 7. Prompt Strategy

Injected prompt structure:

You are an AI assistant that ONLY answers questions based on the provided context.

If the answer is not present in the context, reply exactly:
"I'm sorry, but I can only answer questions related to Aman Verma’s professional experience."

Context:
{retrieved_chunks}

Question:
{user_message}

Answer:


Purpose:

- Enforce context-bound reasoning
- Minimize hallucination
- Maintain deterministic output


## 8. Performance Characteristics

- Documents loaded once at startup
- No per-request file reads
- Model not invoked for out-of-scope queries
- Flash model ensures low latency
- Lightweight keyword-based retrieval


## 9. Current Architecture Type

Basic Keyword-Based RAG (MVP)

Not yet implemented:

- Embeddings
- Vector database
- Cosine similarity
- Semantic search


## 10. Future Upgrade Path

### Embedding-Based Retrieval

- Gemini Embedding model
- Cosine similarity scoring
- Threshold filtering

### Source Attribution

- Return source file name
- Display supporting chunks in UI

### Vector Database Integration

Possible integrations:

- Pinecone
- Supabase Vector
- Weaviate

### Streaming Responses

- Enable response streaming for improved UX


## 11. Current Stack

- Express.js
- TypeScript
- Gemini gemini-2.5-flash
- Custom keyword retriever
- Context injection
- Strict domain enforcement


## 12. Purpose

AI assistant trained exclusively on Aman Verma’s professional knowledge base.
