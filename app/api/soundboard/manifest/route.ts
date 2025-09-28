import { NextResponse } from 'next/server';

// Ensure this API can be statically exported during `next build`
export const dynamic = 'force-static';
export const revalidate = 3600; // seconds
type ApiSound = { id: string; label: string; src: string; sources: string[] };
type ApiTopic = { id: string; name: string; sounds: ApiSound[] };

const DEFAULT_REGION = process.env.DO_SPACES_REGION || 'fra1';
const DEFAULT_BUCKET = process.env.DO_SPACES_BUCKET || 'data-h03';
const CDN_BASE_URL =
  process.env.DO_SPACES_PUBLIC_BASE_URL || `https://${DEFAULT_BUCKET}.${DEFAULT_REGION}.cdn.digitaloceanspaces.com`;

// Known champion prefixes to include in the manifest
const CHAMPIONS: { id: string; name: string }[] = [
  { id: 'aatrox_quotes', name: 'Aatrox' },
  { id: 'pyke_quotes', name: 'Pyke' },
  { id: 'sion_quotes', name: 'Sion' },
  { id: 'swain_quotes', name: 'Swain' },
  { id: 'sylas_quotes', name: 'Sylas' },
  { id: 'urgot_quotes', name: 'Urgot' },
  { id: 'xerath_quotes', name: 'Xerath' },
];

function toOriginBaseUrl(bucket: string, region: string) {
  return `https://${bucket}.${region}.digitaloceanspaces.com`;
}

function decodeXml(text: string) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

async function listAllObjects(bucket: string, region: string, prefix: string) {
  const originBaseUrl = toOriginBaseUrl(bucket, region);
  const results: { Key: string }[] = [];
  let continuationToken: string | undefined;

  do {
    const params = new URLSearchParams({ 'list-type': '2', prefix, 'max-keys': '1000' });
    if (continuationToken) params.set('continuation-token', continuationToken);

    const res = await fetch(`${originBaseUrl}/?${params.toString()}`);
    if (!res.ok) throw new Error(`spaces_list_failed:${res.status}`);
    const xml = await res.text();

    for (const match of xml.matchAll(/<Key>(.*?)<\/Key>/g)) {
      const key = decodeXml(match[1]);
      if (key) results.push({ Key: key });
    }

    const nextMatch = xml.match(/<NextContinuationToken>(.*?)<\/NextContinuationToken>/);
    continuationToken = nextMatch ? decodeXml(nextMatch[1]) : undefined;
  } while (continuationToken);

  return results;
}

export async function GET() {
  try {
    const region = DEFAULT_REGION;
    const bucket = DEFAULT_BUCKET;
    const baseUrl = CDN_BASE_URL || toOriginBaseUrl(bucket, region);

    const topics: ApiTopic[] = [];
    for (const champ of CHAMPIONS) {
      const fullPrefix = `soundboard/${champ.id}/`;
      const objects = await listAllObjects(bucket, region, fullPrefix);

      // Group by immediate subfolder (quote folder), then pick first mp3
      const byQuote = new Map<string, { files: { key: string }[] }>();
      for (const { Key } of objects) {
        if (!Key.endsWith('.mp3')) continue;
        const rest = Key.slice(fullPrefix.length);
        const parts = rest.split('/');
        const quoteFolder = parts.length > 1 ? parts[0] : '';
        if (!quoteFolder) continue;
        const entry = byQuote.get(quoteFolder) || { files: [] };
        entry.files.push({ key: Key });
        byQuote.set(quoteFolder, entry);
      }

      // Build sounds list
      const sounds: ApiSound[] = Array.from(byQuote.entries())
        .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
        .map(([folder, entry]) => {
          // Choose first mp3 in lexical order
          entry.files.sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));
          const pick = entry.files[0];
          const id = folder;
          const label = folder.replace(/^\d+[_\-\s]*/, '').trim();
          const sources = entry.files.map((file) => `${baseUrl}/${file.key}`);
          const src = `${baseUrl}/${pick.key}`;
          return { id, label, src, sources };
        });

      topics.push({ id: champ.id, name: champ.name, sounds });
    }

    return NextResponse.json({ baseUrl, topics });
  } catch (err) {
    console.error('Manifest error', err);
    return NextResponse.json({ error: 'failed_to_build_manifest' }, { status: 500 });
  }
}
