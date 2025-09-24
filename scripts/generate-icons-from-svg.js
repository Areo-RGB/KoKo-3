#!/usr/bin/env node

/**
 * Simple Icon Generator from SVG
 * Creates PNG icons by generating HTML and using browser capabilities
 *
 * This script creates a simple HTML file that can be used to generate
 * proper PNG icons from the SVG source using browser canvas API
 */

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
  { size: 384, name: 'icon-384x384.png' },
];

// Read SVG content
let svgContent;
try {
  svgContent = fs.readFileSync(svgPath, 'utf8');
} catch (error) {
  console.error('Error reading SVG file:', error.message);
  process.exit(1);
}

// Create HTML generator for icons
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Icon Generator</title>
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
</head>
<body>
    <h1>Icon Generator</h1>
    <p>This page generates PNG icons from SVG. Click each button to generate the icon.</p>

    <div id="icons-container">
        ${iconSizes
          .map(
            ({ size, name }) => `
            <div style="margin: 20px; text-align: center;">
                <div id="svg-container-${size}" style="display: inline-block; margin: 10px;">
                    ${svgContent
                      .replace(
                        'viewBox="0 0 512 512"',
                        `viewBox="0 0 ${size} ${size}"`,
                      )
                      .replace(
                        'width="512" height="512"',
                        `width="${size}" height="${size}"`,
                      )}
                </div>
                <br>
                <button onclick="generateIcon(${size}, '${name}')">${size}x${size} - ${name}</button>
            </div>
        `,
          )
          .join('')}
    </div>

    <script>
        async function generateIcon(size, filename) {
            const container = document.getElementById('svg-container-' + size);

            try {
                const canvas = await html2canvas(container, {
                    width: size,
                    height: size,
                    scale: 1,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: null
                });

                // Create download link
                const link = document.createElement('a');
                link.download = filename;
                link.href = canvas.toDataURL('image/png');
                link.click();

                console.log('Generated: ' + filename);
            } catch (error) {
                console.error('Error generating icon:', error);
                alert('Error generating icon: ' + error.message);
            }
        }

        // Auto-generate all icons after page load
        window.addEventListener('load', function() {
            console.log('Page loaded. Starting auto-generation...');

            let index = 0;
            function generateNext() {
                if (index < ${iconSizes.length}) {
                    const { size, name } = ${JSON.stringify(iconSizes)}[index];
                    console.log('Generating ' + name + '...');
                    generateIcon(size, name).then(() => {
                        index++;
                        if (index < ${iconSizes.length}) {
                            setTimeout(generateNext, 1000); // Wait 1 second between generations
                        }
                    });
                } else {
                    console.log('All icons generated!');
                }
            }

            setTimeout(generateNext, 1000); // Start after 1 second
        });
    </script>
</body>
</html>
`;

const outputPath = path.join(iconDir, 'icon-batch-generator.html');
fs.writeFileSync(outputPath, htmlContent);

console.log('✅ Icon batch generator created!');
console.log('📄 Open: file:///' + outputPath.replace(/\\/g, '/'));
console.log('');
console.log('📝 Instructions:');
console.log('1. Open the HTML file in Chrome or Firefox');
console.log('2. Wait for auto-generation (check browser console)');
console.log('3. Download all generated PNG files');
console.log('4. Move them to public/icons/ with correct names');
console.log('');
console.log('🔧 Alternative manual approach:');
console.log('1. Open public/icons/icon.svg in browser');
console.log('2. Right-click → Save as → Choose PNG format');
console.log('3. Repeat for each required size manually');
console.log('');
console.log('📋 Required sizes for PWA manifest:');
iconSizes.forEach(({ size, name }) => {
  console.log('  - ' + name + ' (' + size + 'x' + size + ')');
});
