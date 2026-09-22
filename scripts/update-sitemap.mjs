// Keeps <lastmod> in public/sitemap.xml honest.
//
// This used to stamp today's date on every build, which had two problems. It
// rewrote a tracked file every time anyone ran `npm run build`, so `git status`
// was never clean afterwards and date churn leaked into unrelated commits. And
// it was not true: lastmod means "when this page last changed", so a site
// rebuilt daily was telling crawlers it changed daily — while the same file
// declared changefreq monthly, contradicting itself.
//
// The date now comes from the last commit that touched something the page
// actually renders. Rebuilding changes nothing; editing the CV does.
//
// Runs on prebuild. Pass --check to fail instead of rewriting, for CI.
import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const sitemapPath = resolve(root, "public/sitemap.xml");
const checkOnly = process.argv.includes("--check");

// What a visitor sees. Config and scripts are deliberately absent: changing a
// build script does not change the page.
const CONTENT = ["public/data/resume.json", "index.html", "src"];

/** Date of the most recent commit touching rendered content, or null. */
const lastContentChange = () => {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...CONTENT], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    // No git history — a tarball, or a shallow clone with nothing left to read.
    return null;
  }
};

try {
  const xml = await readFile(sitemapPath, "utf8");
  const date = lastContentChange();

  if (!date) {
    // Keeping a slightly old date is harmless; inventing today's is a claim.
    console.log("[update-sitemap] no git history available, leaving lastmod as it is");
    process.exit(0);
  }

  const updated = xml.replace(/<lastmod>.*?<\/lastmod>/g, `<lastmod>${date}</lastmod>`);

  if (updated === xml) {
    console.log(`[update-sitemap] lastmod already ${date}`);
    process.exit(0);
  }

  if (checkOnly) {
    console.error(`[update-sitemap] sitemap.xml is stale — last content change was ${date}.`);
    console.error("Run `node scripts/update-sitemap.mjs` to fix.");
    process.exit(1);
  }

  await writeFile(sitemapPath, updated, "utf8");
  console.log(`[update-sitemap] lastmod set to ${date}`);
} catch (error) {
  // A missing sitemap should not fail the build.
  console.warn(`[update-sitemap] skipped: ${error.message}`);
}
