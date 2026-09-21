#!/usr/bin/env node
/**
 * Keeps the JSON-LD `worksFor` in index.html in step with resume.json.
 *
 * The employer lives in four places (resume data, structured data, the PDF
 * template, the built PDF) and the structured one is the easiest to forget —
 * it is buried in a script tag and nothing renders it, so a stale value can
 * sit there telling search engines the wrong current employer indefinitely.
 * That is exactly what happened across the OESL to neuwerk change.
 *
 * "Current" means: no endDate, and a startDate that has already passed. A role
 * added ahead of its start date therefore does not become the advertised
 * employer until the day it begins.
 *
 * Runs on prebuild. Pass --check to fail instead of rewriting, for CI.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const RESUME = resolve(root, "public/data/resume.json");
const INDEX = resolve(root, "index.html");

const checkOnly = process.argv.includes("--check");

const resume = JSON.parse(readFileSync(RESUME, "utf8"));
const now = new Date();

const started = (entry) => {
  if (!entry.startDate) return true;
  const d = new Date(entry.startDate);
  return Number.isNaN(d.getTime()) ? true : d <= now;
};

const current = (resume.work ?? [])
  .filter((w) => !w.endDate && started(w))
  .sort((a, b) => String(b.startDate).localeCompare(String(a.startDate)))[0];

if (!current) {
  console.error("sync-structured-data: no current role in resume.json — leaving index.html alone");
  process.exit(0);
}

const html = readFileSync(INDEX, "utf8");
// Capture the line's own indentation so the rewrite matches the surrounding file.
const match = html.match(/([ \t]*)"worksFor":\s*\{[^}]*\}/);
if (!match) {
  console.error("sync-structured-data: no worksFor block in index.html");
  process.exit(1);
}

// Rebuilt from the data rather than string-patched, so the shape stays valid.
const fields = [`"@type": "Organization"`, `"name": ${JSON.stringify(current.name)}`];
if (current.url) fields.push(`"url": ${JSON.stringify(current.url)}`);
const outer = match[1];
const inner = `${outer}  `;
const replacement = `${outer}"worksFor": {\n${inner}${fields.join(`,\n${inner}`)}\n${outer}}`;

if (match[0] === replacement) {
  console.log(`sync-structured-data: worksFor already matches "${current.name}"`);
  process.exit(0);
}

if (checkOnly) {
  console.error(
    `sync-structured-data: index.html worksFor is stale — resume.json says "${current.name}".\n` +
      "Run `node scripts/sync-structured-data.mjs` to fix.",
  );
  process.exit(1);
}

const updated = html.replace(match[0], replacement);
// Confirm the JSON-LD still parses before writing over a working file.
const ld = updated.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
try {
  JSON.parse(ld[1]);
} catch (err) {
  console.error(
    "sync-structured-data: rewrite would produce invalid JSON-LD, aborting:",
    err.message,
  );
  process.exit(1);
}

writeFileSync(INDEX, updated);
console.log(`sync-structured-data: worksFor updated to "${current.name}"`);
