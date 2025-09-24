import { videoDatabase } from '../lib/video-data';

const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs').promises;

const execAsync = promisify(exec);

const THUMBNAIL_DIR = path.join(
  __dirname,
  '..',
  'public',
  'assets',
  'thumbnails',
);
const FRAME_TIME = '00:00:10'; // Extract frame at 10 seconds
const FFmpeg_CMD = (inputUrl: string, outputPath: string) =>
  `ffmpeg -ss ${FRAME_TIME} -i "${inputUrl}" -vframes 1 -q:v 2 "${outputPath}" -y`;

async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err: any) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function getVideoUrl(video: any): string | null {
  if (video.videoUrl) return video.videoUrl;
  if (
    video.chapters &&
    video.chapters.length > 0 &&
    video.chapters[0].videoUrl
  ) {
    return video.chapters[0].videoUrl;
  }
  return null;
}

async function generateThumbnail(video: any) {
  const videoUrl = await getVideoUrl(video);
  if (!videoUrl) {
    console.log(`Skipping ${video.id}: No available videoUrl`);
    return;
  }

  const outputPath = path.join(THUMBNAIL_DIR, `${video.id}.jpg`);
  console.log(`Generating thumbnail for ${video.id}...`);

  try {
    const { stdout, stderr } = await execAsync(
      FFmpeg_CMD(videoUrl, outputPath),
    );
    if (stderr && !stderr.includes('frame=')) {
      console.warn(`Warning for ${video.id}: ${stderr}`);
    } else {
      console.log(`✅ Created ${video.id}.jpg`);
    }
  } catch (err: any) {
    console.error(`❌ Failed for ${video.id}: ${err.message}`);
  }
}

async function main() {
  await ensureDir(THUMBNAIL_DIR);
  console.log(`Processing ${videoDatabase.length} videos...`);

  await Promise.all(
    videoDatabase.map((video: any) => generateThumbnail(video)),
  );

  console.log(
    'Thumbnail generation complete! Check public/assets/thumbnails/ for files.',
  );
}

main().catch(console.error);
