// lib/video-data.ts
// Extended video database combining existing structure with data.json content

export interface VideoChapter {
  id: string;
  title: string;
  description?: string;
  startTime?: number; // in seconds for chapter-based videos
  endTime?: number; // in seconds for chapter-based videos
  duration?: number; // chapter duration in seconds
  rank?: number;
  score?: string;
  videoUrl?: string; // individual video URL for playlist items
}

export interface VideoData {
  id: string;
  title: string;
  description?: string;
  category: string; // e.g., "Agility & Speed", "Ball Control & Dribbling"
  type: 'chapters' | 'playlist'; // chapters = single video with timestamps, playlist = multiple videos
  videoUrl?: string; // main video URL for chapter-based content
  thumbnail?: string;
  duration?: number; // total video duration in seconds
  playlistTitle: string;
  chapters: VideoChapter[];
}

export interface PlaylistItem {
  id: string;
  title: string;
  artist?: string; // category or video series name
  duration: string; // formatted duration (e.g., "2:33")
  videoId: string;
  chapterId?: string; // if this item represents a chapter/timestamp
  isNew?: boolean;
  rank?: number;
  score?: string;
  startTime?: number; // for chapter-based navigation
  endTime?: number;
  videoUrl?: string; // direct video URL
}

// Enhanced video database from data.json
export const videoDatabase: VideoData[] = [
  // Agility & Speed
  {
    id: '15-footwork-drills',
    title: '15 Footwork Drills',
    description: 'Fast footwork drills for agility and speed improvement',
    category: 'Agility & Speed',
    type: 'chapters',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/15-Fast-Footwork_processed.mp4',
    playlistTitle: '15 Footwork Drills',
    duration: 653,
    chapters: [
      {
        id: 'two-foot-forwards',
        title: 'Two Foot Forwards',
        startTime: 64,
        endTime: 89,
      },
      {
        id: 'two-foot-sideways',
        title: 'Two Foot Sideways',
        startTime: 94,
        endTime: 118,
      },
      {
        id: 'icky-shuffle',
        title: 'Icky Shuffle',
        startTime: 124,
        endTime: 153,
      },
      {
        id: 'backwards-icky-shuffle',
        title: 'Backwards Icky Shuffle',
        startTime: 159,
        endTime: 191,
      },
      { id: 'in-out', title: 'In & Out', startTime: 197, endTime: 228 },
      { id: 'sl-in-out', title: 'SL In & Out', startTime: 234, endTime: 266 },
      {
        id: 'cross-feet-behind',
        title: 'Cross Feet Behind',
        startTime: 272,
        endTime: 297,
      },
      {
        id: 'backwards-cross-feet',
        title: 'Backwards Cross Feet Behind',
        startTime: 302,
        endTime: 331,
      },
      {
        id: 'diagonal-run',
        title: 'Diagonal Run',
        startTime: 337,
        endTime: 375,
      },
      { id: 'carioca', title: 'Carioca', startTime: 381, endTime: 436 },
      {
        id: 'two-foot-hops',
        title: 'Two Foot Hops',
        startTime: 442,
        endTime: 479,
      },
      {
        id: 'two-foot-sideways-hops',
        title: 'Two Foot Sideways Hops',
        startTime: 485,
        endTime: 521,
      },
      {
        id: 'single-leg-hops',
        title: 'Single Leg Hops',
        startTime: 527,
        endTime: 561,
      },
      {
        id: 'single-leg-sideways-hops',
        title: 'Single Leg Sideways Hops',
        startTime: 567,
        endTime: 613,
      },
      {
        id: 'single-leg-switch-hops',
        title: 'Single Leg Switch Hops',
        startTime: 619,
        endTime: 653,
      },
    ],
  },
  {
    id: '15-footwork-exercises',
    title: '15 Footwork Exercises',
    description:
      'Increase Your Foot Speed Coordination With These Fast Feet Drills',
    category: 'Agility & Speed',
    type: 'playlist',
    playlistTitle: '15 Footwork Exercises',
    chapters: [
      {
        id: 'in-out-hops',
        title: 'In Out Hops',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/15_Fast_Footwork_Exercises_-_Increase_Your_Foot_Speed_Coordination_With_These_Fast_Feet_Drills/clips/01_In_Out_Hops.mp4',
      },
      {
        id: 'hopscotch',
        title: 'Hopscotch',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/15_Fast_Footwork_Exercises_-_Increase_Your_Foot_Speed_Coordination_With_These_Fast_Feet_Drills/clips/02_Hopscotch.mp4',
      },
      {
        id: 'karaoke',
        title: 'Karaoke',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/15_Fast_Footwork_Exercises_-_Increase_Your_Foot_Speed_Coordination_With_These_Fast_Feet_Drills/clips/03_Karaoke.mp4',
      },
      {
        id: 'staggered-in-out',
        title: 'Staggered In Out',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/15_Fast_Footwork_Exercises_-_Increase_Your_Foot_Speed_Coordination_With_These_Fast_Feet_Drills/clips/04_Staggered_In_Out.mp4',
      },
      {
        id: 'one-two-hop',
        title: 'One Two Hop',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/15_Fast_Footwork_Exercises_-_Increase_Your_Foot_Speed_Coordination_With_These_Fast_Feet_Drills/clips/05_One_Two_Hop.mp4',
      },
      {
        id: 'single-leg-hop',
        title: 'Single Leg Hop',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/15_Fast_Footwork_Exercises_-_Increase_Your_Foot_Speed_Coordination_With_These_Fast_Feet_Drills/clips/06_Single_Leg_Hop.mp4',
      },
      {
        id: 'icky-shuffle-tap',
        title: 'Icky Shuffle Tap',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/15_Fast_Footwork_Exercises_-_Increase_Your_Foot_Speed_Coordination_With_These_Fast_Feet_Drills/clips/07_Icky_Shuffle_Tap.mp4',
      },
      {
        id: 'two-forwards-back',
        title: 'Two Forwards Back',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/15_Fast_Footwork_Exercises_-_Increase_Your_Foot_Speed_Coordination_With_These_Fast_Feet_Drills/clips/08_Two_Forwards_Back.mp4',
      },
      {
        id: 'back-through',
        title: 'Back Through',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/15_Fast_Footwork_Exercises_-_Increase_Your_Foot_Speed_Coordination_With_These_Fast_Feet_Drills/clips/09_Back_Through.mp4',
      },
      {
        id: 'crossover-tap',
        title: 'Crossover Tap',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/15_Fast_Footwork_Exercises_-_Increase_Your_Foot_Speed_Coordination_With_These_Fast_Feet_Drills/clips/10_Crossover_Tap.mp4',
      },
      {
        id: 'reverse-crossover-tap',
        title: 'Reverse Crossover Tap',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/15_Fast_Footwork_Exercises_-_Increase_Your_Foot_Speed_Coordination_With_These_Fast_Feet_Drills/clips/11_Reverse_Crossover_Tap.mp4',
      },
      {
        id: 'reverse-crossover-shuffle',
        title: 'Reverse Crossover Shuffle',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/15_Fast_Footwork_Exercises_-_Increase_Your_Foot_Speed_Coordination_With_These_Fast_Feet_Drills/clips/12_Reverse_Crossover_Shuffle.mp4',
      },
      {
        id: 'reverse-crossover-one-tap',
        title: 'Reverse Crossover One Tap',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/15_Fast_Footwork_Exercises_-_Increase_Your_Foot_Speed_Coordination_With_These_Fast_Feet_Drills/clips/13_Reverse_Crossover_One_Tap.mp4',
      },
      {
        id: 'crossover-lateral-shuffle',
        title: 'Crossover Lateral Shuffle',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/15_Fast_Footwork_Exercises_-_Increase_Your_Foot_Speed_Coordination_With_These_Fast_Feet_Drills/clips/14_Crossover_Lateral_Shuffle.mp4',
      },
      {
        id: 'forwards-out-back',
        title: 'Forwards Out Back',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/15_Fast_Footwork_Exercises_-_Increase_Your_Foot_Speed_Coordination_With_These_Fast_Feet_Drills/clips/15_Forwards_Out_Back.mp4',
      },
    ],
  },
  {
    id: '10-ladder-drills',
    title: '10 Ladder Drills',
    description: 'Fast feet ladder exercises for coordination',
    category: 'Agility & Speed',
    type: 'chapters',
    videoUrl: 'https://data-h03.fra1.digitaloceanspaces.com/10-Fast-Feet.mp4',
    playlistTitle: '10 Ladder Drills',
    duration: 535,
    chapters: [
      { id: 'hopscotch', title: 'Hopscotch', startTime: 87, endTime: 125 },
      {
        id: 'diagonal-forwards-backwards',
        title: 'Diagonal Forwards Backwards',
        startTime: 130,
        endTime: 168,
      },
      {
        id: 'inside-outside-forwards',
        title: 'Inside Outside Forwards',
        startTime: 173,
        endTime: 217,
      },
      {
        id: 'inside-outside-across',
        title: 'Inside Outside Across',
        startTime: 223,
        endTime: 257,
      },
      {
        id: 'crossover-shuffle',
        title: 'Crossover Shuffle',
        startTime: 262,
        endTime: 296,
      },
      {
        id: 'behind-foot-inside-outside',
        title: 'Behind Foot Inside Outside',
        startTime: 301,
        endTime: 335,
      },
      {
        id: 'behind-foot-inside-outside-across',
        title: 'Behind Foot Inside Outside Across',
        startTime: 340,
        endTime: 375,
      },
      {
        id: 'advanced-hopscotch',
        title: 'Advanced Hopscotch',
        startTime: 380,
        endTime: 410,
      },
      {
        id: 'inside-outside-crossovers',
        title: 'Inside Outside Crossovers',
        startTime: 442,
        endTime: 482,
      },
      {
        id: 'footwork-combo',
        title: 'Footwork Combo',
        startTime: 487,
        endTime: 535,
      },
    ],
  },
  // Agility & Speed: 10 Fast Feet (playlist)
  {
    id: '10-fast-feet',
    title: '10 Fast Feet',
    description: 'Ten fast feet drills to increase foot speed and coordination',
    category: 'Agility & Speed',
    type: 'playlist',
    playlistTitle: '10 Fast Feet',
    chapters: [
      {
        id: 'forward-backward-fast-feet',
        title: 'Forward Backward Fast Feet',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/10_Minute_Fast_Feet_Workout_-_Exercises_To_Increase_Foot_Speed_and_Coordination/clips/01_Forward_Backward_Fast_Feet.mp4',
      },
      {
        id: 'lateral-fast-feet',
        title: 'Lateral Fast Feet',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/10_Minute_Fast_Feet_Workout_-_Exercises_To_Increase_Foot_Speed_and_Coordination/clips/02_Lateral_Fast_Feet.mp4',
      },
      {
        id: 'in-out-fast-feet',
        title: 'In Out Fast Feet',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/10_Minute_Fast_Feet_Workout_-_Exercises_To_Increase_Foot_Speed_and_Coordination/clips/03_In_Out_Fast_Feet.mp4',
      },
      {
        id: 'front-crossovers',
        title: 'Front Crossovers',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/10_Minute_Fast_Feet_Workout_-_Exercises_To_Increase_Foot_Speed_and_Coordination/clips/04_Front_Crossovers.mp4',
      },
      {
        id: 'reverse-crossovers',
        title: 'Reverse Crossovers',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/10_Minute_Fast_Feet_Workout_-_Exercises_To_Increase_Foot_Speed_and_Coordination/clips/05_Reverse_Crossovers.mp4',
      },
      {
        id: 'circle-shuffles',
        title: 'Circle Shuffles',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/10_Minute_Fast_Feet_Workout_-_Exercises_To_Increase_Foot_Speed_and_Coordination/clips/06_Circle_Shuffles.mp4',
      },
      {
        id: 'double-circle-shuffles',
        title: 'Double Circle Shuffles',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/10_Minute_Fast_Feet_Workout_-_Exercises_To_Increase_Foot_Speed_and_Coordination/clips/07_Double_Circle_Shuffles.mp4',
      },
      {
        id: 'triangle-shuffle',
        title: 'Triangle Shuffle',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/10_Minute_Fast_Feet_Workout_-_Exercises_To_Increase_Foot_Speed_and_Coordination/clips/08_Triangle_Shuffle.mp4',
      },
      {
        id: 'shuffle-weave',
        title: 'Shuffle Weave',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/10_Minute_Fast_Feet_Workout_-_Exercises_To_Increase_Foot_Speed_and_Coordination/clips/09_Shuffle_Weave.mp4',
      },
      {
        id: 'full-triangle',
        title: 'Full Triangle',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Agility_Speed/10_Minute_Fast_Feet_Workout_-_Exercises_To_Increase_Foot_Speed_and_Coordination/clips/10_Full_Triangle.mp4',
      },
    ],
  },
  // Agility & Speed: 20 Football Feet (chapters)
  {
    id: '20-football-feet',
    title: '20 Football Feet',
    description: 'Twenty fast feet variations for footballers',
    category: 'Agility & Speed',
    type: 'chapters',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/20-fast-feet.mp4',
    playlistTitle: '20 Football Feet',
    duration: 580,
    chapters: [
      {
        id: 'stationary-fast-feet',
        title: 'Stationary Fast Feet',
        startTime: 10,
        endTime: 24,
      },
      {
        id: 'forwards-backwards',
        title: 'Forwards - Backwards',
        startTime: 28,
        endTime: 44,
      },
      { id: 'side-to-side', title: 'Side to Side', startTime: 49, endTime: 64 },
      {
        id: 'side-to-side-with-step',
        title: 'Side to Side with Step',
        startTime: 68,
        endTime: 89,
      },
      {
        id: 'forwards-backwards-hops',
        title: 'Forwards - Backwards Hops',
        startTime: 93,
        endTime: 108,
      },
      {
        id: 'lateral-hops',
        title: 'Lateral Hops',
        startTime: 113,
        endTime: 125,
      },
      { id: 'crossover', title: 'Crossover', startTime: 129, endTime: 151 },
      {
        id: 'crossover-with-step',
        title: 'Crossover with Step',
        startTime: 155,
        endTime: 183,
      },
      {
        id: 'reverse-crossover',
        title: 'Reverse Crossover',
        startTime: 188,
        endTime: 212,
      },
      {
        id: 'reverse-crossover-with-step',
        title: 'Reverse Crossover with Step',
        startTime: 217,
        endTime: 245,
      },
      { id: 'in-out', title: 'In - Out', startTime: 249, endTime: 273 },
      {
        id: 'forwards-backwards-lateral-in-out',
        title: 'Forwards - Backwards - Lateral In - Out',
        startTime: 277,
        endTime: 311,
      },
      {
        id: 'single-leg-forwards-lateral',
        title: 'Single Leg Forwards - Lateral',
        startTime: 315,
        endTime: 342,
      },
      {
        id: 'around-the-clock',
        title: 'Around the Clock',
        startTime: 346,
        endTime: 378,
      },
      { id: 'hop-scotch', title: 'Hop Scotch', startTime: 388, endTime: 415 },
      {
        id: 'over-and-around',
        title: 'Over and Around',
        startTime: 419,
        endTime: 451,
      },
      {
        id: 'shuffle-to-lateral-bound',
        title: 'Shuffle to Lateral Bound',
        startTime: 455,
        endTime: 478,
      },
      {
        id: 'double-forwards-backwards',
        title: 'Double Forwards - Backwards',
        startTime: 492,
        endTime: 516,
      },
      {
        id: 'diagonal-forwards-backwards',
        title: 'Diagonal Forwards - Backwards',
        startTime: 520,
        endTime: 545,
      },
      {
        id: 'diagonal-lateral-shuffle',
        title: 'Diagonal Lateral Shuffle',
        startTime: 549,
        endTime: 580,
      },
    ],
  },
  // Ball Control & Dribbling
  {
    id: '10-ball-control',
    title: '10 Ball Control',
    description: 'Simple ball control exercises to improve touch',
    category: 'Ball Control & Dribbling',
    type: 'playlist',
    playlistTitle: '10 Ball Control',
    chapters: [
      {
        id: '10-easy-ball-control-exercises',
        title: '10 Easy Ball Control Exercises',
        videoUrl:
          'https://data-h03.fra1.digitaloceanspaces.com/trainings-video/Ball%20Control/10%20Easy%20Ball%20Control%20Exercises%20-%20Improve%20Your%20Ball%20Control%20With%20These%20Exercises/10%20Easy%20Ball%20Control%20Exercises%20_%20Improve%20Your%20Ball%20Control%20With%20These%20Exercises_web.mp4',
      },
    ],
  },
  {
    id: '10-dribbling-exercises',
    title: '10 Dribbling Exercises',
    description: 'Close control dribbling exercises',
    category: 'Ball Control & Dribbling',
    type: 'playlist',
    playlistTitle: '10 Dribbling Exercises',
    chapters: [
      {
        id: 'sole-outside-push',
        title: 'Sole Outside Push',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/Improve_Your_Dribbling_-_10_Easy_Close_Control_Dribbling_Exercises/clips/01_Sole_Outside_Push.mp4',
      },
      {
        id: 'la-croqueta',
        title: 'La Croqueta',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/Improve_Your_Dribbling_-_10_Easy_Close_Control_Dribbling_Exercises/clips/02_La_Croqueta.mp4',
      },
      {
        id: 'sole-inside-push',
        title: 'Sole Inside Push',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/Improve_Your_Dribbling_-_10_Easy_Close_Control_Dribbling_Exercises/clips/03_Sole_Inside_Push.mp4',
      },
      {
        id: 'reverse-elastico',
        title: 'Reverse Elastico',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/Improve_Your_Dribbling_-_10_Easy_Close_Control_Dribbling_Exercises/clips/04_Reverse_Elastico.mp4',
      },
      {
        id: 'sole-roll-crossover',
        title: 'Sole Roll Crossover',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/Improve_Your_Dribbling_-_10_Easy_Close_Control_Dribbling_Exercises/clips/05_Sole_Roll_Crossover.mp4',
      },
      {
        id: 'reverse-elastico-stop',
        title: 'Reverse Elastico Stop',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/Improve_Your_Dribbling_-_10_Easy_Close_Control_Dribbling_Exercises/clips/06_Reverse_Elastico_Stop.mp4',
      },
      {
        id: 'la-croqueta-push',
        title: 'La Croqueta Push',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/Improve_Your_Dribbling_-_10_Easy_Close_Control_Dribbling_Exercises/clips/07_La_Croqueta_Push.mp4',
      },
      {
        id: 'stepover',
        title: 'Stepover',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/Improve_Your_Dribbling_-_10_Easy_Close_Control_Dribbling_Exercises/clips/08_Stepover.mp4',
      },
      {
        id: 'sole-roll-push',
        title: 'Sole Roll Push',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/Improve_Your_Dribbling_-_10_Easy_Close_Control_Dribbling_Exercises/clips/09_Sole_Roll_Push.mp4',
      },
      {
        id: 'v-cuts',
        title: 'V-Cuts',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/Improve_Your_Dribbling_-_10_Easy_Close_Control_Dribbling_Exercises/clips/10_V-Cuts.mp4',
      },
    ],
  },
  {
    id: 'dribbling-1',
    title: 'Dribbling-1',
    description: 'Close control dribbling cone drills',
    category: 'Ball Control & Dribbling',
    type: 'playlist',
    playlistTitle: 'Dribbling-1',
    chapters: [
      {
        id: 'single-leg-weave',
        title: 'Single Leg Weave',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/01_Single_Leg_Weave.mp4',
      },
      {
        id: 'single-leg-weave-left',
        title: 'Single Leg Weave Left',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/02_Single_Leg_Weave_Left.mp4',
      },
      {
        id: 'outside-foot-only',
        title: 'Outside Foot Only',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/03_Outside_Foot_Only.mp4',
      },
      {
        id: 'two-touch-right',
        title: 'Two Touch Right',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/04_Two_Touch_Right.mp4',
      },
      {
        id: 'two-touch-left',
        title: 'Two Touch Left',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/05_Two_Touch_Left.mp4',
      },
      {
        id: 'la-croqueta',
        title: 'La Croqueta',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/06_La_Croqueta.mp4',
      },
      {
        id: 'inside-inside',
        title: 'Inside Inside',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/07_Inside_Inside.mp4',
      },
      {
        id: 'croqueta-outside-left',
        title: 'Croqueta Outside Left',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/08_Croqueta_Outside_Left.mp4',
      },
      {
        id: 'croqueta-outside-right',
        title: 'Croqueta Outside Right',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/09_Croqueta_Outside_Right.mp4',
      },
      {
        id: 'inside-outside',
        title: 'Inside Outside',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/10_Inside_Outside.mp4',
      },
      {
        id: 'sole-roll-stop',
        title: 'Sole Roll Stop',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/11_Sole_Roll_Stop.mp4',
      },
      {
        id: 'sole-rolls',
        title: 'Sole Rolls',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/12_Sole_Rolls.mp4',
      },
      {
        id: 'toe-taps-forward',
        title: 'Toe Taps Forward',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/13_Toe_Taps_Forward.mp4',
      },
      {
        id: 'toe-taps-backwards',
        title: 'Toe Taps Backwards',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/14_Toe_Taps_Backwards.mp4',
      },
      {
        id: 'roll-stepover',
        title: 'Roll Stepover',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/15_Roll_Stepover.mp4',
      },
      {
        id: 'l-drag-push',
        title: 'L-Drag Push',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/16_L_Drag_Push.mp4',
      },
      {
        id: 'backwards-l-drag',
        title: 'Backwards L-Drag',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/17_Backwards_L_Drag.mp4',
      },
      {
        id: 'inside-foot-v-cut',
        title: 'Inside Foot V-Cut',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/18_Inside_Foot_V-Cut.mp4',
      },
      {
        id: 'outside-foot-v-cut',
        title: 'Outside Foot V-Cut',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/19_Outside_Foot_V-Cut.mp4',
      },
      {
        id: 'alternating-v-cuts',
        title: 'Alternating V-Cuts',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/20_Alternating_V-Cuts.mp4',
      },
      {
        id: 'stepover-la-croqueta',
        title: 'Stepover La Croqueta',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/21_Stepover_La_Croqueta.mp4',
      },
      {
        id: 'inside-pull-push-left',
        title: 'Inside Pull Push Left',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/22_Inside_Pull_Push_Left.mp4',
      },
      {
        id: 'inside-pull-push-right',
        title: 'Inside Pull Push Right',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/23_Inside_Pull_Push_Right.mp4',
      },
      {
        id: 'outside-pull-push-right',
        title: 'Outside Pull Push Right',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/24_Outside_Pull_Push_Right.mp4',
      },
      {
        id: 'outside-pull-push-left',
        title: 'Outside Pull Push Left',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/25_Outside_Pull_Push_Left.mp4',
      },
      {
        id: 'single-leg-toe-taps',
        title: 'Single Leg Toe Taps',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/26_Single_Leg_Toe_Taps.mp4',
      },
      {
        id: 'single-leg-toe-taps-left',
        title: 'Single Leg Toe Taps Left',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/27_Single_Leg_Toe_Taps_Left.mp4',
      },
      {
        id: 'lateral-sole-right',
        title: 'Lateral Sole Right',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/28_Lateral_Sole_Right.mp4',
      },
      {
        id: 'lateral-sole-left',
        title: 'Lateral Sole Left',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/29_Lateral_Sole_Left.mp4',
      },
      {
        id: 'l-drag-push-right',
        title: 'L-Drag Push Right',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/30_L_Drag_Push_Right.mp4',
      },
      {
        id: 'l-drag-push-left',
        title: 'L-Drag Push Left',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/31_L_Drag_Push_Left.mp4',
      },
      {
        id: 'outside-foot-stepover',
        title: 'Outside Foot Stepover',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Dribbling/32_Close_Control_Dribbling_Cone_Drills_-_Improve_Your_Close_Control_Dribbling/clips/32_Outside_Foot_Stepover.mp4',
      },
    ],
  },
  // Ball Mastery
  {
    id: '5-ball-mastery',
    title: '5 Ball Mastery',
    description: 'Five ball mastery combinations',
    category: 'Ball Mastery',
    type: 'chapters',
    videoUrl:
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/ballkontrolle.mp4',
    playlistTitle: '5 Ball Mastery',
    duration: 531,
    chapters: [
      {
        id: 'drag-back-croqueta',
        title: 'Drag Back & Croqueta',
        startTime: 88,
        endTime: 148,
      },
      {
        id: 'sole-drag-back-roll',
        title: 'Sole Drag Back & Roll',
        startTime: 179,
        endTime: 239,
      },
      {
        id: 'inside-outside-sole-roll-v-cut',
        title: 'Inside Outside Sole Roll & V-Cut',
        startTime: 274,
        endTime: 334,
      },
      {
        id: 'sole-inside-drag-stepover',
        title: 'Sole Inside Drag & Stepover',
        startTime: 371,
        endTime: 431,
      },
      { id: 'v-cuts', title: 'V-Cuts', startTime: 471, endTime: 531 },
    ],
  },
  {
    id: '5-v-cut-skills',
    title: '5 V-Cut Skills',
    description: 'Five V-Cut ball mastery skills',
    category: 'Ball Mastery',
    type: 'playlist',
    playlistTitle: '5 V-Cut Skills',
    chapters: [
      {
        id: 'inside-v-cuts',
        title: 'Inside V-Cuts',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Ball_Mastery/5_V_Cut_Ball_Mastery_Skills_-_Five_Easy_Ball_Mastery_Skills_To_Master_The_V_Cut/clips/01_Inside_V-Cuts.mp4',
      },
      {
        id: 'outside-v-cuts',
        title: 'Outside V-Cuts',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Ball_Mastery/5_V_Cut_Ball_Mastery_Skills_-_Five_Easy_Ball_Mastery_Skills_To_Master_The_V_Cut/clips/02_Outside_V-Cuts.mp4',
      },
      {
        id: 'alternate-v-cuts',
        title: 'Alternate V-Cuts',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Ball_Mastery/5_V_Cut_Ball_Mastery_Skills_-_Five_Easy_Ball_Mastery_Skills_To_Master_The_V_Cut/clips/03_Alternate_V-Cuts.mp4',
      },
      {
        id: 'inside-outside-v-cuts',
        title: 'Inside Outside V-Cuts',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Ball_Mastery/5_V_Cut_Ball_Mastery_Skills_-_Five_Easy_Ball_Mastery_Skills_To_Master_The_V_Cut/clips/04_Inside_Outside_V-Cuts.mp4',
      },
      {
        id: 'inside-alternate-combo',
        title: 'Inside Alternate Combo',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Ball_Mastery/5_V_Cut_Ball_Mastery_Skills_-_Five_Easy_Ball_Mastery_Skills_To_Master_The_V_Cut/clips/05_InsideAlternate_Combo.mp4',
      },
    ],
  },
  {
    id: 'l-drag',
    title: 'L-Drag',
    description: 'L-Drag ball mastery sequence',
    category: 'Ball Mastery',
    type: 'playlist',
    playlistTitle: 'L-Drag',
    chapters: [
      {
        id: 'l-drag-basics',
        title: 'L-Drag Basics',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Skills_Moves/5_L_Drag_Mastery_Skills_-_Five_Simple_Ball_Mastery_Skills_To_Master_The_L_Drag/clips/01_L-Drag_Basics.mp4',
      },
      {
        id: 'advanced-l-drag',
        title: 'Advanced L-Drag',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Skills_Moves/5_L_Drag_Mastery_Skills_-_Five_Simple_Ball_Mastery_Skills_To_Master_The_L_Drag/clips/02_Advanced_L-Drag.mp4',
      },
      {
        id: 'continuous-l-drags',
        title: 'Continuous L-Drags',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Skills_Moves/5_L_Drag_Mastery_Skills_-_Five_Simple_Ball_Mastery_Skills_To_Master_The_L_Drag/clips/03_Continuous_L-Drags.mp4',
      },
      {
        id: 'the-samba',
        title: 'The Samba',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Skills_Moves/5_L_Drag_Mastery_Skills_-_Five_Simple_Ball_Mastery_Skills_To_Master_The_L_Drag/clips/04_The_Samba.mp4',
      },
      {
        id: 'l-drag-sole-roll',
        title: 'L-Drag Sole Roll',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Skills_Moves/5_L_Drag_Mastery_Skills_-_Five_Simple_Ball_Mastery_Skills_To_Master_The_L_Drag/clips/05_L-Drag_Sole_Roll.mp4',
      },
    ],
  },
  // Skills
  {
    id: 'chop',
    title: 'Chop',
    description: 'Easy chop skills to beat defenders',
    category: 'Skills',
    type: 'playlist',
    playlistTitle: 'Chop',
    chapters: [
      {
        id: 'the-classic-chop',
        title: 'The Classic Chop',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Skills_Moves/5_Easy_Chop_Skills_To_Beat_Defenders_-_Learn_These_Simple_Dribbling_Moves/clips/01_The_Classic_Chop.mp4',
      },
      {
        id: 'the-chop-cut',
        title: 'The Chop Cut',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Skills_Moves/5_Easy_Chop_Skills_To_Beat_Defenders_-_Learn_These_Simple_Dribbling_Moves/clips/02_The_Chop_Cut.mp4',
      },
      {
        id: 'the-neymar-chop',
        title: 'The Neymar Chop',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Skills_Moves/5_Easy_Chop_Skills_To_Beat_Defenders_-_Learn_These_Simple_Dribbling_Moves/clips/03_The_Neymar_Chop.mp4',
      },
      {
        id: 'the-ronaldo-chop',
        title: 'The Ronaldo Chop',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Skills_Moves/5_Easy_Chop_Skills_To_Beat_Defenders_-_Learn_These_Simple_Dribbling_Moves/clips/04_The_Ronaldo_Chop.mp4',
      },
      {
        id: 'elastico-chop',
        title: 'Elastico Chop',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Skills_Moves/5_Easy_Chop_Skills_To_Beat_Defenders_-_Learn_These_Simple_Dribbling_Moves/clips/05_Elastico_Chop.mp4',
      },
    ],
  },
  {
    id: '5-basic-turns',
    title: '5 Basic Turns',
    description: 'Five foundational turns every player should master',
    category: 'Skills',
    type: 'playlist',
    playlistTitle: '5 Basic Turns',
    chapters: [
      {
        id: 'inside-foot-turn',
        title: 'Inside Foot Turn',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Skills_Moves/5_Turns_Every_Player_Should_Master_-_Glide_Past_Defenders_With_These_5_Moves/clips/01_Inside_Foot_Turn.mp4',
      },
      {
        id: 'outside-foot-turn',
        title: 'Outside Foot Turn',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Skills_Moves/5_Turns_Every_Player_Should_Master_-_Glide_Past_Defenders_With_These_5_Moves/clips/02_Outside_Foot_Turn.mp4',
      },
      {
        id: 'inside-foot-turn-behind-foot',
        title: 'Inside Foot Turn Behind Foot',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Skills_Moves/5_Turns_Every_Player_Should_Master_-_Glide_Past_Defenders_With_These_5_Moves/clips/03_Inside_Foot_Turn_Behind_Foot.mp4',
      },
      {
        id: 'pull-snap',
        title: 'Pull Snap',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Skills_Moves/5_Turns_Every_Player_Should_Master_-_Glide_Past_Defenders_With_These_5_Moves/clips/04_Pull_Snap.mp4',
      },
      {
        id: 'inside-turn-with-fake',
        title: 'Inside Turn with Fake',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/Skills_Moves/5_Turns_Every_Player_Should_Master_-_Glide_Past_Defenders_With_These_5_Moves/clips/05_Inside_Turn_with_Fake.mp4',
      },
    ],
  },
  // Flexibility & Recovery
  {
    id: '24-yoga-stretches',
    title: '24 Yoga Stretches',
    description: 'Full deep stretch and yoga routine for soccer players',
    category: 'Flexibility & Recovery',
    type: 'chapters',
    videoUrl:
      "https://data-h03.fra1.cdn.digitaloceanspaces.com/7mlc/stretch/Pro_Footballer's_Full_Deep_Stretch_and_Yoga_Routine_-_30_Minute_Yoga_for_Soccer_Players_faststart.mp4",
    playlistTitle: '24 Yoga Stretches',
    duration: 1877,
    chapters: [
      { id: 'toe-stretch', title: 'Toe Stretch', startTime: 69, endTime: 130 },
      {
        id: 'top-of-foot-ankle-stretch',
        title: 'Top of Foot/Ankle Stretch',
        startTime: 139,
        endTime: 199,
      },
      {
        id: 'downward-dog-calf-stretch-left',
        title: 'Downward Dog Calf Stretch (Left)',
        startTime: 208,
        endTime: 269,
      },
      {
        id: 'downward-dog-calf-stretch-right',
        title: 'Downward Dog Calf Stretch (Right)',
        startTime: 279,
        endTime: 339,
      },
      {
        id: 'lying-quad-stretch-left',
        title: 'Lying Quad Stretch (Left)',
        startTime: 349,
        endTime: 409,
      },
      {
        id: 'lying-quad-stretch-right',
        title: 'Lying Quad Stretch (Right)',
        startTime: 419,
        endTime: 479,
      },
      {
        id: 'downward-dog-hamstring-calf-stretch',
        title: 'Downward Dog Hamstring/Calf Stretch',
        startTime: 489,
        endTime: 549,
      },
      {
        id: 'frog-stretch',
        title: 'Frog Stretch',
        startTime: 555,
        endTime: 619,
      },
      {
        id: 'half-frog-stretch-left',
        title: 'Half Frog Stretch (Left)',
        startTime: 626,
        endTime: 689,
      },
      {
        id: 'half-frog-stretch-right',
        title: 'Half Frog Stretch (Right)',
        startTime: 699,
        endTime: 759,
      },
      {
        id: 'seated-hamstring-stretch',
        title: 'Seated Hamstring Stretch',
        startTime: 769,
        endTime: 829,
      },
      {
        id: 'seated-straddle-stretch-center',
        title: 'Seated Straddle Stretch (Center)',
        startTime: 830,
        endTime: 890,
      },
      {
        id: 'seated-straddle-stretch-left',
        title: 'Seated Straddle Stretch (Left)',
        startTime: 909,
        endTime: 969,
      },
      {
        id: 'seated-straddle-stretch-right',
        title: 'Seated Straddle Stretch (Right)',
        startTime: 978,
        endTime: 1039,
      },
      {
        id: 'couch-quad-hip-flexor-stretch-left',
        title: 'Couch Quad/Hip Flexor Stretch (Left)',
        startTime: 1050,
        endTime: 1109,
      },
      {
        id: 'couch-quad-hip-flexor-stretch-right',
        title: 'Couch Quad/Hip Flexor Stretch (Right)',
        startTime: 1119,
        endTime: 1179,
      },
      {
        id: 'couch-adductor-hip-flexor-stretch-left',
        title: 'Couch Adductor/Hip Flexor Stretch (Left)',
        startTime: 1189,
        endTime: 1249,
      },
      {
        id: 'couch-adductor-hip-flexor-stretch-right',
        title: 'Couch Adductor/Hip Flexor Stretch (Right)',
        startTime: 1260,
        endTime: 1320,
      },
      {
        id: 'figure-four-glute-stretch-right',
        title: 'Figure Four Glute Stretch (Right)',
        startTime: 1469,
        endTime: 1529,
      },
      {
        id: 'figure-four-glute-stretch-left',
        title: 'Figure Four Glute Stretch (Left)',
        startTime: 1540,
        endTime: 1600,
      },
      {
        id: 'seal-stretch',
        title: 'Seal Stretch',
        startTime: 1607,
        endTime: 1669,
      },
      {
        id: 'childs-pose',
        title: "Child's Pose",
        startTime: 1679,
        endTime: 1739,
      },
      {
        id: 'criss-cross-applesauce-stretch-left-leg-under',
        title: 'Criss-Cross Applesauce Stretch (Left Leg Under)',
        startTime: 1746,
        endTime: 1806,
      },
      {
        id: 'criss-cross-applesauce-stretch-right-leg-under',
        title: 'Criss-Cross Applesauce Stretch (Right Leg Under)',
        startTime: 1808,
        endTime: 1877,
      },
    ],
  },
  // Passing & First Touch
  {
    id: '5-passing-drills',
    title: '5 Passing Drills',
    description: 'Five passing drills with combinations and first touch',
    category: 'Passing & First Touch',
    type: 'chapters',
    videoUrl: 'https://data-h03.fra1.cdn.digitaloceanspaces.com/Passing.mp4',
    playlistTitle: '5 Passing Drills',
    duration: 395,
    chapters: [
      {
        id: 'innenseitenpass-mit-richtungswechsel',
        title: 'Innenseitenpass mit Richtungswechsel',
        startTime: 41,
        endTime: 95,
      },
      {
        id: 'direktpass-mit-seitlicher-ballannahme',
        title: 'Direktpass mit seitlicher Ballannahme',
        startTime: 101,
        endTime: 146,
      },
      {
        id: 'passfolge-mit-aussenseiten-und-innenseitenpaessen',
        title: 'Passfolge mit Außenseiten- und Innenseitenpässen',
        startTime: 152,
        endTime: 221,
      },
      {
        id: 'ballannahme-hinter-dem-standbein-mit-rueckpass',
        title: 'Ballannahme hinter dem Standbein mit Rückpass',
        startTime: 227,
        endTime: 312,
      },
      {
        id: 'kombinationspass-mit-haken-und-aussenseiten-touch',
        title: 'Kombinationspass mit Haken und Außenseiten-Touch',
        startTime: 318,
        endTime: 395,
      },
    ],
  },
  {
    id: 'prellwand-1',
    title: 'Prellwand-1',
    description: 'Individual first touch drills against a rebound wall',
    category: 'Passing & First Touch',
    type: 'playlist',
    playlistTitle: 'Prellwand-1',
    chapters: [
      {
        id: 'inside-outside',
        title: 'Inside Outside',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/First_Touch/5_Individual_First_Touch_Drills_-_Improve_Your_First_Touch_With_These_Exercises/clips/01_Inside_Outside.mp4',
      },
      {
        id: 'backfoot',
        title: 'Backfoot',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/First_Touch/5_Individual_First_Touch_Drills_-_Improve_Your_First_Touch_With_These_Exercises/clips/02_Backfoot.mp4',
      },
      {
        id: 'first-time-passes',
        title: 'First-time Passes',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/First_Touch/5_Individual_First_Touch_Drills_-_Improve_Your_First_Touch_With_These_Exercises/clips/03_First-time_Passes.mp4',
      },
      {
        id: 'inside-outside-pattern',
        title: 'Inside Outside Pattern',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/First_Touch/5_Individual_First_Touch_Drills_-_Improve_Your_First_Touch_With_These_Exercises/clips/04_Inside_Outside_Pattern.mp4',
      },
      {
        id: 'first-time-pass-pattern',
        title: 'First-time Pass Pattern',
        videoUrl:
          'https://data-h03.fra1.cdn.digitaloceanspaces.com/trainings-video/First_Touch/5_Individual_First_Touch_Drills_-_Improve_Your_First_Touch_With_These_Exercises/clips/05_First-time_Pass_Pattern.mp4',
      },
    ],
  },
];

// Utility functions
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const generatePlaylist = (video: VideoData): PlaylistItem[] => {
  return video.chapters.map((chapter, index) => ({
    id: chapter.id,
    title: chapter.title,
    artist: video.playlistTitle,
    duration:
      chapter.startTime && chapter.endTime
        ? formatDuration(chapter.endTime - chapter.startTime)
        : '2:30', // default for playlist items
    videoId: video.id,
    chapterId: chapter.id,
    isNew: Boolean(chapter.videoUrl),
    rank: chapter.rank,
    score: chapter.score,
    startTime: chapter.startTime,
    endTime: chapter.endTime,
    videoUrl: chapter.videoUrl || video.videoUrl,
  }));
};

export const getVideoById = (id: string): VideoData | undefined => {
  return videoDatabase.find((video) => video.id === id);
};

export const getChapterByIds = (
  videoId: string,
  chapterId: string,
): VideoChapter | undefined => {
  const video = getVideoById(videoId);
  return video?.chapters.find((chapter) => chapter.id === chapterId);
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(videoDatabase.map((video) => video.category)));
};

export const getVideosByCategory = (category: string): VideoData[] => {
  return videoDatabase.filter((video) => video.category === category);
};

export const getDefaultPlaylist = (): PlaylistItem[] => {
  return videoDatabase.length > 0 ? generatePlaylist(videoDatabase[0]) : [];
};
