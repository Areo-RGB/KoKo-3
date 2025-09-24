import fs from 'fs';
import path from 'path';

// Scans a local directory for video files and prints playlist chapter JSON.
// Usage: ts-node scripts/generate-wissen.ts "J:\\/.docs\\/Wissen" "https://data-h03.fra1.cdn.digitaloceanspaces.com/Wissen"

const exts = new Set(['.mp4', '.webm', '.mov', '.m4v']);

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && exts.has(path.extname(entry.name).toLowerCase()))
      out.push(full);
  }
  return out;
}

function kebabize(input: string): string {
  // Convert to lowercase, replace spaces/underscores with hyphens, strip non-url chars except hyphen
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function encodePathSegments(rel: string): string {
  return rel
    .split(/[\\/]+/)
    .map(encodeURIComponent)
    .join('/');
}

function toTitle(name: string): string {
  const raw = name.replace(/_/g, ' ').replace(/-/g, ' ');
  // Keep unicode letters; just trim
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

  // Print ready-to-paste JSON array
  process.stdout.write(JSON.stringify(chapters, null, 2));
}

main();
