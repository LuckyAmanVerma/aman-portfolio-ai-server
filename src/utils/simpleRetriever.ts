export function retrieveRelevantChunks(
  question: string,
  chunks: string[],
  topK = 3
) {
  const questionLower = question.toLowerCase();

  const scored = chunks.map((chunk) => {
    const chunkLower = chunk.toLowerCase();

    let score = 0;

    const words = questionLower.split(" ");

    words.forEach((word) => {
      if (chunkLower.includes(word)) {
        score++;
      }
    });

    return { chunk, score };
  });

  const filtered = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return filtered.map((item) => item.chunk);
}
