/**
 * Describes the media assets associated with a workout exercise, including
 * the primary image (required) and optional alternative images or videos.
 * This shape anticipates future expansion to richer media libraries.
 */
export interface ExerciseMedia {
  /**
   * Optional path to the primary image for the exercise.
   */
  imageSrc?: string;
  /**
   * Accessible description for the primary image.
   */
  imageAlt?: string;
  /**
   * Optional collection of alternative images (variations, progressions, etc.).
   */
  alternativeImages?: Array<{
    src: string;
    alt: string;
  }>;
  /**
   * Optional path to a primary demonstration video.
   */
  videoSrc?: string;
  /**
   * Optional poster image to display before the primary video plays.
   */
  posterSrc?: string;
  /**
   * Optional collection of additional video resources.
   */
  alternativeVideos?: Array<{
    src: string;
    label?: string;
    poster?: string;
  }>;
}

/**
 * Maps an exercise name to its media definition.
 */
export type MediaMapping = Record<string, ExerciseMedia>;

const MEDIA_BASE_PATH = '/assets/images/drills';
const VIDEO_BASE_PATH = '/assets/videos';

/**
 * Centralized media lookup for interval timer exercises. This ensures that new
 * components (such as the exercise library) can consistently resolve media
 * assets for each exercise definition.
 */
export const EXERCISE_MEDIA_MAP: MediaMapping = {
  // Existing Exercises
  'Forearm Plank': {
    imageSrc: `${MEDIA_BASE_PATH}/forearm-plank.jpg`,
    imageAlt: 'Person holding a forearm plank with a straight body line.',
    videoSrc: `${VIDEO_BASE_PATH}/forearm-plank.mp4`,
    posterSrc: `${MEDIA_BASE_PATH}/forearm-plank.jpg`,
  },
  'Side Forearm Plank': {
    imageSrc: `${MEDIA_BASE_PATH}/side-forearm-plank.jpg`,
    imageAlt: 'Athlete performing a side forearm plank with hips lifted.',
  },
  'Hamstrings Beginner': {
    imageSrc: `${MEDIA_BASE_PATH}/hamstrings-beginner.jpg`,
    imageAlt:
      'Individual stretching hamstrings using a controlled assisted movement.',
  },
  'Single Leg Stance': {
    imageSrc: `${MEDIA_BASE_PATH}/single-leg-stance.jpg`,
    imageAlt: 'Person balancing on one leg while engaging core muscles.',
  },
  'Squats on Toes': {
    imageSrc: `${MEDIA_BASE_PATH}/squats-on-toes.jpg`,
    imageAlt: 'Athlete executing a squat while balanced on toes.',
  },
  'Vertical Jumps': {
    imageSrc: `${MEDIA_BASE_PATH}/vertical-jumps.jpg`,
    imageAlt: 'Athlete reaching upward during a vertical jump.',
  },

  // New Stretch Exercises
  "Child's Pose": {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759149953/Stretch/c8sdairlonfzjadqigxx.mp4',
  },
  'Seal Stretch': {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759150000/Stretch/tzsmzaacsnqhdbecbafu.mp4',
  },
  "Child's Pose with Left Twist": {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759149984/Stretch/mxwjhekkolbhkq2ab9lb.mp4',
  },
  "Child's Pose with Right Twist": {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759149992/Stretch/sjnltvrcmjbvggzsg39v.mp4',
  },
  'Pigeon Stretch - Right': {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759150023/Stretch/pxmkaqjwv9lapfxnzytm.mp4',
  },
  'Pigeon Stretch - Left': {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759150031/Stretch/tnbagur2qgku8s1pfmj5.mp4',
  },
  'Couch Stretch - Left': {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759150040/Stretch/vfvcprwv6bgtd77qkq8l.mp4',
  },
  'Couch Stretch - Right': {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759150058/Stretch/sueemxy0gdngkdvypi6v.mp4',
  },
  'Criss Cross and Reach': {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759150094/Stretch/qa5ol9lzuudgugyvvcqh.mp4',
  },
  'Criss Cross and Reach - Oppo': {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759150104/Stretch/vfv2iygnbpubiwhpcqac.mp4',
  },
  'Frog Stretch': {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759150116/Stretch/dswadlxgv1hgz0ijn6rx.mp4',
  },
  'Quad Stretch - Left': {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759150124/Stretch/akrz8xdo0wnhka2sxxa3.mp4',
  },
  'Quad Stretch - Right': {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759150141/Stretch/mmktj5feewzhqhb9kgom.mp4',
  },
  'Seated Hamstring': {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759150163/Stretch/ycwxu1tsqirgqxqzsnrh.mp4',
  },
  'Wide Leg Hamstring with Left Twist': {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759150188/Stretch/w3qvvyeqdaun97bvrir6.mp4',
  },
  'Wide Leg Hamstring with Right Twist': {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759150211/Stretch/vexzrfsx2sdqj1szqe7i.mp4',
  },
  'Sit Back on Heels': {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759150230/Stretch/oos8vrhnfts36rj5tsyu.mp4',
  },
  'Downward Dog': {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759150247/Stretch/cuzl4sbbedgtequ2so7t.mp4',
  },
  'Sit Back on Heels with Knee Raise': {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759150262/Stretch/usqgj1dclmg3ikqyaqzj.mp4',
  },
  'Calf Stretch - Left': {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759150278/Stretch/mt8pfl6f8zcikuzb8xu8.mp4',
  },
  'Calf Stretch - Right': {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759150294/Stretch/zieosofbwqvbis1kznui.mp4',
  },
  'Sit Back on Toes': {
    videoSrc:
      'https://res.cloudinary.com/dwedvwkzw/video/upload/v1759150312/Stretch/srih8vxkveajgwzh4g3r.mp4',
  },
};
