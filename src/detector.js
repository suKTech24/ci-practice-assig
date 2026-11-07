// A tiny rule-based detector for process command lines.
// Each rule maps to one MITRE ATT&CK technique: https://attack.mitre.org/
//
// All three rules are in the Discovery tactic (TA0007): commands an attacker
// often runs right after getting access, to learn where they landed.

const RULES = [
  {
    technique: "T1033",
    name: "System Owner/User Discovery",
    tactic: "Discovery",
    pattern: /\bwhoami(\.exe)?\b/,
  },
  {
    technique: "T1082",
    name: "System Information Discovery",
    tactic: "Discovery",
    pattern: /\bsysteminfo(\.exe)?\b/,
  },
  {
    technique: "T1087.001",
    name: "Account Discovery: Local Account",
    tactic: "Discovery",
    pattern: /\bnet1?(\.exe)?\s+user\b/,
  },
];

/** Lowercase and collapse repeated spaces so "WHOAMI   /all" matches too. */
function normalizeCommand(command) {
  return command.replace(/\s+/g, " ").trim().toLowerCase();
}

/** ATT&CK matches for one command line (empty array if nothing matches). */
function detect(command, rules = RULES) {
  const normalized = normalizeCommand(command);
  return rules
    .filter((rule) => rule.pattern.test(normalized))
    .map(({ technique, name, tactic }) => ({ technique, name, tactic, command }));
}

/**
 * Scan a log with one command line per line.
 * Blank lines and lines starting with # are skipped.
 * Each match records the line number it came from.
 */
function scanLines(text, rules = RULES) {
  const matches = [];
  text.split(/\r?\n/).forEach((line, index) => {
    const command = line.trim();
    if (command === "" || command.startsWith("#")) return;
    for (const match of detect(command, rules)) {
      matches.push({ line: index + 1, ...match });
    }
  });
  return matches;
}

/** How many times each ATT&CK technique was seen, e.g. { T1033: 2 }. */
function countByTechnique(matches) {
  const counts = {};
  for (const { technique } of matches) {
    counts[technique] = (counts[technique] ?? 0) + 1;
  }
  return counts;
}

module.exports = { RULES, normalizeCommand, detect, scanLines, countByTechnique };
