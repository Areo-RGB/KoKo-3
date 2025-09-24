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
const FFmpeg_CMD = (inputUrl, outputPath) =>
  `ffmpeg -ss ${FRAME_TIME} -i "${inputUrl}" -vframes 1 -q:v 2 "${outputPath}" -y`;

// Hardcoded video data from lib/video-data.ts (unique main videoUrls and IDs)
const videos = [
  {
    id: '15-footwork-drills',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/15-Fast-Footwork_processed.mp4',
  },
  {
    id: '15-footwork-exercises',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/15_Fast_Footwork_Exercises_-_Increase_Your_Foot_Speed_Coordination_With_These_Fast_Feet_Drills/clips/01_In_Out_Hops.mp4',
  }, // First chapter
  {
    id: '10-ladder-drills',
    videoUrl: 'https://data-h03.fra1.digitaloceanspaces.com/10-Fast-Feet.mp4',
  },
  {
    id: '10-fast-feet',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/10_Minute_Fast_Feet_Workout_-_Exercises_To_Increase_Foot_Speed_and_Coordination/clips/01_Forward_Backward_Fast_Feet.mp4',
  }, // First chapter
  {
    id: '20-football-feet',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/20-fast-feet.mp4',
  },
  {
    id: '10-ball-control',
    videoUrl:
      'https://data-h03.fra1.digitaloceanspaces.com/trainings-video/Ball%20Control/10%20Easy%20Ball%20Control%20Exercises%20-%20Improve%20Your%20Ball%20Control%20With%20These%20Exercises/10%20Easy%20Ball%20Control%20Exercises%20_%20Improve%20Your%20Ball%20Control%20With%20These%20Exercises_web.mp4',
  },
  {
    id: '10-dribbling-exercises',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/Improve_Your_Dribbling_-_10_Easy_Close_Control_Dribbling_Exercises/clips/01_Sole_Outside_Push.mp4',
  }, // First chapter
  {
    id: 'dribbling-1',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/01_Single_Leg_Weave.mp4',
  }, // First chapter
  {
    id: '5-ball-mastery',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/ballkontrolle.mp4',
  },
  {
    id: '5-v-cut-skills',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Ball_Mastery/5_V_Cut_Ball_Mastery_Skills_-_Five_Easy_Ball_Mastery_Skills_To_Master_The_V_Cut/clips/01_Inside_V-Cuts.mp4',
  }, // First chapter
  {
    id: 'l-drag',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Skills_Moves/5_L_Drag_Mastery_Skills_-_Five_Simple_Ball_Mastery_Skills_To_Master_The_L_Drag/clips/01_L-Drag_Basics.mp4',
  }, // First chapter
  {
    id: 'chop',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Skills_Moves/5_Easy_Chop_Skills_To_Beat_Defenders_-_Learn_These_Simple_Dribbling_Moves/clips/01_The_Classic_Chop.mp4',
  }, // First chapter
  {
    id: '5-basic-turns',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Skills_Moves/5_Turns_Every_Player_Should_Master_-_Glide_Past_Defenders_With_These_5_Moves/clips/01_Inside_Foot_Turn.mp4',
  }, // First chapter
  {
    id: '24-yoga-stretches',
    videoUrl:
      "https://data-h03.fra1.cdn.digitaloceanspaces.com/7mlc/stretch/Pro_Footballer's_Full_Deep_Stretch_and_Yoga_Routine_-_30_Minute_Yoga_for_Soccer_Players_faststart.mp4",
  },
  {
    id: '5-passing-drills',
    videoUrl: 'https://data-h03.fra1.cdn.digitaloceanspaces.com/Passing.mp4',
  },
  {
    id: 'prellwand-1',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/First_Touch/5_Individual_First_Touch_Drills_-_Improve_Your_First_Touch_With_These_Exercises/clips/01_Inside_Outside.mp4',
  }, // First chapter
  {
    id: 'wissen',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/Wissen/Ern%C3%A4hrung/Kraftstoff_f%C3%BCr_das_Spiel.mp4',
  }, // First chapter
  {
    id: 'wissen-ernaehrung',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/Wissen/Ern%C3%A4hrung/Kraftstoff_f%C3%BCr_das_Spiel.mp4',
  }, // First
  {
    id: 'wissen-praevention',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/Wissen/Pr%C3%A4vention/Der_Preis_des_Spiels.mp4',
  }, // First
  {
    id: 'wissen-talent',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/Wissen/Talent/Die_Wissenschaft_der_Talentsuche.mp4',
  }, // First
  {
    id: 'training-agility-speed',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/15-Fast-Footwork_processed.mp4',
  }, // First video
  {
    id: 'training-ball-control-dribbling',
    videoUrl:
      'https://data-h03.fra1.digitaloceanspaces.com/trainings-video/Ball%20Control/10%20Easy%20Ball%20Control%20Exercises%20-%20Improve%20Your%20Ball%20Control%20With%20These%20Exercises/10%20Easy%20Ball%20Control%20Exercises%20_%20Improve%20Your%20Ball%20Control%20With%20These%20Exercises_web.mp4',
  }, // First
  {
    id: 'training-ball-mastery',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/ballkontrolle.mp4',
  }, // First
  {
    id: 'training-skills',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Skills_Moves/5_Easy_Chop_Skills_To_Beat_Defenders_-_Learn_These_Simple_Dribbling_Moves/clips/01_The_Classic_Chop.mp4',
  }, // First
  {
    id: 'training-flexibility-recovery',
    videoUrl:
      "https://data-h03.fra1.cdn.digitaloceanspaces.com/7mlc/stretch/Pro_Footballer's_Full_Deep_Stretch_and_Yoga_Routine_-_30_Minute_Yoga_for_Soccer_Players_faststart.mp4",
  }, // First
  {
    id: 'training-passing-first-touch',
    videoUrl: 'https://data-h03.fra1.cdn.digitaloceanspaces.com/Passing.mp4',
  }, // First
];

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function generateThumbnail({ id, videoUrl }) {
  if (!videoUrl) {
    console.log(`Skipping ${id}: No available videoUrl`);
    return;
  }

  const outputPath = path.join(THUMBNAIL_DIR, `${id}.jpg`);
  console.log(`Generating thumbnail for ${id}...`);

  try {
    const { stdout, stderr } = await execAsync(
      FFmpeg_CMD(videoUrl, outputPath),
    );
    if (stderr && !stderr.includes('frame=')) {
      console.warn(`Warning for ${id}: ${stderr}`);
    } else {
      console.log(`✅ Created ${id}.jpg`);
    }
  } catch (err) {
    console.error(`❌ Failed for ${id}: ${err.message}`);
  }
}

async function main() {
  await ensureDir(THUMBNAIL_DIR);
  console.log(`Processing ${videos.length} videos...`);

  await Promise.all(videos.map(generateThumbnail));

  console.log(
    'Thumbnail generation complete! Check public/assets/thumbnails/ for files.',
  );
}

main().catch(console.error);
