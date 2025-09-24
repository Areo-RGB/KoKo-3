#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { S3Client, HeadBucketCommand } = require('@aws-sdk/client-s3');

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
  try {
    await s3.send(new HeadBucketCommand({ Bucket: env.R2_BUCKET }));
    console.log('HeadBucket OK:', env.R2_BUCKET);
  } catch (e) {
    console.error(
      'HeadBucket error:',
      e?.name,
      e?.$metadata?.httpStatusCode,
      e?.message,
    );
    process.exitCode = 1;
  }
})();
