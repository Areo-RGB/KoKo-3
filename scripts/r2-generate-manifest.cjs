#!/usr/bin/env node
/*
 Generate a static manifest of public video URLs from R2 and write to data/r2-videos.json
 The page will import this JSON at build/runtime without pulling in AWS SDK.
 */
const fs = require('fs');
const path = require('path');
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const VIDEO_EXTS = new Set(['.mp4', '.mov', '.webm', '.m4v', '.mkv', '.avi']);

function parseEnvFile(filepath) {
  try {
    const text = fs.readFileSync(filepath, 'utf8');
    return Object.fromEntries(
      text
        .split(/\r?\n/)
        .filter((l) => /=/.test(l) && !l.trim().startsWith('#'))
        .map((l) => {
          const i = l.indexOf('=');
          return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
        }),
    );
  } catch {
    return {};
  }
}

function isVideo(key) {
  const dot = key.lastIndexOf('.');
  const ext = dot >= 0 ? key.slice(dot).toLowerCase() : '';
  return VIDEO_EXTS.has(ext);
}

function safeJoinUrl(base, key) {
  const trimmed = base.replace(/\/?$/, '');
  const parts = key.split('/').map(encodeURIComponent);
  return `${trimmed}/${parts.join('/')}`;
}

(async () => {
  const env = {
    ...parseEnvFile(path.resolve(process.cwd(), '.env.local')),
    ...process.env,
  };
  const endpoint = env.R2_ENDPOINT;
  const accessKeyId = env.R2_ACCESS_KEY_ID;
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
  const bucket = env.R2_BUCKET;
  const publicBase = env.bucketUrlPublic || env.R2_PUBLIC_BASE;

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket || !publicBase) {
    console.error(
      'Missing required env: R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, bucketUrlPublic',
    );
    process.exit(1);
  }

  const s3 = new S3Client({
    region: env.R2_REGION || 'auto',
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });

  const contents = [];
  let ContinuationToken;
  do {
    const res = await s3.send(
      new ListObjectsV2Command({ Bucket: bucket, ContinuationToken }),
    );
    contents.push(...(res.Contents || []));
    ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (ContinuationToken);

  const byFolder = new Map();
  for (const it of contents) {
    const key = it.Key || '';
    if (!key || !isVideo(key)) continue;
    const folder = key.includes('/') ? key.split('/')[0] : 'root';
    const title = key.split('/').pop() || key;
    const url = safeJoinUrl(publicBase, key);
    const arr = byFolder.get(folder) || [];
    arr.push({ key, title, url });
    byFolder.set(folder, arr);
  }

  const playlists = Array.from(byFolder.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, items]) => ({
      name,
      items: items.sort((a, b) => a.title.localeCompare(b.title)),
    }));

  const outDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'r2-videos.json');
  fs.writeFileSync(outPath, JSON.stringify({ playlists }, null, 2));
  console.log('Wrote manifest:', outPath, `(${playlists.length} playlists)`);
})();
