#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseDotEnv(content) {
  const out = {};
  for (const line of content.split(/\r?\n/)) {
    const s = line.trim();
    if (!s || s.startsWith('#')) continue;
    const i = s.indexOf('=');
    if (i < 0) continue;
    const k = s.slice(0, i).trim();
    const v = s.slice(i + 1).trim();
    out[k] = v;
  }
  return out;
}

(async () => {
  const envPath = path.resolve(process.cwd(), '.env.local');
  const env = fs.existsSync(envPath)
    ? parseDotEnv(fs.readFileSync(envPath, 'utf8'))
    : {};
  const accountId = env.R2_ACCOUNT_ID;
  const token = env.R2_CF_API_TOKEN;
  const bucket = env.R2_BUCKET || process.argv[2];
  if (!accountId) {
    console.error('Missing R2_ACCOUNT_ID');
    process.exit(1);
  }
  if (!token) {
    console.error('Missing R2_CF_API_TOKEN');
    process.exit(1);
  }
  if (!bucket) {
    console.error(
      'Usage: node scripts/r2-create-bucket.cjs <bucketName> (or set R2_BUCKET)',
    );
    process.exit(1);
  }
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: bucket }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error(
        'Create bucket failed:',
        res.status,
        res.statusText,
        JSON.stringify(data),
      );
      process.exit(1);
    }
    console.log('Bucket created:', bucket);
  } catch (e) {
    console.error('Create bucket error:', e?.message || e);
    process.exit(1);
  }
})();
