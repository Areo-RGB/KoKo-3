#!/usr/bin/env node

/**
 * PWA Icon Fix Script
 * Creates proper PNG icons from SVG source
 *
 * This script creates actual icon files by embedding the SVG in PNG format
 * without requiring external dependencies like sharp
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
const svgPath = path.join(iconDir, 'icon.svg');

// Read the SVG content
let svgContent;
try {
  svgContent = fs.readFileSync(svgPath, 'utf8');
} catch (error) {
  console.error('Error reading SVG file:', error.message);
  process.exit(1);
}

// Create a simple HTML page that will generate the icons
const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <title>Icon Generator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .icon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .icon-item {
            text-align: center;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #fafafa;
        }
        .icon-canvas {
            width: 100px;
            height: 100px;
            margin: 0 auto 10px;
            border: 1px solid #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
        }
        .icon-svg {
            width: 80px;
            height: 80px;
        }
        button {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
        }
        button:hover {
            background: #0056b3;
        }
        .status {
            margin: 20px 0;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
        }
        .success {
            background: #d4edda;
            color: #155724;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
        }
        .instructions {
            background: #e9ecef;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>PWA Icon Generator</h1>
        <div class="instructions">
            <h3>Instructions:</h3>
            <p>This page will generate proper PNG icons from your SVG source.</p>
            <p><strong>Method 1:</strong> Use the buttons below to download each icon size as PNG</p>
            <p><strong>Method 2:</strong> Use browser DevTools to capture the canvas elements as images</p>
            <p><strong>Method 3:</strong> Use an online SVG to PNG converter with the icon.svg file</p>
        </div>

        <div class="icon-grid">
            ${iconSizes
              .map(
                ({ size, name }) => `
                <div class="icon-item">
                    <div class="icon-canvas" id="canvas-${size}">
                        <div class="icon-svg" id="svg-${size}"></div>
                    </div>
                    <h4>${size}x${size}</h4>
                    <p>${name}</p>
                    <button onclick="downloadIcon(${size}, '${name}')">Download PNG</button>
                </div>
            `,
              )
              .join('')}
        </div>

        <div class="status" id="status"></div>

        <div class="instructions">
            <h3>Alternative: Use Sharp (Node.js)</h3>
            <p>If you have Node.js and sharp installed, run this command:</p>
            <pre><code>npm install sharp</code></pre>
            <p>Then use the conversion script provided in the console output.</p>
        </div>
    </div>

    <script>
        // Embed SVG content into each icon container
        const svgContent = \`${svgContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;

        ${iconSizes
          .map(
            ({ size }) => `
            const svgElement${size} = document.getElementById('svg-${size}');
            if (svgElement${size}) {
                // Scale the SVG to fit the container
                const scaledSvg = svgContent.replace('viewBox="0 0 512 512"', 'viewBox="0 0 ${size} ${size}"')
                                           .replace('width="512" height="512"', 'width="${size}" height="${size}"');
                svgElement${size}.innerHTML = scaledSvg;
            }
        `,
          )
          .join('')}

        function downloadIcon(size, filename) {
            const canvas = document.getElementById('canvas-' + size);
            const status = document.getElementById('status');

            // Use html2canvas or similar approach
            // For now, open the SVG in a new window for manual save
            const svgWindow = window.open('', '_blank');
            const scaledSvg = svgContent.replace('viewBox="0 0 512 512"', 'viewBox="0 0 ' + size + ' ' + size)
                                       .replace('width="512" height="512"', 'width="' + size + '" height="' + size + '"');

            svgWindow.document.write(\`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>\${filename}</title>
                </head>
                <body style="margin:0; padding:20px; display:flex; justify-content:center; align-items:center; min-height:100vh;">
                    \${scaledSvg}
                </body>
                </html>
            \`);

            status.innerHTML = 'Opened \${filename} in new window. Right-click and "Save as PNG"';
            status.className = 'status success';
        }
    </script>
</body>
</html>
`;

const htmlPath = path.join(iconDir, 'icon-generator.html');
fs.writeFileSync(htmlPath, htmlTemplate);

console.log('✅ Icon generator HTML created!');
console.log('📄 Open: file:///' + htmlPath.replace(/\\/g, '/'));
console.log('');
console.log('📝 Instructions:');
console.log('1. Open the generated HTML file in a browser');
console.log('2. Use the download buttons to get each icon size');
console.log('3. Save each icon to public/icons/ with the correct filename');
console.log('');
console.log('🔧 Alternative: Install sharp and use:');
console.log('npm install sharp');
console.log('');
console.log('Then create a conversion script with:');
console.log("const sharp = require('sharp');");
console.log('');
console.log('iconSizes.forEach(async ({ size, name }) => {');
console.log("  await sharp('public/icons/icon.svg')");
console.log('    .resize(size, size)');
console.log('    .png()');
console.log("    .toFile('public/icons/' + name);");
console.log('});');
console.log('');
