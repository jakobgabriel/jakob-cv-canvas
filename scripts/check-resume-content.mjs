#!/usr/bin/env node
/**
 * Fails the build when a role that is already visible on the site has no
 * description, and warns about one that will become visible soon.
 *
 * A position can now be recorded ahead of its start date and appear on its own
 * on the day it begins. That is convenient, and it is exactly how an entry with
 * an empty summary ends up on the live site without anyone deciding to publish
 * it: the date passes, the browser re-renders, and a card that reads as a
 * hollow box is suddenly the first thing a visitor sees. Nothing else in the
 * pipeline looks at it — the timeline renders whatever resume.json holds.
 *
 * So the rule follows visibility, not data completeness:
 *   started, and no summary          -> error, the build stops
 *   starting within LEAD_DAYS, empty -> warning, there is still time
 *   further out, empty               -> fine, it is a placeholder
 *
 * Runs on prebuild alongside sync-structured-data.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const RESUME = resolve(here, "..", "public/data/resume.json");

/** How far ahead a still-empty role is worth mentioning — roughly a quarter. */
const LEAD_DAYS = 90;
const DAY = 24 * 60 * 60 * 1000;

const resume = JSON.parse(readFileSync(RESUME, "utf8"));
const now = new Date();

/** Days until the role starts: negative once it has begun. */
const daysUntil = (startDate) => {
  if (!startDate) return -Infinity;
  const d = new Date(startDate);
  // An unparseable date counts as started, matching hasStarted() on the site:
  // a typo should surface the role, not quietly exempt it from this check.
  if (Number.isNaN(d.getTime())) return -Infinity;
  return Math.ceil((d.getTime() - now.getTime()) / DAY);
};

const missing = (entry) => {
  const gaps = [];
  if (!entry.summary || !entry.summary.trim()) gaps.push("summary");
  // Either is a description. A role that has only just begun lists the brief
  // under responsibilities; achievements come later, and highlights replace
  // them in the drawer when they do.
  const bullets = (entry.highlights ?? []).length + (entry.responsibilities ?? []).length;
  if (bullets === 0) gaps.push("highlights or responsibilities");
  return gaps;
};

const errors = [];
const warnings = [];

for (const entry of resume.work ?? []) {
  const gaps = missing(entry);
  if (gaps.length === 0) continue;

  const where = `${entry.position} at ${entry.name}`;
  const days = daysUntil(entry.startDate);

  if (days <= 0) {
    errors.push(`  ${where} is live on the site with no ${gaps.join(" and ")}.`);
  } else if (days <= LEAD_DAYS) {
    warnings.push(
      `  ${where} becomes visible in ${days} days and still has no ${gaps.join(" and ")}.`,
    );
  }
}

if (warnings.length > 0) {
  console.warn(`check-resume-content: ${warnings.length} role(s) need filling in soon:`);
  for (const w of warnings) console.warn(w);
}

if (errors.length > 0) {
  console.error(`check-resume-content: ${errors.length} visible role(s) have no description:`);
  for (const e of errors) console.error(e);
  console.error("Add them to public/data/resume.json — the card renders empty without them.");
  process.exit(1);
}

if (warnings.length === 0)
  console.log("check-resume-content: every visible role has a description");
