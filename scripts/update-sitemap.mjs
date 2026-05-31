// Rewrites the <lastmod> date(s) in public/sitemap.xml to today's date.
// Runs automatically before `npm run build` (see the "prebuild" script) so the
// deployed sitemap always reflects the latest build date instead of a value
// that was hardcoded by hand.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sitemapPath = resolve(__dirname, "../public/sitemap.xml");

const today = new Date().toISOString().split("T")[0];

try {
  const xml = await readFile(sitemapPath, "utf8");
  const updated = xml.replace(/<lastmod>.*?<\/lastmod>/g, `<lastmod>${today}</lastmod>`);

  if (updated !== xml) {
    await writeFile(sitemapPath, updated, "utf8");
    console.log(`[update-sitemap] lastmod set to ${today}`);
  } else {
    console.log(`[update-sitemap] lastmod already ${today}, no change`);
  }
} catch (error) {
  // Don't fail the build if the sitemap is missing — just warn.
  console.warn(`[update-sitemap] skipped: ${error.message}`);
}
