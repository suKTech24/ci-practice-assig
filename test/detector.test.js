// Unit tests for the detector, using Node's built-in test runner.
// Run with: npm test
//
// Each rule gets a "should match" case and a similar "should NOT match" case.

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeCommand,
  detect,
  scanLines,
  countByTechnique,
} = require("../src/detector");

/** ATT&CK technique IDs matched by a command, for short assertions. */
const techniques = (command) => detect(command).map((m) => m.technique);

test("normalizeCommand: lowercases and collapses spaces", () => {
  assert.equal(normalizeCommand("  WHOAMI    /ALL "), "whoami /all");
});

test("T1033 whoami: matches whoami, not other commands", () => {
  assert.deepEqual(techniques("whoami /all"), ["T1033"]);
  assert.deepEqual(techniques("echo hello"), []);
});

test("T1082 systeminfo: matches systeminfo, not ipconfig", () => {
  assert.deepEqual(techniques("systeminfo.exe"), ["T1082"]);
  assert.deepEqual(techniques("ipconfig /all"), []);
});

test("T1087.001 net user: matches net user, not net use", () => {
  assert.deepEqual(techniques("net user"), ["T1087.001"]);
  assert.deepEqual(techniques("NET.EXE  User"), ["T1087.001"]);
  assert.deepEqual(techniques("net use Z: \\\\server\\share"), []);
});

test("detect: match includes the ATT&CK name and tactic", () => {
  const [match] = detect("systeminfo");
  assert.equal(match.name, "System Information Discovery");
  assert.equal(match.tactic, "Discovery");
});

test("scanLines: skips blanks and comments, records line numbers", () => {
  const log = ["# sample", "notepad.exe", "", "net user"].join("\n");
  const matches = scanLines(log);
  assert.equal(matches.length, 1);
  assert.equal(matches[0].line, 4);
  assert.equal(matches[0].technique, "T1087.001");
});

test("countByTechnique: counts each technique", () => {
  const matches = scanLines("whoami\nsysteminfo\nwhoami /all");
  assert.deepEqual(countByTechnique(matches), { T1033: 2, T1082: 1 });
});

test("countByTechnique: no matches gives an empty object", () => {
  assert.deepEqual(countByTechnique([]), {});
});
