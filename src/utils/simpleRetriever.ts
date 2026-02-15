// Pronoun resolution map
const pronounMap: Record<string, string> = {
  "he": "aman",
  "him": "aman",
  "his": "aman",
  "he's": "aman",
  "you": "aman",
  "your": "aman",
  "yourself": "aman",
};

// Synonym map for better semantic matching
const synonymMap: Record<string, string[]> = {
  "experience": ["worked", "years", "expertise", "skilled", "proficiency"],
  "react": ["react.js", "reactjs"],
  "node": ["node.js", "nodejs"],
  "skill": ["skills", "expertise", "proficiency", "experience"],
  "project": ["projects", "work", "assignment", "developed"],
  "company": ["companies", "organization", "firm"],
  "live": ["located", "location", "place", "city", "country"],
  "backend": ["server", "api", "backend development"],
  "frontend": ["ui", "client", "frontend", "interface"],
  "full": ["fullstack", "full-stack", "stack"],
};

// Common question words to filter out
const questionWords = new Set([
  "what", "where", "when", "why", "how", "which", "who", "whose",
  "can", "could", "would", "should", "is", "are", "do", "does",
  "did", "have", "has", "the", "a", "an", "and", "or", "but", "?"
]);

export function retrieveRelevantChunks(
  question: string,
  chunks: string[],
  topK = 3
) {
  const questionLower = question.toLowerCase();
  
  // Expand pronouns to full name
  let expandedQuestion = questionLower;
  Object.entries(pronounMap).forEach(([pronoun, replacement]) => {
    const regex = new RegExp(`\\b${pronoun}\\b`, "g");
    expandedQuestion = expandedQuestion.replace(regex, replacement);
  });

  // Extract meaningful keywords (filter question words)
  let keywords = expandedQuestion
    .split(/[\s?.,!]+/)
    .filter((word) => word.length > 0 && !questionWords.has(word));

  // Expand keywords with synonyms
  const expandedKeywords = new Set<string>();
  keywords.forEach((keyword) => {
    expandedKeywords.add(keyword);
    if (synonymMap[keyword]) {
      synonymMap[keyword].forEach((syn) => expandedKeywords.add(syn));
    }
  });

  const scored = chunks.map((chunk) => {
    const chunkLower = chunk.toLowerCase();
    let score = 0;

    // Score based on expanded keywords
    expandedKeywords.forEach((keyword) => {
      // Whole word match (higher priority)
      if (new RegExp(`\\b${keyword}\\b`).test(chunkLower)) {
        score += 3;
      }
      // Partial match (lower priority)
      else if (chunkLower.includes(keyword)) {
        score += 1;
      }
    });

    // Bonus for containing original question words
    keywords.forEach((keyword) => {
      if (new RegExp(`\\b${keyword}\\b`).test(chunkLower)) {
        score += 2;
      }
    });

    return { chunk, score };
  });

  // Lower threshold - accept chunks with any relevant content
  const filtered = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  // If no chunks found with semantic matching, try broader search
  if (filtered.length === 0) {
    const broadFiltered = scored
      .filter((item) => {
        // Check if chunk contains any keyword (case-insensitive)
        return keywords.some((kw) =>
          item.chunk.toLowerCase().includes(kw)
        );
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
    
    return broadFiltered.map((item) => item.chunk);
  }

  return filtered.map((item) => item.chunk);
}
