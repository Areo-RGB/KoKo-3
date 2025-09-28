#!/usr/bin/env node
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');

const fs = require('fs');
const path = require('path');

function parseDotEnv(content) {
  const out = {};
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq === -1) return;
    const k = trimmed.slice(0, eq).trim();
    let v = trimmed.slice(eq + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  });
  return out;
}

async function loadEnv() {
  const abs = path.resolve(process.cwd(), '.env.local');
  try {
    const content = await fs.promises.readFile(abs, 'utf8');
    return parseDotEnv(content);
  } catch (err) {
    console.warn(`Warning: could not read env file at ${abs}: ${err.message}`);
    return {};
  }
}

async function main() {
  const env = Object.assign({}, await loadEnv(), process.env);
  
  const accessKeyId = env.R2_ACCESS_KEY_ID;
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
  const endpoint = env.R2_ENDPOINT || (env.R2_ACCOUNT_ID
    ? `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
    : undefined);
  const region = env.R2_REGION || 'auto';

  if (!accessKeyId || !secretAccessKey) {
    throw new Error('Missing R2 credentials');
  }
  if (!endpoint) {
    throw new Error('Missing R2 endpoint');
  }

  const s3 = new S3Client({
    region,
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });

  try {
    const response = await s3.send(new ListBucketsCommand({}));
    console.log('Available buckets:', response.Buckets?.map(b => b.Name) || []);
  } catch (err) {
    console.error('Error listing buckets:', err.message);
  }
}

main().catch(console.error);