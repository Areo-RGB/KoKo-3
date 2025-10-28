// Yo-Yo IR1 Test Protocol Data
// Based on official Yo-Yo Intermittent Recovery Test Level 1

export interface ShuttleInfo {
  level: number;
  shuttle: number;
  speed: number; // km/h
  startTime: number; // seconds from test start
  endTime: number; // seconds from test start
  distance: number; // meters
}

export interface AthleteResult {
  id: string;
  name: string;
  dropOutShuttle?: number;
  dropOutTime?: number;
  estimatedDistance: number;
  completed: boolean;
  status: 'waiting' | 'active' | 'warned' | 'dropped-out' | 'completed';
  warnings: number;
}

export interface TestSession {
  id: string;
  date: Date;
  participants: string[];
  status: 'planned' | 'in-progress' | 'completed' | 'paused';
  results: AthleteResult[];
  currentShuttle: number;
  startTime?: number;
  elapsedTime: number;
}

// Corrected Yo-Yo IR1 Test Protocol - 2x20m shuttles with 10s recovery
export const YOYO_IR1_PROTOCOL: ShuttleInfo[] = [
  {
    level: 5,
    shuttle: 1,
    speed: 10,
    startTime: 0,
    endTime: 14.4,
    distance: 40,
  },
  {
    level: 9,
    shuttle: 1,
    speed: 11.5,
    startTime: 24.4,
    endTime: 36.92,
    distance: 80,
  },
  {
    level: 11,
    shuttle: 1,
    speed: 12,
    startTime: 46.92,
    endTime: 58.92,
    distance: 120,
  },
  {
    level: 11,
    shuttle: 2,
    speed: 12,
    startTime: 68.92,
    endTime: 80.92,
    distance: 160,
  },
  {
    level: 12,
    shuttle: 1,
    speed: 12.5,
    startTime: 90.92,
    endTime: 102.44,
    distance: 200,
  },
  {
    level: 12,
    shuttle: 2,
    speed: 12.5,
    startTime: 112.44,
    endTime: 123.96,
    distance: 240,
  },
  {
    level: 12,
    shuttle: 3,
    speed: 12.5,
    startTime: 133.96,
    endTime: 145.48,
    distance: 280,
  },
  {
    level: 13,
    shuttle: 1,
    speed: 13,
    startTime: 155.48,
    endTime: 166.56,
    distance: 320,
  },
  {
    level: 13,
    shuttle: 2,
    speed: 13,
    startTime: 176.56,
    endTime: 187.64,
    distance: 360,
  },
  {
    level: 13,
    shuttle: 3,
    speed: 13,
    startTime: 197.64,
    endTime: 208.72,
    distance: 400,
  },
  {
    level: 13,
    shuttle: 4,
    speed: 13,
    startTime: 218.72,
    endTime: 229.8,
    distance: 440,
  },
  {
    level: 14,
    shuttle: 1,
    speed: 13.5,
    startTime: 239.8,
    endTime: 250.33,
    distance: 480,
  },
  {
    level: 14,
    shuttle: 2,
    speed: 13.5,
    startTime: 260.33,
    endTime: 270.86,
    distance: 520,
  },
  {
    level: 14,
    shuttle: 3,
    speed: 13.5,
    startTime: 280.86,
    endTime: 291.39,
    distance: 560,
  },
  {
    level: 14,
    shuttle: 4,
    speed: 13.5,
    startTime: 301.39,
    endTime: 311.92,
    distance: 600,
  },
  {
    level: 14,
    shuttle: 5,
    speed: 13.5,
    startTime: 321.92,
    endTime: 332.45,
    distance: 640,
  },
  {
    level: 14,
    shuttle: 6,
    speed: 13.5,
    startTime: 342.45,
    endTime: 352.98,
    distance: 680,
  },
  {
    level: 14,
    shuttle: 7,
    speed: 13.5,
    startTime: 362.98,
    endTime: 373.51,
    distance: 720,
  },
  {
    level: 14,
    shuttle: 8,
    speed: 13.5,
    startTime: 383.51,
    endTime: 394.04,
    distance: 760,
  },
  {
    level: 15,
    shuttle: 1,
    speed: 14,
    startTime: 404.04,
    endTime: 414.33,
    distance: 800,
  },
  {
    level: 15,
    shuttle: 2,
    speed: 14,
    startTime: 424.33,
    endTime: 434.62,
    distance: 840,
  },
  {
    level: 15,
    shuttle: 3,
    speed: 14,
    startTime: 444.62,
    endTime: 454.91,
    distance: 880,
  },
  {
    level: 15,
    shuttle: 4,
    speed: 14,
    startTime: 464.91,
    endTime: 475.2,
    distance: 920,
  },
  {
    level: 15,
    shuttle: 5,
    speed: 14,
    startTime: 485.2,
    endTime: 495.49,
    distance: 960,
  },
  {
    level: 15,
    shuttle: 6,
    speed: 14,
    startTime: 505.49,
    endTime: 515.78,
    distance: 1000,
  },
  {
    level: 15,
    shuttle: 7,
    speed: 14,
    startTime: 525.78,
    endTime: 536.07,
    distance: 1040,
  },
  {
    level: 15,
    shuttle: 8,
    speed: 14,
    startTime: 546.07,
    endTime: 556.36,
    distance: 1080,
  },
  {
    level: 16,
    shuttle: 1,
    speed: 14.5,
    startTime: 566.36,
    endTime: 576.24,
    distance: 1120,
  },
  {
    level: 16,
    shuttle: 2,
    speed: 14.5,
    startTime: 586.24,
    endTime: 596.12,
    distance: 1160,
  },
  {
    level: 16,
    shuttle: 3,
    speed: 14.5,
    startTime: 606.12,
    endTime: 616,
    distance: 1200,
  },
  {
    level: 16,
    shuttle: 4,
    speed: 14.5,
    startTime: 626,
    endTime: 635.88,
    distance: 1240,
  },
  {
    level: 16,
    shuttle: 5,
    speed: 14.5,
    startTime: 645.88,
    endTime: 655.76,
    distance: 1280,
  },
  {
    level: 16,
    shuttle: 6,
    speed: 14.5,
    startTime: 665.76,
    endTime: 675.64,
    distance: 1320,
  },
  {
    level: 16,
    shuttle: 7,
    speed: 14.5,
    startTime: 685.64,
    endTime: 695.52,
    distance: 1360,
  },
  {
    level: 16,
    shuttle: 8,
    speed: 14.5,
    startTime: 705.52,
    endTime: 715.4,
    distance: 1400,
  },
  {
    level: 17,
    shuttle: 1,
    speed: 15,
    startTime: 725.4,
    endTime: 735,
    distance: 1440,
  },
  {
    level: 17,
    shuttle: 2,
    speed: 15,
    startTime: 745,
    endTime: 754.6,
    distance: 1480,
  },
  {
    level: 17,
    shuttle: 3,
    speed: 15,
    startTime: 764.6,
    endTime: 774.2,
    distance: 1520,
  },
  {
    level: 17,
    shuttle: 4,
    speed: 15,
    startTime: 784.2,
    endTime: 793.8,
    distance: 1560,
  },
  {
    level: 17,
    shuttle: 5,
    speed: 15,
    startTime: 803.8,
    endTime: 813.4,
    distance: 1600,
  },
  {
    level: 17,
    shuttle: 6,
    speed: 15,
    startTime: 823.4,
    endTime: 833,
    distance: 1640,
  },
  {
    level: 17,
    shuttle: 7,
    speed: 15,
    startTime: 843,
    endTime: 852.6,
    distance: 1680,
  },
  {
    level: 17,
    shuttle: 8,
    speed: 15,
    startTime: 862.6,
    endTime: 872.2,
    distance: 1720,
  },
  {
    level: 18,
    shuttle: 1,
    speed: 15.5,
    startTime: 882.2,
    endTime: 891.47,
    distance: 1760,
  },
  {
    level: 18,
    shuttle: 2,
    speed: 15.5,
    startTime: 901.47,
    endTime: 910.74,
    distance: 1800,
  },
  {
    level: 18,
    shuttle: 3,
    speed: 15.5,
    startTime: 920.74,
    endTime: 930.01,
    distance: 1840,
  },
  {
    level: 18,
    shuttle: 4,
    speed: 15.5,
    startTime: 940.01,
    endTime: 949.28,
    distance: 1880,
  },
  {
    level: 18,
    shuttle: 5,
    speed: 15.5,
    startTime: 959.28,
    endTime: 968.55,
    distance: 1920,
  },
  {
    level: 18,
    shuttle: 6,
    speed: 15.5,
    startTime: 978.55,
    endTime: 987.82,
    distance: 1960,
  },
  {
    level: 18,
    shuttle: 7,
    speed: 15.5,
    startTime: 997.82,
    endTime: 1007.09,
    distance: 2000,
  },
  {
    level: 18,
    shuttle: 8,
    speed: 15.5,
    startTime: 1017.09,
    endTime: 1026.36,
    distance: 2040,
  },
  {
    level: 19,
    shuttle: 1,
    speed: 16,
    startTime: 1036.36,
    endTime: 1045.36,
    distance: 2080,
  },
  {
    level: 19,
    shuttle: 2,
    speed: 16,
    startTime: 1055.36,
    endTime: 1064.36,
    distance: 2120,
  },
  {
    level: 19,
    shuttle: 3,
    speed: 16,
    startTime: 1074.36,
    endTime: 1083.36,
    distance: 2160,
  },
  {
    level: 19,
    shuttle: 4,
    speed: 16,
    startTime: 1093.36,
    endTime: 1102.36,
    distance: 2200,
  },
  {
    level: 19,
    shuttle: 5,
    speed: 16,
    startTime: 1112.36,
    endTime: 1121.36,
    distance: 2240,
  },
  {
    level: 19,
    shuttle: 6,
    speed: 16,
    startTime: 1131.36,
    endTime: 1140.36,
    distance: 2280,
  },
  {
    level: 19,
    shuttle: 7,
    speed: 16,
    startTime: 1150.36,
    endTime: 1159.36,
    distance: 2320,
  },
  {
    level: 19,
    shuttle: 8,
    speed: 16,
    startTime: 1169.36,
    endTime: 1178.36,
    distance: 2360,
  },
  {
    level: 20,
    shuttle: 1,
    speed: 16.5,
    startTime: 1188.36,
    endTime: 1197.05,
    distance: 2400,
  },
  {
    level: 20,
    shuttle: 2,
    speed: 16.5,
    startTime: 1207.05,
    endTime: 1215.74,
    distance: 2440,
  },
  {
    level: 20,
    shuttle: 3,
    speed: 16.5,
    startTime: 1225.74,
    endTime: 1234.43,
    distance: 2480,
  },
  {
    level: 20,
    shuttle: 4,
    speed: 16.5,
    startTime: 1244.43,
    endTime: 1253.12,
    distance: 2520,
  },
  {
    level: 20,
    shuttle: 5,
    speed: 16.5,
    startTime: 1263.12,
    endTime: 1271.81,
    distance: 2560,
  },
  {
    level: 20,
    shuttle: 6,
    speed: 16.5,
    startTime: 1281.81,
    endTime: 1290.5,
    distance: 2600,
  },
  {
    level: 20,
    shuttle: 7,
    speed: 16.5,
    startTime: 1300.5,
    endTime: 1309.19,
    distance: 2640,
  },
  {
    level: 20,
    shuttle: 8,
    speed: 16.5,
    startTime: 1319.19,
    endTime: 1327.88,
    distance: 2680,
  },
  {
    level: 21,
    shuttle: 1,
    speed: 17,
    startTime: 1337.88,
    endTime: 1346.36,
    distance: 2720,
  },
  {
    level: 21,
    shuttle: 2,
    speed: 17,
    startTime: 1356.36,
    endTime: 1364.84,
    distance: 2760,
  },
  {
    level: 21,
    shuttle: 3,
    speed: 17,
    startTime: 1374.84,
    endTime: 1383.32,
    distance: 2800,
  },
  {
    level: 21,
    shuttle: 4,
    speed: 17,
    startTime: 1393.32,
    endTime: 1401.8,
    distance: 2840,
  },
  {
    level: 21,
    shuttle: 5,
    speed: 17,
    startTime: 1411.8,
    endTime: 1420.28,
    distance: 2880,
  },
  {
    level: 21,
    shuttle: 6,
    speed: 17,
    startTime: 1430.28,
    endTime: 1438.76,
    distance: 2920,
  },
  {
    level: 21,
    shuttle: 7,
    speed: 17,
    startTime: 1448.76,
    endTime: 1457.24,
    distance: 2960,
  },
  {
    level: 21,
    shuttle: 8,
    speed: 17,
    startTime: 1467.24,
    endTime: 1475.72,
    distance: 3000,
  },
  {
    level: 22,
    shuttle: 1,
    speed: 17.5,
    startTime: 1485.72,
    endTime: 1493.9,
    distance: 3040,
  },
  {
    level: 22,
    shuttle: 2,
    speed: 17.5,
    startTime: 1503.9,
    endTime: 1512.08,
    distance: 3080,
  },
  {
    level: 22,
    shuttle: 3,
    speed: 17.5,
    startTime: 1522.08,
    endTime: 1530.26,
    distance: 3120,
  },
  {
    level: 22,
    shuttle: 4,
    speed: 17.5,
    startTime: 1540.26,
    endTime: 1548.44,
    distance: 3160,
  },
  {
    level: 22,
    shuttle: 5,
    speed: 17.5,
    startTime: 1558.44,
    endTime: 1566.62,
    distance: 3200,
  },
  {
    level: 22,
    shuttle: 6,
    speed: 17.5,
    startTime: 1576.62,
    endTime: 1584.8,
    distance: 3240,
  },
  {
    level: 22,
    shuttle: 7,
    speed: 17.5,
    startTime: 1594.8,
    endTime: 1602.98,
    distance: 3280,
  },
  {
    level: 22,
    shuttle: 8,
    speed: 17.5,
    startTime: 1612.98,
    endTime: 1621.16,
    distance: 3320,
  },
  {
    level: 23,
    shuttle: 1,
    speed: 18,
    startTime: 1631.16,
    endTime: 1639.16,
    distance: 3360,
  },
  {
    level: 23,
    shuttle: 2,
    speed: 18,
    startTime: 1649.16,
    endTime: 1657.16,
    distance: 3400,
  },
  {
    level: 23,
    shuttle: 3,
    speed: 18,
    startTime: 1667.16,
    endTime: 1675.16,
    distance: 3440,
  },
  {
    level: 23,
    shuttle: 4,
    speed: 18,
    startTime: 1685.16,
    endTime: 1693.16,
    distance: 3480,
  },
  {
    level: 23,
    shuttle: 5,
    speed: 18,
    startTime: 1703.16,
    endTime: 1711.16,
    distance: 3520,
  },
  {
    level: 23,
    shuttle: 6,
    speed: 18,
    startTime: 1721.16,
    endTime: 1729.16,
    distance: 3560,
  },
  {
    level: 23,
    shuttle: 7,
    speed: 18,
    startTime: 1739.16,
    endTime: 1747.16,
    distance: 3600,
  },
  {
    level: 23,
    shuttle: 8,
    speed: 18,
    startTime: 1757.16,
    endTime: 1765.16,
    distance: 3640,
  },
];

// Helper functions for test protocol
export function getCurrentShuttle(elapsedTime: number): ShuttleInfo | null {
  // Find the shuttle that is currently active (i.e., in its running phase)
  const currentRunningShuttle = YOYO_IR1_PROTOCOL.find(
    (shuttle) =>
      elapsedTime >= shuttle.startTime && elapsedTime <= shuttle.endTime,
  );
  if (currentRunningShuttle) {
    return currentRunningShuttle;
  }

  // If not in a running phase, find the most recently completed shuttle
  for (let i = YOYO_IR1_PROTOCOL.length - 1; i >= 0; i--) {
    if (elapsedTime > YOYO_IR1_PROTOCOL[i].endTime) {
      return YOYO_IR1_PROTOCOL[i];
    }
  }

  return null; // Before the first shuttle
}

export function getNextShuttle(elapsedTime: number): ShuttleInfo | null {
  for (let i = 0; i < YOYO_IR1_PROTOCOL.length; i++) {
    const shuttle = YOYO_IR1_PROTOCOL[i];
    if (elapsedTime < shuttle.startTime) {
      return shuttle;
    }
  }
  return null;
}

export function getShuttleByIndex(index: number): ShuttleInfo | null {
  if (index >= 0 && index < YOYO_IR1_PROTOCOL.length) {
    return YOYO_IR1_PROTOCOL[index];
  }
  return null;
}

export function calculateEstimatedDistance(shuttleIndex: number): number {
  if (shuttleIndex < 0) return 0;
  if (shuttleIndex >= YOYO_IR1_PROTOCOL.length) {
    return YOYO_IR1_PROTOCOL[YOYO_IR1_PROTOCOL.length - 1].distance;
  }
  return YOYO_IR1_PROTOCOL[shuttleIndex].distance;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getShuttleDisplayText(shuttle: ShuttleInfo): string {
  return `Level ${shuttle.level} - Shuttle ${shuttle.shuttle} (${shuttle.speed} km/h)`;
}
