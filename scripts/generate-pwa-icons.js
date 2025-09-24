#!/usr/bin/env node

/**
 * PWA Icon Generator Script
 * Generates all required icon sizes for Progressive Web App
 *
 * This script creates placeholder PNG files since we need proper image conversion tools
 * In a real environment, you would use tools like:
 * - sharp (npm package)
 * - imagemagick
 * - inkscape
 *
 * For now, this creates minimal valid PNG files as placeholders
 */

const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA
const iconSizes = [
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 192, name: 'icon-192x192-maskable.png' },
  { size: 512, name: 'icon-512x512-maskable.png' },
];

const iconDir = path.join(__dirname, '..', 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Create a minimal valid PNG file (1x1 transparent pixel in base64)
const minimalPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
  'base64',
);

// Generate placeholder icons
iconSizes.forEach(({ size, name }) => {
  const iconPath = path.join(iconDir, name);

  // Check if icon already exists
  if (!fs.existsSync(iconPath)) {
    // Write minimal PNG as placeholder
    fs.writeFileSync(iconPath, minimalPNG);
    console.log(`Created placeholder icon: ${name} (${size}x${size})`);
  } else {
    console.log(`Icon already exists: ${name}`);
  }
});

// Create apple-touch-icon as well
const appleTouchIconPath = path.join(iconDir, 'apple-touch-icon.png');
if (!fs.existsSync(appleTouchIconPath)) {
  fs.writeFileSync(appleTouchIconPath, minimalPNG);
  console.log('Created placeholder apple-touch-icon.png');
}

// Create favicon.ico placeholder
const faviconPath = path.join(__dirname, '..', 'public', 'favicon.ico');
if (!fs.existsSync(faviconPath)) {
  // Minimal ICO file header + 1x1 pixel
  const minimalICO = Buffer.from([
    0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00,
    0x18, 0x00, 0x30, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00, 0x28, 0x00,
    0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x01, 0x00,
    0x18, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  ]);
  fs.writeFileSync(faviconPath, minimalICO);
  console.log('Created placeholder favicon.ico');
}

console.log('\n✅ PWA icons generation complete!');
console.log('\n📝 Note: These are placeholder icons. To create proper icons:');
console.log('1. Install sharp: npm install sharp');
console.log('2. Use the SVG files in /public/icons/ as source');
console.log('3. Convert to PNG using sharp or other image tools');
console.log('4. Replace the placeholder files created by this script');

// Instructions for manual conversion
console.log('\n🔧 Manual conversion example with sharp:');
console.log(`
const sharp = require('sharp');

// Convert SVG to different sizes
iconSizes.forEach(async ({ size, name }) => {
  await sharp('public/icons/icon.svg')
    .resize(size, size)
    .png()
    .toFile(\`public/icons/\${name}\`);
});
`);
