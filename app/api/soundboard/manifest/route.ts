import { NextResponse } from 'next/server';

// Ensure this API can be statically exported during `next build`
export const dynamic = 'force-static';
export const revalidate = 3600; // seconds
type ApiSound = { id: string; label: string; src: string; sources: string[] };
type ApiTopic = { id: string; name: string; sounds: ApiSound[] };

const DEFAULT_REGION = process.env.DO_SPACES_REGION || 'fra1';
const DEFAULT_BUCKET = process.env.DO_SPACES_BUCKET || 'data-h03';
const CDN_BASE_URL =
  process.env.DO_SPACES_PUBLIC_BASE_URL ||
  `https://${DEFAULT_BUCKET}.${DEFAULT_REGION}.cdn.digitaloceanspaces.com`;

// Known champion prefixes to include in the manifest
const CHAMPIONS: { id: string; name: string }[] = [
  { id: 'aatrox_quotes', name: 'Aatrox' },
  { id: 'announcer_quotes', name: 'Announcer' },
  { id: 'crusader_quotes', name: 'Crusader' },
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

function shouldFilterOut(quoteFolder: string): boolean {
  const withoutNumber = quoteFolder.replace(/^\d+[_\-\s]*/, '').trim();

  const nonVerbalPatterns = [
    /^(laughs?|chuckles?|giggles?)$/i,
    /^(grunts?|groans?|growls?)$/i,
    /^(roars?|screams?|yells?|shouts?)$/i,
    /^(sighs?|gasps?|coughs?)$/i,
    /^(snorts?|wheezes?)$/i,
    /^(breathing|inhales?|exhales?)$/i,
    /^(attacks?|efforts?|pains?|deaths?)$/i,
    /^(taunts?|jokes?)$/i,
    /^(long|short|move|select|ban|pick)$/i,
    /^[A-Z][a-z]+\s+(laughs?|chuckles?|giggles?|grunts?|groans?|growls?|roars?|screams?|yells?|shouts?|sighs?|gasps?|scoffs?)$/i,
    /^[A-Z][a-z]+\s+(laughs?|chuckles?|giggles?)\s+(mockingly|menacingly|maniacally|slyly|darkly|coldly|softly|quietly|loudly|nervously|wickedly|evilly|heartily)$/i,
    /^[A-Z][a-z]+\s+(grunts?|groans?)\s+(in\s+frustration|in\s+pain|angrily|and\s+chuckles?|loudly|forcefully)$/i,
  ];

  for (const pattern of nonVerbalPatterns) {
    if (pattern.test(withoutNumber)) {
      return true;
    }
  }

  const parts = withoutNumber.split(/\.\s+/);
  if (parts.length > 1) {
    const dialoguePart = parts.slice(1).join('. ').trim();
    const wordCount = dialoguePart
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
    if (wordCount >= 3) {
      return false;
    }
  }

  const totalWords = withoutNumber
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  if (totalWords >= 5) {
    return false;
  }

  const hasOnlyAction =
    /^[A-Z][a-z]+\s+(laughs?|chuckles?|grunts?|groans?|growls?|roars?|screams?|yells?|shouts?|sighs?|gasps?|scoffs?)(\s+\w+)?$/i.test(
      withoutNumber,
    );
  if (hasOnlyAction && totalWords <= 3) {
    return true;
  }

  return false;
}

async function listAllObjects(bucket: string, region: string, prefix: string) {
  const originBaseUrl = toOriginBaseUrl(bucket, region);
  const results: { Key: string }[] = [];
  let continuationToken: string | undefined;

  do {
    const params = new URLSearchParams({
      'list-type': '2',
      prefix,
      'max-keys': '1000',
    });
    if (continuationToken) params.set('continuation-token', continuationToken);

    const res = await fetch(`${originBaseUrl}/?${params.toString()}`);
    if (!res.ok) throw new Error(`spaces_list_failed:${res.status}`);
    const xml = await res.text();

    for (const match of xml.matchAll(/<Key>(.*?)<\/Key>/g)) {
      const key = decodeXml(match[1]);
      if (key) results.push({ Key: key });
    }

    const nextMatch = xml.match(
      /<NextContinuationToken>(.*?)<\/NextContinuationToken>/,
    );
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

      // Group by immediate subfolder (quote folder), then pick first mp3/ogg/m4a
      const byQuote = new Map<string, { files: { key: string }[] }>();
      for (const { Key } of objects) {
        if (
          !Key.endsWith('.mp3') &&
          !Key.endsWith('.ogg') &&
          !Key.endsWith('.m4a')
        )
          continue;
        const rest = Key.slice(fullPrefix.length);
        const parts = rest.split('/');

        // For crusader_quotes, handle nested structure: UnitType/QuoteName/filename.ext
        let quoteFolder: string;
        if (champ.id === 'crusader_quotes' && parts.length >= 3) {
          // Use UnitType/QuoteName as the quote identifier
          quoteFolder = `${parts[0]}/${parts[1]}`;
        } else {
          // Default behavior for other categories
          quoteFolder = parts.length > 1 ? parts[0] : '';
        }

        if (!quoteFolder) continue;
        // Filter out non-verbal sounds
        if (shouldFilterOut(quoteFolder)) continue;
        const entry = byQuote.get(quoteFolder) || { files: [] };
        entry.files.push({ key: Key });
        byQuote.set(quoteFolder, entry);
      }

      // Build sounds list
      const sounds: ApiSound[] = Array.from(byQuote.entries())
        .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
        .map(([folder, entry]) => {
          // Choose first mp3/ogg/m4a in lexical order
          entry.files.sort((a, b) =>
            a.key.localeCompare(b.key, undefined, { numeric: true }),
          );
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
    return NextResponse.json(
      { error: 'failed_to_build_manifest' },
      { status: 500 },
    );
  }
}
