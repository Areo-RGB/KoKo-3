#!/usr/bin/env node

/**
 * Proper Icon Generator using Sharp
 * Generates all required PWA icon sizes from SVG source
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconDir = path.join(__dirname, '..', 'public', 'icons');
const svgPath = path.join(iconDir, 'icon.svg');

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
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
];

// Ensure icons directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

async function generateIcons() {
  console.log('🔧 Starting icon generation...');

  try {
    // Read SVG content
    const svgBuffer = fs.readFileSync(svgPath);

    for (const { size, name } of iconSizes) {
      const outputPath = path.join(iconDir, name);

      // Skip if already properly sized (not 70 bytes)
      try {
        const stats = fs.statSync(outputPath);
        if (stats.size > 100) {
          console.log(
            `✅ ${name} already exists and is properly sized (${stats.size} bytes)`,
          );
          continue;
        }
      } catch (error) {
        // File doesn't exist or has wrong size, generate it
      }

      console.log(`📸 Generating ${name} (${size}x${size})...`);

      await sharp(svgBuffer)
        .resize(size, size)
        .png({ quality: 90 })
        .toFile(outputPath);

      console.log(`✅ Generated ${name}`);
    }

    // Generate apple-touch-icon as well
    const appleTouchIconPath = path.join(iconDir, 'apple-touch-icon.png');
    try {
      const stats = fs.statSync(appleTouchIconPath);
      if (stats.size <= 100) {
        console.log('📱 Generating apple-touch-icon.png (180x180)...');
        await sharp(svgBuffer)
          .resize(180, 180)
          .png({ quality: 90 })
          .toFile(appleTouchIconPath);
        console.log('✅ Generated apple-touch-icon.png');
      } else {
        console.log(
          '✅ apple-touch-icon.png already exists and is properly sized',
        );
      }
    } catch (error) {
      console.log('📱 Generating apple-touch-icon.png (180x180)...');
      await sharp(svgBuffer)
        .resize(180, 180)
        .png({ quality: 90 })
        .toFile(appleTouchIconPath);
      console.log('✅ Generated apple-touch-icon.png');
    }

    console.log('');
    console.log('🎉 All icons generated successfully!');
    console.log('');
    console.log('📋 Generated sizes:');
    iconSizes.forEach(({ size, name }) => {
      console.log(`  - ${name} (${size}x${size})`);
    });
    console.log('  - apple-touch-icon.png (180x180)');
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    console.error('Make sure the SVG file exists at:', svgPath);
    process.exit(1);
  }
}

generateIcons();
