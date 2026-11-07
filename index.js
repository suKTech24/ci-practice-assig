// Command-line detector: scan a log of process command lines and print
// which MITRE ATT&CK techniques they match.
//
// Usage:   node index.js <logfile>
// Example: node index.js samples/commands.log

const fs = require("node:fs");
const { scanLines, countByTechnique } = require("./src/detector");

const file = process.argv[2];

if (!file) {
  console.error("Usage: node index.js <logfile>");
  process.exit(1);
}

let text;
try {
  text = fs.readFileSync(file, "utf8");
} catch (err) {
  console.error(`Cannot read "${file}": ${err.message}`);
  process.exit(1);
}

const matches = scanLines(text);

for (const m of matches) {
  console.log(`line ${m.line}  ${m.technique.padEnd(10)} ${m.name}: ${m.command}`);
}

console.log(`\nMatches: ${matches.length}`);
for (const [technique, count] of Object.entries(countByTechnique(matches))) {
  console.log(`  ${technique.padEnd(10)} ${count}`);
}
