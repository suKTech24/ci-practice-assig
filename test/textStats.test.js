// Unit tests using Node's built-in test runner (no dependencies needed).
// Run with: npm test

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  countLines,
  toWords,
  countWords,
  topWords,
  analyze,
} = require("../src/textStats");

test("countLines: empty text has zero lines", () => {
  assert.equal(countLines(""), 0);
});

test("countLines: trailing newline is not an extra line", () => {
  assert.equal(countLines("a\nb\n"), 2);
  assert.equal(countLines("a\nb"), 2);
});

test("countLines: handles Windows line endings", () => {
  assert.equal(countLines("a\r\nb\r\nc"), 3);
});

test("toWords: lowercases and ignores punctuation", () => {
  assert.deepEqual(toWords("Hello, World! Hello?"), ["hello", "world", "hello"]);
});

test("toWords: keeps apostrophes inside words", () => {
  assert.deepEqual(toWords("Don't stop"), ["don't", "stop"]);
});

test("countWords: counts words, not spaces", () => {
  assert.equal(countWords("  one   two\tthree\n"), 3);
  assert.equal(countWords(""), 0);
});

test("topWords: most frequent first, ties alphabetical", () => {
  assert.deepEqual(topWords("b a c a b a", 2), [
    { word: "a", count: 3 },
    { word: "b", count: 2 },
  ]);
});

test("analyze: returns all statistics together", () => {
  assert.deepEqual(analyze("CI is fun.\nCI is fast.\n", 1), {
    lines: 2,
    words: 6,
    characters: 23,
    topWords: [{ word: "ci", count: 2 }],
  });
});
