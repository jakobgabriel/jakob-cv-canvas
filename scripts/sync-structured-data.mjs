#!/usr/bin/env node
/**
 * Keeps the JSON-LD in index.html in step with resume.json.
 *
 * The employer and job title live in several places — resume data, structured
 * data, the page's own meta tags, the PDF — and the structured one is the
 * easiest to forget: it is buried in a script tag and nothing renders it, so a
 * stale value can sit there telling search engines the wrong thing
 * indefinitely. That is exactly what happened across the OESL to neuwerk
 * change.
 *
 * Four fields follow the current role: worksFor, jobTitle, and the name and
 * location of the single hasOccupation entry. They move together on purpose.
 * Updating the employer alone would have produced structured data claiming a
 * job that does not exist — the old title at the new company — which is worse
 * than being uniformly out of date.
 *
 * What it deliberately leaves alone is the page's positioning: <title>, the
 * social cards, and the JSON-LD `name` and `description` are a personal brand
 * that outlives any one job, and are edited by hand.
 *
 * "Current" means a startDate that has passed and no endDate that has, the
 * same rule the site uses to render a role as ongoing.
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

// An end date still in the future belongs to a role the person is still in —
// the same rule the site uses to render it as "Present".
const ended = (entry) => {
  if (!entry.endDate) return false;
  const d = new Date(entry.endDate);
  return Number.isNaN(d.getTime()) ? true : d <= now;
};

const current = (resume.work ?? [])
  .filter((w) => !ended(w) && started(w))
  .sort((a, b) => String(b.startDate).localeCompare(String(a.startDate)))[0];

if (!current) {
  console.error("sync-structured-data: no current role in resume.json — leaving index.html alone");
  process.exit(0);
}

const html = readFileSync(INDEX, "utf8");
const block = html.match(/([ \t]*)<script type="application\/ld\+json">\n([\s\S]*?)\n[ \t]*<\/script>/);
if (!block) {
  console.error("sync-structured-data: no JSON-LD block in index.html");
  process.exit(1);
}

const [full, outer, body] = block;

// Parsed and re-serialised rather than string-patched. With four fields to
// keep in step, a regex per field is how one of them quietly stops matching
// after an unrelated edit and goes stale without anyone noticing.
let graph;
try {
  graph = JSON.parse(body);
} catch (err) {
  console.error("sync-structured-data: index.html holds invalid JSON-LD:", err.message);
  process.exit(1);
}

const person = (graph["@graph"] ?? []).find((node) => node["@type"] === "Person");
if (!person) {
  console.error("sync-structured-data: no Person node in the JSON-LD");
  process.exit(1);
}

person.worksFor = {
  "@type": "Organization",
  name: current.name,
  ...(current.url ? { url: current.url } : {}),
};
person.jobTitle = current.position;

const occupation = (person.hasOccupation ?? [])[0];
if (occupation) {
  occupation.name = current.position;
  if (current.location) {
    occupation.occupationLocation = { "@type": "Place", name: current.location };
  } else {
    delete occupation.occupationLocation;
  }
  if (current.keywords?.length) occupation.skills = current.keywords.join(", ");
}

const inner = `${outer}  `;
const serialised = JSON.stringify(graph, null, 2)
  .split("\n")
  .map((line) => `${inner}${line}`)
  .join("\n");
const replacement = `${outer}<script type="application/ld+json">\n${serialised}\n${outer}</script>`;

if (full === replacement) {
  console.log(`sync-structured-data: JSON-LD already matches "${current.position}, ${current.name}"`);
  process.exit(0);
}

if (checkOnly) {
  console.error(
    `sync-structured-data: index.html JSON-LD is stale — resume.json says ` +
      `"${current.position}" at "${current.name}".\n` +
      "Run `node scripts/sync-structured-data.mjs` to fix.",
  );
  process.exit(1);
}

const updated = html.replace(full, replacement);
// Confirm the result still parses before writing over a working file.
try {
  JSON.parse(updated.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
} catch (err) {
  console.error("sync-structured-data: rewrite would produce invalid JSON-LD, aborting:", err.message);
  process.exit(1);
}

writeFileSync(INDEX, updated);
console.log(`sync-structured-data: JSON-LD updated to "${current.position}, ${current.name}"`);
