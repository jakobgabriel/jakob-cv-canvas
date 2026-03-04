import sharp from 'sharp';
import { readFileSync } from 'fs';
import { mkdirSync } from 'fs';

// Ensure output directory exists
mkdirSync('public/linkedin', { recursive: true });

// Brand colors
const TEAL      = '#246B65';
const TEAL_LIGHT = '#32857E';
const TEAL_PALE  = '#e8f4f2';
const DARK       = '#1a2332';
const GRAY       = '#64748b';
const LIGHT_GRAY = '#94a3b8';

// Resume data
const resume = JSON.parse(readFileSync('public/data/resume.json', 'utf-8'));
const name = resume.basics.name;
const title = resume.basics.label;
const url = 'jakobgabriel.github.io/jakob-cv-canvas';

// Helper: escape XML entities
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Skill keywords for decoration
const keywords = ['Industry 4.0', 'Smart Factory', 'AI', 'Python', 'Power BI', 'MS Fabric', 'IoT', 'Digital Twin'];

// ─── 1. LinkedIn Banner (1584 x 396) ───
function bannerSvg() {
  const w = 1584, h = 396;
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${DARK};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#0f1923;stop-opacity:1"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <!-- Teal accent bar left -->
  <rect x="0" y="0" width="6" height="${h}" fill="${TEAL}"/>
  <!-- Decorative circles -->
  <circle cx="${w - 200}" cy="80" r="260" fill="${TEAL}" opacity="0.06"/>
  <circle cx="${w - 80}" cy="320" r="180" fill="${TEAL_LIGHT}" opacity="0.04"/>
  <circle cx="300" cy="380" r="120" fill="${TEAL}" opacity="0.03"/>
  <!-- Accent line -->
  <rect x="80" y="100" width="60" height="4" rx="2" fill="${TEAL}"/>
  <!-- Name -->
  <text x="80" y="165" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="bold" fill="#ffffff">${esc(name)}</text>
  <!-- Title -->
  <text x="80" y="215" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="${LIGHT_GRAY}">${esc(title)}</text>
  <!-- Stats -->
  <text x="80" y="275" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="${TEAL_LIGHT}">7+ Years  ·  150+ Use Cases  ·  €1M+ Savings  ·  8+ Global Sites</text>
  <!-- Keywords pills -->
  ${keywords.map((kw, i) => {
    const x = 80 + i * 150;
    if (x > w - 200) return '';
    return `<rect x="${x}" y="310" width="${kw.length * 10 + 20}" height="28" rx="14" fill="${TEAL}" opacity="0.2"/>
    <text x="${x + 10 + kw.length * 5}" y="329" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="${TEAL_LIGHT}" text-anchor="middle">${esc(kw)}</text>`;
  }).join('\n  ')}
  <!-- URL -->
  <text x="${w - 40}" y="375" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="${GRAY}" text-anchor="end">${url}</text>
</svg>`;
}

// ─── 2. Post Image (1200 x 627) ───
function postSvg() {
  const w = 1200, h = 627;
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${TEAL};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:${TEAL_LIGHT};stop-opacity:1"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg2)"/>
  <!-- Decorative shapes -->
  <circle cx="${w - 150}" cy="120" r="200" fill="#ffffff" opacity="0.04"/>
  <circle cx="100" cy="${h - 80}" r="160" fill="#ffffff" opacity="0.03"/>
  <rect x="${w - 300}" y="${h - 200}" width="350" height="250" rx="20" fill="#ffffff" opacity="0.03" transform="rotate(-15 ${w - 125} ${h - 75})"/>
  <!-- Content card -->
  <rect x="60" y="60" width="${w - 120}" height="${h - 120}" rx="20" fill="#ffffff" opacity="0.12"/>
  <!-- Accent bar -->
  <rect x="100" y="120" width="60" height="5" rx="2.5" fill="#ffffff"/>
  <!-- Name -->
  <text x="100" y="195" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="bold" fill="#ffffff">${esc(name)}</text>
  <!-- Title -->
  <text x="100" y="245" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#ffffff" opacity="0.85">${esc(title)}</text>
  <!-- Divider -->
  <rect x="100" y="275" width="${w - 200}" height="1" fill="#ffffff" opacity="0.2"/>
  <!-- Stats boxes -->
  ${[
    { label: '7+', sub: 'Years Experience' },
    { label: '150+', sub: 'Use Cases Scaled' },
    { label: '€1M+', sub: 'Annual Savings' },
    { label: '8+', sub: 'Global Sites' },
  ].map((s, i) => {
    const bx = 100 + i * 260;
    return `<text x="${bx}" y="340" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="bold" fill="#ffffff">${s.label}</text>
    <text x="${bx}" y="368" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#ffffff" opacity="0.75">${s.sub}</text>`;
  }).join('\n  ')}
  <!-- Keywords -->
  <text x="100" y="430" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#ffffff" opacity="0.7">${keywords.join('  ·  ')}</text>
  <!-- Summary -->
  <text x="100" y="490" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#ffffff" opacity="0.6">Digital Transformation · Advanced Analytics · Smart Factory · Manufacturing Intelligence</text>
  <!-- URL -->
  <text x="${w / 2}" y="${h - 50}" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#ffffff" opacity="0.5" text-anchor="middle">${url}</text>
</svg>`;
}

// ─── 3. Article Cover (1200 x 644) ───
function articleSvg() {
  const w = 1200, h = 644;
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${DARK};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#0c1220;stop-opacity:1"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg3)"/>
  <!-- Teal accent strip top -->
  <rect x="0" y="0" width="${w}" height="5" fill="${TEAL}"/>
  <!-- Decorative -->
  <circle cx="${w - 100}" cy="200" r="300" fill="${TEAL}" opacity="0.05"/>
  <circle cx="200" cy="${h}" r="200" fill="${TEAL}" opacity="0.04"/>
  <!-- Grid pattern hint -->
  ${Array.from({ length: 8 }, (_, i) =>
    `<rect x="${w - 400 + i * 45}" y="400" width="1" height="200" fill="${TEAL}" opacity="0.08"/>`
  ).join('\n  ')}
  ${Array.from({ length: 5 }, (_, i) =>
    `<rect x="${w - 400}" y="${400 + i * 45}" width="350" height="1" fill="${TEAL}" opacity="0.08"/>`
  ).join('\n  ')}
  <!-- Content -->
  <rect x="80" y="120" width="60" height="5" rx="2.5" fill="${TEAL}"/>
  <text x="80" y="200" font-family="Arial, Helvetica, sans-serif" font-size="54" font-weight="bold" fill="#ffffff">${esc(name)}</text>
  <text x="80" y="250" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="${LIGHT_GRAY}">${esc(title)}</text>
  <!-- Focus areas -->
  ${['Industry 4.0 &amp; Smart Factory', 'Data Analytics &amp; AI', 'Process Optimization', 'Digital Transformation'].map((area, i) => {
    const y = 320 + i * 50;
    return `<rect x="80" y="${y - 5}" width="4" height="30" rx="2" fill="${TEAL}"/>
    <text x="100" y="${y + 18}" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#ffffff" opacity="0.85">${area}</text>`;
  }).join('\n  ')}
  <!-- URL -->
  <text x="80" y="${h - 40}" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="${GRAY}">${url}</text>
</svg>`;
}

// ─── 4. Square Profile Card (400 x 400) ───
function profileCardSvg() {
  const w = 400, h = 400;
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${TEAL};stop-opacity:1"/>
      <stop offset="50%" style="stop-color:${TEAL_LIGHT};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:${TEAL};stop-opacity:1"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg4)"/>
  <!-- Decorative -->
  <circle cx="${w}" cy="0" r="150" fill="#ffffff" opacity="0.05"/>
  <circle cx="0" cy="${h}" r="120" fill="#ffffff" opacity="0.04"/>
  <!-- Initials circle -->
  <circle cx="${w / 2}" cy="130" r="60" fill="#ffffff" opacity="0.15"/>
  <text x="${w / 2}" y="148" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="bold" fill="#ffffff" text-anchor="middle">JG</text>
  <!-- Name -->
  <text x="${w / 2}" y="240" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="bold" fill="#ffffff" text-anchor="middle">${esc(name)}</text>
  <!-- Title (wrapped) -->
  <text x="${w / 2}" y="275" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#ffffff" opacity="0.85" text-anchor="middle">${esc(title)}</text>
  <!-- Divider -->
  <rect x="${w / 2 - 30}" y="295" width="60" height="2" rx="1" fill="#ffffff" opacity="0.4"/>
  <!-- Key stats -->
  <text x="${w / 2}" y="335" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#ffffff" opacity="0.75" text-anchor="middle">7+ Years · 150+ Use Cases · €1M+ Savings</text>
  <!-- URL -->
  <text x="${w / 2}" y="375" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#ffffff" opacity="0.5" text-anchor="middle">${url}</text>
</svg>`;
}

// Generate all images
const images = [
  { name: 'linkedin-banner',       svg: bannerSvg(),      w: 1584, h: 396,  desc: 'LinkedIn Banner' },
  { name: 'linkedin-post',         svg: postSvg(),        w: 1200, h: 627,  desc: 'Post Image' },
  { name: 'linkedin-article-cover',svg: articleSvg(),     w: 1200, h: 644,  desc: 'Article Cover' },
  { name: 'linkedin-profile-card', svg: profileCardSvg(), w: 400,  h: 400,  desc: 'Profile Card' },
];

for (const img of images) {
  await sharp(Buffer.from(img.svg))
    .png()
    .toFile(`public/linkedin/${img.name}.png`);
  console.log(`✓ ${img.desc} → public/linkedin/${img.name}.png (${img.w}×${img.h})`);
}

console.log('\nAll LinkedIn images generated successfully!');
