// Pure functions for analysing a piece of text.
// They have no side effects, which makes them easy to unit test.

/** Count lines. A trailing newline does not start a new line. */
function countLines(text) {
  if (text.length === 0) return 0;
  const lines = text.split(/\r?\n/);
  if (lines[lines.length - 1] === "") lines.pop();
  return lines.length;
}

/** Split text into lowercase words. Keeps apostrophes inside words ("don't"). */
function toWords(text) {
  return text.toLowerCase().match(/[a-z0-9]+(?:'[a-z0-9]+)*/g) ?? [];
}

function countWords(text) {
  return toWords(text).length;
}

/**
 * The `limit` most frequent words, most frequent first.
 * Ties are broken alphabetically so the result is predictable.
 */
function topWords(text, limit = 3) {
  const counts = new Map();
  for (const word of toWords(text)) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

/** All statistics for a piece of text in one object. */
function analyze(text, limit = 3) {
  return {
    lines: countLines(text),
    words: countWords(text),
    characters: text.length,
    topWords: topWords(text, limit),
  };
}

module.exports = { countLines, toWords, countWords, topWords, analyze };
