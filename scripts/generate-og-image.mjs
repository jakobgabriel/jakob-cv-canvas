import sharp from 'sharp';
import { readFileSync } from 'fs';

// Create a 1200x630 OG preview image — white background with green accents,
// matching the live site (white bg, teal-green primary). This is the image
// LinkedIn, Twitter, etc. scrape for link previews via og:image / twitter:image.
const width = 1200;
const height = 630;

// Brand colors (mirror scripts/generate-linkedin-images.mjs)
const TEAL       = '#246B65';
const TEAL_LIGHT = '#32857E';
const DARK       = '#1a2332';
const SLATE      = '#475569';
const GRAY       = '#64748b';
const LIGHT_GRAY = '#94a3b8';

// Pull name/title from the canonical resume data for consistency
const resume = JSON.parse(readFileSync('public/data/resume.json', 'utf-8'));
const name = resume.basics.name;
const title = resume.basics.label;
const url = 'jakobgabriel.github.io/jakob-cv-canvas';

// Escape XML entities
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f8fafc;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- White card -->
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <!-- Decorative teal circles, very subtle on white -->
  <circle cx="1050" cy="150" r="120" fill="${TEAL}" opacity="0.05"/>
  <circle cx="1100" cy="400" r="180" fill="${TEAL_LIGHT}" opacity="0.04"/>
  <!-- Top accent bar -->
  <rect x="80" y="180" width="60" height="5" rx="2.5" fill="${TEAL}"/>
  <!-- Name -->
  <text x="80" y="252" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="bold" fill="${DARK}">${esc(name)}</text>
  <!-- Title -->
  <text x="80" y="310" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="${SLATE}">${esc(title)}</text>
  <!-- Stats row -->
  <text x="80" y="392" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="bold" fill="${TEAL}">7+ Years</text>
  <text x="230" y="392" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="${LIGHT_GRAY}">|</text>
  <text x="260" y="392" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="bold" fill="${TEAL}">150+ Use Cases</text>
  <text x="510" y="392" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="${LIGHT_GRAY}">|</text>
  <text x="540" y="392" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="bold" fill="${TEAL}">€1M+ Savings</text>
  <!-- Keywords -->
  <text x="80" y="452" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="${GRAY}">Industry 4.0 · Smart Factory · AI · Python · Power BI · MS Fabric</text>
  <!-- Bottom tagline -->
  <text x="80" y="542" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="${LIGHT_GRAY}">${url}</text>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile('public/og-preview.png');

console.log('OG preview image generated: public/og-preview.png');
