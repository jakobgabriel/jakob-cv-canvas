import sharp from 'sharp';

// Create a 1200x630 OG preview image
const width = 1200;
const height = 630;

const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0e1319;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a2332;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <!-- Subtle accent line -->
  <rect x="80" y="180" width="60" height="4" rx="2" fill="#3b82f6"/>
  <!-- Name -->
  <text x="80" y="250" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="bold" fill="#ffffff">Jakob Gabriel</text>
  <!-- Title -->
  <text x="80" y="310" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#94a3b8">Digital Business Value Engineer</text>
  <!-- Stats row -->
  <text x="80" y="390" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#3b82f6">7+ Years</text>
  <text x="230" y="390" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#475569">|</text>
  <text x="260" y="390" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#3b82f6">150+ Use Cases</text>
  <text x="510" y="390" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#475569">|</text>
  <text x="540" y="390" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#3b82f6">€1M+ Savings</text>
  <!-- Keywords -->
  <text x="80" y="450" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#64748b">Industry 4.0 · Smart Factory · AI · Python · Power BI · MS Fabric</text>
  <!-- Bottom tagline -->
  <text x="80" y="540" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#475569">jakobgabriel.github.io/jakob-cv-canvas</text>
  <!-- Decorative circles -->
  <circle cx="1050" cy="150" r="120" fill="#3b82f6" opacity="0.05"/>
  <circle cx="1100" cy="400" r="180" fill="#3b82f6" opacity="0.03"/>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile('public/og-preview.png');

console.log('OG preview image generated: public/og-preview.png');
