# AI Server - RAG Portfolio Assistant

A **Retrieval-Augmented Generation (RAG) backend** for Aman Verma's portfolio that provides intelligent, context-aware responses using Google Gemini API. Built with Express.js and TypeScript, this server ensures all answers are grounded in the knowledge base and prevents hallucinations.

## 🎯 Project Overview

This is a strict domain-controlled AI assistant that:
- **Answers only from knowledge documents** (resume, LinkedIn, portfolio data)
- **Uses Google Gemini 2.5 Flash** for fast, cost-effective responses
- **Prevents hallucinations** through context restriction and scope enforcement
- **Blocks out-of-scope questions** with intelligent filtering
- **Ensures deterministic behavior** with a custom keyword-based retriever

**Backend URL:** [https://aman-portfolio-ai-server.onrender.com/api/*](https://aman-portfolio-ai-server.onrender.com/api/*)

---

## 📋 Architecture Overview

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md)

### High-Level Request Flow
```
User Query → /chat endpoint
    ↓
Text Retriever (keyword-based)
    ↓
No relevant chunks? → Return fallback message
    ↓
Relevant chunks found → Inject into prompt
    ↓
Gemini 2.5 Flash generates response
    ↓
Return structured JSON response
```

### Key Components

| Component | File | Purpose |
|-----------|------|---------|
| **Document Loader** | `src/utils/documentLoader.ts` | Loads knowledge base from text files |
| **Text Splitter** | `src/utils/textSplitter.ts` | Chunks text to appropriate sizes (~800 chars) |
| **Simple Retriever** | `src/utils/simpleRetriever.ts` | Keyword-based chunk matching and scoring |
| **Chat Routes** | `src/routes/chatRoute.ts` | API endpoint handling and scope validation |
| **RAG Service** | `src/services/ragService.ts` | Prompt building and model invocation |
| **Gemini Config** | `src/config/gemini.ts` | Google Gemini API setup |

---

## 🗂️ Project Structure

```
ai-server/
├── src/
│   ├── server.ts                 # Express server entry point
│   ├── config/
│   │   └── gemini.ts             # Google Gemini API configuration
│   ├── data/
│   │   ├── resume.txt            # Resume content
│   │   ├── linkedin.txt          # LinkedIn profile data
│   │   └── portfolio.txt         # Portfolio projects & experience
│   ├── routes/
│   │   └── chatRoute.ts          # Chat endpoint (/api/chat)
│   ├── services/
│   │   └── ragService.ts         # RAG pipeline & Gemini integration
│   └── utils/
│       ├── documentLoader.ts     # Knowledge base loader
│       ├── simpleRetriever.ts    # Keyword-based retrieval
│       └── textSplitter.ts       # Text chunking utility
├── ARCHITECTURE.md               # Detailed system documentation
├── README.md                      # This file
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
└── .env                          # Environment variables (GEMINI_API_KEY)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 16+ 
- **Gemini API Key** (from [Google AI Studio](https://aistudio.google.com))

### Installation

```bash
# Clone or navigate to the project
cd ai-server

# Install dependencies
npm install

# Create .env file with your Gemini API key
echo GEMINI_API_KEY=your_api_key_here > .env
```

### Development

```bash
# Start development server (with auto-reload)
npm run dev

# Server starts on: http://localhost:3000
```

### Production Build

```bash
# Compile TypeScript
npm run build

# Start production server
npm start
```

---

## 📡 API Endpoints

### POST `/api/chat`

Send a question to the AI assistant.

**Request:**
```json
{
  "message": "What is Aman's experience with React?"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Aman has extensive experience with React, including...",
  "retrievedChunks": 3
}
```

**Response (Out-of-scope):**
```json
{
  "success": false,
  "message": "I'm sorry, but I can only answer questions related to Aman Verma's professional experience, skills, and projects."
}
```

---

## 🔒 Scope Enforcement

The system intelligently filters queries to maintain focus.

**✅ Allowed Questions:**
- "What cloud platforms has Aman worked with?"
- "Tell me about Aman's projects"
- "What are Aman's key skills?"

**❌ Blocked Questions:**
- "What is React?" (general knowledge)
- "Who is the Prime Minister?" (out of scope)
- "Solve this math problem" (not portfolio-related)

---

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **Express.js** | Web framework |
| **TypeScript** | Type-safe development |
| **Google Gemini 2.5 Flash** | LLM model |
| **Chromadb/Custom Retriever** | Keyword-based search |
| **CORS** | Cross-origin request handling |
| **dotenv** | Environment variable management |

---

## 📊 Knowledge Base

All knowledge documents are stored in `src/data/`:

- **resume.txt** - Professional resume and work history
- **linkedin.txt** - LinkedIn profile information
- **portfolio.txt** - Project descriptions and technical skills

These files are:
- Loaded once at server startup (performant)
- Split into chunks for efficient retrieval
- Scored using keyword overlap matching

---

## 🔄 Deployment

Currently deployed on **Render.com**:
- **Live URL:** [https://aman-portfolio-ai-server.onrender.com/api/chat](https://aman-portfolio-ai-server.onrender.com/api/chat)
- **Environment:** Node.js + TypeScript
- **Auto-deploys** from repository changes

---

## 🔗 Related Projects

| Project | Description | Link |
|---------|-------------|------|
| **Frontend** | React portfolio with integrated AI chat | [GitHub Repository](https://github.com/LuckyAmanVerma/machine-code-interview) 

---

## 📈 Future Enhancements

See [ARCHITECTURE.md - Future Upgrade Path](./ARCHITECTURE.md#10-future-upgrade-path) for planned improvements:

- [ ] **Embedding-Based Retrieval** - Switch from keywords to semantic search
- [ ] **Vector Database** - Integrate Pinecone/Supabase for scalability
- [ ] **Source Attribution** - Return which document chunks were used
- [ ] **Streaming Responses** - Real-time response delivery
- [ ] **Gemini Pro Upgrade** - Enhanced reasoning capabilities

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `GEMINI_API_KEY not found` | Add `GEMINI_API_KEY` to `.env` |
| `Port 3000 already in use` | Change port in `src/server.ts` or kill process |
| `TypeScript compilation errors` | Run `npm install` to ensure all types are installed |
| `CORS errors` | Frontend URL must be whitelisted in `src/server.ts` |

---

## 📝 License

ISC License - See package.json

---

## 👤 Author

**Aman Verma** - Portfolio AI Assistant  
📧 Email: [your-email]  
🔗 Portfolio: [your-portfolio-url]  
💼 LinkedIn: [your-linkedin]

---

## 📚 Additional Resources

- [Google Gemini Docs](https://ai.google.dev/docs)
- [Express.js TypeScript Guide](https://expressjs.com/)
- [RAG Architecture Explained](./ARCHITECTURE.md)
- [Render Deployment Docs](https://render.com/docs)

---

**Last Updated:** February 2026
