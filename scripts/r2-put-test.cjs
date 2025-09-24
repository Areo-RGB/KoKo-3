#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

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
  const s3 = new S3Client({
    region: env.R2_REGION || 'auto',
    endpoint: env.R2_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });
  const Bucket = env.R2_BUCKET;
  const Key = (process.argv[2] || 'upload-test.txt').replace(/^\/+/, '');
  try {
    const r = await s3.send(
      new PutObjectCommand({
        Bucket,
        Key,
        Body: 'hello from test',
        ContentType: 'text/plain',
      }),
    );
    console.log('PutObject OK:', Key, r?.ETag || '');
  } catch (e) {
    console.error(
      'PutObject error:',
      e?.name,
      e?.$metadata?.httpStatusCode,
      e?.Code || e?.code,
      e?.message,
    );
    if (e?.$response?.body) {
      try {
        console.error('Body:', String(e.$response.body));
      } catch {}
    }
    process.exit(1);
  }
})();
