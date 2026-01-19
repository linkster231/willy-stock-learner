/**
 * Generate PWA icons using Sharp
 * Run with: node scripts/generate-icons.mjs
 */

import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'public', 'icons');

// Ensure icons directory exists
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

// Create a simple icon with the chart emoji and app name
async function createIcon(size, filename) {
  // Create a blue gradient background with text
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6"/>
          <stop offset="100%" style="stop-color:#1d4ed8"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#bg)"/>
      <text x="${size/2}" y="${size * 0.55}"
            font-family="Arial, sans-serif"
            font-size="${size * 0.45}"
            font-weight="bold"
            fill="white"
            text-anchor="middle"
            dominant-baseline="middle">W</text>
      <text x="${size/2}" y="${size * 0.8}"
            font-family="Arial, sans-serif"
            font-size="${size * 0.12}"
            fill="white"
            text-anchor="middle">STOCK</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(join(iconsDir, filename));

  console.log(`Created ${filename}`);
}

// Generate all required icons
async function main() {
  try {
    await createIcon(192, 'icon-192x192.png');
    await createIcon(512, 'icon-512x512.png');
    await createIcon(96, 'calculator.png');
    await createIcon(96, 'trading.png');

    // Create screenshot placeholders
    await sharp({
      create: {
        width: 1280,
        height: 720,
        channels: 4,
        background: { r: 37, g: 99, b: 235, alpha: 1 }
      }
    }).png().toFile(join(iconsDir, 'screenshot-wide.png'));
    console.log('Created screenshot-wide.png');

    await sharp({
      create: {
        width: 720,
        height: 1280,
        channels: 4,
        background: { r: 37, g: 99, b: 235, alpha: 1 }
      }
    }).png().toFile(join(iconsDir, 'screenshot-narrow.png'));
    console.log('Created screenshot-narrow.png');

    console.log('\nAll icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

main();
