#!/usr/bin/env node
/*
 Upload images from public directory to Cloudflare R2 via S3 API.

 Usage examples:
   node scripts/upload-image-r2.cjs --file "public/assets/images/spieler-avatars/eray.png"
   node scripts/upload-image-r2.cjs --file "public/assets/images/spieler-avatars/eray.png" --key "avatars/eray.png"
   node scripts/upload-image-r2.cjs --dir "public/assets/images/spieler-avatars" --prefix "avatars/"
   node scripts/upload-image-r2.cjs --dry-run --file "public/assets/images/spieler-avatars/eray.png"
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
      case 'file':
        args.file = next;
        break;
      case 'dir':
        args.dir = next;
        break;
      case 'key':
        args.key = next;
        break;
      case 'prefix':
        args.prefix = next || '';
        break;
      case 'env':
        args.envPath = next;
        break;
      case 'dry-run':
      case 'dry':
        args.dryRun = true;
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

const IMAGE_EXTS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.bmp',
  '.svg',
  '.ico',
  '.tiff',
  '.tif',
]);

const EXT_MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.tiff': 'image/tiff',
  '.tif': 'image/tiff',
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

async function uploadFile(s3, bucket, filePath, key, dryRun = false) {
  try {
    if (dryRun) {
      console.log(`[DRY] ${filePath} -> ${bucket}/${key}`);
      return { success: true };
    }

    const Body = fs.createReadStream(filePath);
    const ContentType = guessContentType(filePath);

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body,
        ContentType,
        // Add metadata for images
        Metadata: {
          'original-name': path.basename(filePath),
          'upload-date': new Date().toISOString(),
        },
      }),
    );

    console.log(`[OK] ${filePath} -> ${bucket}/${key}`);
    return { success: true };
  } catch (err) {
    console.error(`[ERR] ${bucket}/${key}: ${err?.message || err}`);
    return { success: false, error: err };
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const env = Object.assign({}, await loadEnv(args.envPath), process.env);

  const bucket = env.R2_BUCKET || 'video';
  const accessKeyId = env.R2_ACCESS_KEY_ID;
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
  const endpoint =
    env.R2_ENDPOINT ||
    (env.R2_ACCOUNT_ID
      ? `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
      : undefined);
  const region = env.R2_REGION || 'auto';
  const dryRun = !!args.dryRun;

  if (!bucket) throw new Error('Missing bucket: set R2_BUCKET in .env.local');
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

  console.log(
    `Uploading to R2 bucket: ${bucket} via ${endpoint}${dryRun ? ' [DRY RUN]' : ''}`,
  );

  let success = 0;
  let failed = 0;

  // Single file upload
  if (args.file) {
    const filePath = path.resolve(args.file);
    const fileStat = await fsp.stat(filePath).catch(() => null);

    if (!fileStat || !fileStat.isFile()) {
      throw new Error(`File not found: ${filePath}`);
    }

    const ext = path.extname(filePath).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) {
      throw new Error(`File is not a supported image format: ${filePath}`);
    }

    const key = args.key || path.basename(filePath);
    const result = await uploadFile(s3, bucket, filePath, key, dryRun);

    if (result.success) success++;
    else failed++;
  }

  // Directory upload
  else if (args.dir) {
    const sourceDir = path.resolve(args.dir);
    const dirStat = await fsp.stat(sourceDir).catch(() => null);

    if (!dirStat || !dirStat.isDirectory()) {
      throw new Error(`Directory not found: ${sourceDir}`);
    }

    const prefix = (args.prefix || '').replace(/^\/+|\/+$/g, '');
    const files = [];

    for await (const file of walk(sourceDir)) {
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_EXTS.has(ext)) {
        files.push(file);
      }
    }

    if (files.length === 0) {
      console.log('No image files found in directory.');
      return;
    }

    console.log(`Found ${files.length} image file(s) to upload`);

    for (const filePath of files) {
      const rel = path.relative(sourceDir, filePath);
      const key = toPosixKey(prefix ? `${prefix}/${rel}` : rel);
      const result = await uploadFile(s3, bucket, filePath, key, dryRun);

      if (result.success) success++;
      else failed++;
    }
  } else {
    throw new Error('Please specify either --file or --dir option');
  }

  console.log(`Done. Success: ${success}, Failed: ${failed}`);
  if (failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
