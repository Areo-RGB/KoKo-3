import type { WorkoutPreset } from './types';

export const WORKOUT_PRESETS: WorkoutPreset[] = [
  {
    id: 'full-body-stretch',
    name: 'Full Body Stretch Routine',
    description:
      'A guided routine to improve flexibility and relieve tension throughout the body.',
    exercises: [
      {
        name: "Child's Pose",
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Gently rest your forehead on the floor, breathing deeply into your back.',
      },
      {
        name: 'Seal Stretch',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Press through your hands to lift your chest, keeping your hips on the floor. Look forward.',
      },
      {
        name: "Child's Pose with Left Twist",
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Thread your right arm under your left, resting on your shoulder and temple. Feel the stretch in your upper back.',
      },
      {
        name: "Child's Pose with Right Twist",
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Thread your left arm under your right, resting on your shoulder and temple. Feel the stretch in your upper back.',
      },
      {
        name: 'Seal Stretch',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Return to the seal stretch to release the spine. Keep your shoulders down and away from your ears.',
      },
      {
        name: 'Pigeon Stretch - Right',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Keep your hips square to the front as you sink into the stretch. Feel it in your right glute.',
      },
      {
        name: 'Pigeon Stretch - Left',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Keep your hips square to the front as you sink into the stretch. Feel it in your left glute.',
      },
      {
        name: 'Couch Stretch - Left',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Engage your core and glutes to deepen the stretch in your left hip flexor and quad.',
      },
      {
        name: 'Couch Stretch - Right',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Engage your core and glutes to deepen the stretch in your right hip flexor and quad.',
      },
      {
        name: 'Criss Cross and Reach',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Cross one leg over the other and gently fold forward to stretch your hamstrings and outer hips.',
      },
      {
        name: 'Criss Cross and Reach - Oppo',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Switch the cross of your legs and repeat the forward fold.',
      },
      {
        name: 'Frog Stretch',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Keep your ankles in line with your knees and gently press your hips back. Feel the stretch in your inner thighs.',
      },
      {
        name: 'Quad Stretch - Left',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Hold your left foot and gently pull your heel towards your glute. Keep your knees together.',
      },
      {
        name: 'Quad Stretch - Right',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Hold your right foot and gently pull your heel towards your glute. Keep your knees together.',
      },
      {
        name: 'Seated Hamstring',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Sit tall and gently fold over your extended legs, keeping your back as straight as possible.',
      },
      {
        name: 'Wide Leg Hamstring with Left Twist',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Fold over your left leg, then gently twist your torso open to the right.',
      },
      {
        name: 'Wide Leg Hamstring with Right Twist',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Fold over your right leg, then gently twist your torso open to the left.',
      },
      {
        name: 'Sit Back on Heels',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Sit back on your heels to stretch the tops of your feet and shins.',
      },
      {
        name: 'Downward Dog',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Press through your hands, lift your hips high, and gently pedal your feet to stretch your calves and hamstrings.',
      },
      {
        name: 'Sit Back on Heels with Knee Raise',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'From a seated position on your heels, gently lift your knees to deepen the stretch in your ankles.',
      },
      {
        name: 'Calf Stretch - Left',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Press your left heel towards the floor, keeping your leg straight.',
      },
      {
        name: 'Calf Stretch - Right',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 5,
        instructions:
          'Press your right heel towards the floor, keeping your leg straight.',
      },
      {
        name: 'Sit Back on Toes',
        type: 'hold',
        sets: 1,
        duration: 30,
        restAfter: 0,
        instructions:
          'Tuck your toes under and sit back on your heels to stretch the soles of your feet.',
      },
    ],
  },
  {
    id: 'stability-core',
    name: 'Stability & Core Training',
    description:
      'A comprehensive workout focusing on core strength, balance, and stability.',
    exercises: [
      {
        name: 'Forearm Plank',
        type: 'hold',
        sets: 3,
        duration: 30,
        restAfter: 15,
        instructions:
          'Maintain a straight line from head to heels. Engage your core and glutes.',
      },
      {
        name: 'Side Forearm Plank',
        type: 'hold',
        sets: 3,
        duration: 30,
        restAfter: 15,
        sideSpecific: true,
        instructions:
          'Keep your body in a straight line, hips high. Avoid letting your hips sag.',
      },
      {
        name: 'Hamstrings Beginner',
        type: 'reps',
        sets: 1,
        reps: 5,
        duration: 60,
        restAfter: 15,
        instructions:
          'Lower your body slowly and controlled. Use your hands to push back up.',
      },
      {
        name: 'Single Leg Stance',
        type: 'hold',
        sets: 2,
        duration: 30,
        restAfter: 15,
        sideSpecific: true,
        instructions:
          'Hold a ball and keep your balance. Engage your core to stay stable.',
      },
      {
        name: 'Squats on Toes',
        type: 'work',
        sets: 2,
        duration: 30,
        restAfter: 15,
        instructions:
          'Keep your back straight and chest up. Go as low as you can while maintaining balance on your toes.',
      },
      {
        name: 'Vertical Jumps',
        type: 'work',
        sets: 2,
        duration: 30,
        restAfter: 15,
        instructions:
          'Explode upwards, reaching for maximum height. Land softly to absorb the impact.',
      },
    ],
  },
  {
    id: 'drill-1',
    name: 'Drill 1',
    description: 'A simple work/rest drill.',
    exercises: [
      {
        name: 'High Knees',
        type: 'work',
        sets: 2,
        duration: 30,
        restAfter: 10,
      },
    ],
  },
  {
    id: 'hiit-basic',
    name: 'HIIT Basic',
    description: 'A classic High-Intensity Interval Training session.',
    exercises: [
      { name: 'Burpees', type: 'work', sets: 8, duration: 45, restAfter: 15 },
    ],
  },
  {
    id: 'tabata',
    name: 'Tabata',
    description:
      '20 seconds of all-out effort followed by 10 seconds of rest, 8 rounds.',
    exercises: [
      {
        name: 'Jumping Jacks',
        type: 'work',
        sets: 8,
        duration: 20,
        restAfter: 10,
      },
    ],
  },
  {
    id: 'sprint-intervals',
    name: 'Sprint Intervals',
    description: 'Longer work intervals to build endurance.',
    exercises: [
      {
        name: 'Sprinting in Place',
        type: 'work',
        sets: 6,
        duration: 60,
        restAfter: 30,
      },
    ],
  },
];
