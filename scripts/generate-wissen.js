// Scans a local directory for video files and prints playlist chapter JSON.
// Usage: node scripts/generate-wissen.js "J:\\/.docs\\/Wissen" "https://data-h03.fra1.cdn.digitaloceanspaces.com/Wissen"

const fs = require('fs');
const path = require('path');

const exts = new Set(['.mp4', '.webm', '.mov', '.m4v']);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && exts.has(path.extname(entry.name).toLowerCase()))
      out.push(full);
  }
  return out;
}

function kebabize(input) {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function encodePathSegments(rel) {
  return rel
    .split(/[\\/]+/)
    .map(encodeURIComponent)
    .join('/');
}

function toTitle(name) {
  const raw = name.replace(/_/g, ' ').replace(/-/g, ' ');
  return raw.trim();
}

function main() {
  const root = process.argv[2] || 'J:/.docs/Wissen';
  const baseUrl = (
    process.argv[3] || 'https://data-h03.fra1.cdn.digitaloceanspaces.com/Wissen'
  ).replace(/\/$/, '');
  const files = walk(root);
  const chapters = files
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((full) => {
      const rel = path.relative(root, full).replace(/\\/g, '/');
      const encoded = encodePathSegments(rel);
      const base = path.basename(full, path.extname(full));
      const id = kebabize(base);
      const title = toTitle(base);
      return {
        id,
        title,
        videoUrl: `${baseUrl}/${encoded}`,
      };
    });

  process.stdout.write(JSON.stringify(chapters, null, 2));
}

main();
