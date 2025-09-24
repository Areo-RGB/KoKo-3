#!/usr/bin/env node
/*
 Upload videos from a local folder (recursively) to Cloudflare R2 via S3 API.

 Reads credentials and settings from .env.local in the project root by default.
 You can override via CLI args or environment variables.

 Usage examples:
   node scripts/upload-r2.cjs --source "J:\\.docs\\Wissen"
   node scripts/upload-r2.cjs --source "J:\\.docs\\Wissen" --prefix knowledge/videos/
   node scripts/upload-r2.cjs --source "J:\\.docs\\Wissen" --all   # upload all files, not only videos
   node scripts/upload-r2.cjs --dry-run  # show what would upload
*/

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) {
      args._.push(a);
      continue;
    }
    const [key, ...rest] = a.replace(/^--/, '').split('=');
    const next = rest.length
      ? rest.join('=')
      : argv[i + 1]?.startsWith('--')
        ? undefined
        : argv[++i];
    switch (key) {
      case 'source':
        args.source = next;
        break;
      case 'prefix':
        args.prefix = next || '';
        break;
      case 'env':
        args.envPath = next;
        break;
      case 'all':
        args.all = true;
        break;
      case 'dry-run':
      case 'dry':
        args.dryRun = true;
        break;
      case 'concurrency':
        args.concurrency = Number(next) || 4;
        break;
      default:
        console.warn(`Unknown option --${key}`);
    }
  }
  return args;
}

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

async function loadEnv(envPath) {
  const abs = envPath || path.resolve(process.cwd(), '.env.local');
  try {
    const content = await fsp.readFile(abs, 'utf8');
    return parseDotEnv(content);
  } catch (err) {
    console.warn(`Warning: could not read env file at ${abs}: ${err.message}`);
    return {};
  }
}

const VIDEO_EXTS = new Set([
  '.mp4',
  '.mov',
  '.avi',
  '.mkv',
  '.wmv',
  '.flv',
  '.webm',
  '.m4v',
  '.3gp',
  '.ts',
  '.mts',
  '.m2ts',
  '.mpeg',
  '.mpg',
  '.mpe',
  '.mp2',
  '.m2v',
]);

const EXT_MIME = {
  '.mp4': 'video/mp4',
  '.m4v': 'video/x-m4v',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.avi': 'video/x-msvideo',
  '.wmv': 'video/x-ms-wmv',
  '.mkv': 'video/x-matroska',
  '.flv': 'video/x-flv',
  '.3gp': 'video/3gpp',
  '.ts': 'video/mp2t',
  '.mts': 'video/mp2t',
  '.m2ts': 'video/mp2t',
  '.mpeg': 'video/mpeg',
  '.mpg': 'video/mpeg',
  '.mpe': 'video/mpeg',
  '.mp2': 'video/mpeg',
  '.m2v': 'video/mpeg',
};

function guessContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return EXT_MIME[ext] || 'application/octet-stream';
}

async function* walk(dir) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      yield* walk(full);
    } else if (ent.isFile()) {
      yield full;
    }
  }
}

function toPosixKey(p) {
  return p.split(path.sep).join('/');
}

async function main() {
  const args = parseArgs(process.argv);
  const env = Object.assign({}, await loadEnv(args.envPath), process.env);

  const sourceRoot = args.source || 'J:\\.docs\\Wissen';
  const includeAll = !!args.all;
  const prefix = (args.prefix || env.R2_PREFIX || '').replace(/^\/+|\/+$/g, '');
  const bucket =
    env.R2_BUCKET ||
    env.AWS_S3_BUCKET ||
    env.S3_BUCKET ||
    env.CLOUDFLARE_R2_BUCKET;
  const accessKeyId = env.R2_ACCESS_KEY_ID || env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY || env.AWS_SECRET_ACCESS_KEY;
  const endpoint =
    env.R2_ENDPOINT ||
    env.CLOUDFLARE_R2_ENDPOINT ||
    env.AWS_S3_ENDPOINT ||
    (env.R2_ACCOUNT_ID
      ? `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
      : undefined);
  const region = env.R2_REGION || env.AWS_REGION || 'auto';
  const concurrency = Number.isFinite(args.concurrency) ? args.concurrency : 4;
  const dryRun = !!args.dryRun;

  if (!bucket)
    throw new Error(
      'Missing bucket: set R2_BUCKET (or AWS_S3_BUCKET) in .env.local',
    );
  if (!accessKeyId || !secretAccessKey)
    throw new Error(
      'Missing R2 credentials: set R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY in .env.local',
    );
  if (!endpoint)
    throw new Error(
      'Missing R2 endpoint: set R2_ENDPOINT or R2_ACCOUNT_ID in .env.local',
    );

  const s3 = new S3Client({
    region,
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });

  const rootStat = await fsp.stat(sourceRoot).catch(() => null);
  if (!rootStat || !rootStat.isDirectory()) {
    throw new Error(`Source directory not found: ${sourceRoot}`);
  }

  const files = [];
  for await (const file of walk(sourceRoot)) {
    const ext = path.extname(file).toLowerCase();
    if (includeAll || VIDEO_EXTS.has(ext)) files.push(file);
  }

  if (files.length === 0) {
    console.log('No files to upload.');
    return;
  }

  console.log(
    `Uploading ${files.length} file(s) from ${sourceRoot} to bucket ${bucket}${prefix ? ` with prefix /${prefix}` : ''} via ${endpoint}${dryRun ? ' [DRY RUN]' : ''}`,
  );

  let success = 0;
  let failed = 0;

  let idx = 0;
  async function worker(workerId) {
    while (true) {
      const i = idx++;
      if (i >= files.length) return;
      const filePath = files[i];
      const rel = path.relative(sourceRoot, filePath);
      const key = toPosixKey(prefix ? `${prefix}/${rel}` : rel);
      try {
        if (dryRun) {
          console.log(`[DRY] -> ${bucket}/${key}`);
          success++;
          continue;
        }
        const Body = fs.createReadStream(filePath);
        const ContentType = guessContentType(filePath);
        await s3.send(
          new PutObjectCommand({ Bucket: bucket, Key: key, Body, ContentType }),
        );
        success++;
        console.log(`[OK] ${i + 1}/${files.length} -> ${bucket}/${key}`);
      } catch (err) {
        failed++;
        console.error(`[ERR] ${bucket}/${key}: ${err?.message || err}`);
      }
    }
  }

  const workers = Array.from({ length: Math.max(1, concurrency) }, (_, n) =>
    worker(n + 1),
  );
  await Promise.all(workers);

  console.log(`Done. Success: ${success}, Failed: ${failed}`);
  if (failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
