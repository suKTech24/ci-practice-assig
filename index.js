// Text stats: print line, word, and character counts for a file,
// plus its most common words.
//
// Usage: node index.js <file> [topN]
// Example: node index.js README.md 5

const fs = require("node:fs");
const { analyze } = require("./src/textStats");

const [file, topArg] = process.argv.slice(2);

if (!file) {
  console.error("Usage: node index.js <file> [topN]");
  process.exit(1);
}

let text;
try {
  text = fs.readFileSync(file, "utf8");
} catch (err) {
  console.error(`Cannot read "${file}": ${err.message}`);
  process.exit(1);
}

const limit = Number.parseInt(topArg ?? "3", 10);
const stats = analyze(text, Number.isNaN(limit) ? 3 : limit);

console.log(`File:       ${file}`);
console.log(`Lines:      ${stats.lines}`);
console.log(`Words:      ${stats.words}`);
console.log(`Characters: ${stats.characters}`);
console.log("Top words:");
for (const { word, count } of stats.topWords) {
  console.log(`  ${word.padEnd(15)} ${count}`);
}
