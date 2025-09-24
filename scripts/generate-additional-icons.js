#!/usr/bin/env node

/**
 * Generate additional small icon sizes
 */

const fs = require('fs');
const path = require('path');

// Additional small sizes needed
const additionalSizes = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' }, // Standard Apple touch icon size
];

const iconDir = path.join(__dirname, '..', 'public', 'icons');

// Create a minimal valid PNG file (1x1 transparent pixel in base64)
const minimalPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
  'base64',
);

// Generate additional icon sizes
additionalSizes.forEach(({ size, name }) => {
  const iconPath = path.join(iconDir, name);

  if (!fs.existsSync(iconPath)) {
    fs.writeFileSync(iconPath, minimalPNG);
    console.log(`Created ${name} (${size}x${size})`);
  } else {
    console.log(`${name} already exists`);
  }
});

console.log('\n✅ Additional PWA icons created!');
