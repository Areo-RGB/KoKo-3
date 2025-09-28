// app/finley/_lib/training-plans/fifa.ts
export interface Drill {
  id: number;
  drillname: string;
  duration?: string;
  sets: string;
  repetitions?: string;
  videoId?: string;
}

export interface FifaLevel {
  section: string;
  level: number;
  drills: Drill[];
}

export const FIFA_LEVEL_1_DATA: FifaLevel = {
  section: 'Kraft · Plyometrie · Gleichgewicht',
  level: 1,
  drills: [
    {
      id: 7,
      drillname: 'Unterarmstütz Halten',
      duration: '20-30 seconds',
      sets: '3',
      videoId: 'fifa11-180',
    },
    {
      id: 8,
      drillname: 'Seitlicher Unterarmstütz Halten',
      duration: '20-30 seconds',
      sets: '3 per side',
      videoId: 'fifa11-287',
    },
    {
      id: 9,
      drillname: 'Oberschenkelrückseite Anfänger',
      repetitions: '3-5',
      sets: '1',
      videoId: 'fifa11-398',
    },
    {
      id: 10,
      drillname: 'Einbeinstand mit dem Ball',
      duration: '30 seconds',
      sets: '2 per leg',
      videoId: 'fifa11-438',
    },
    {
      id: 11,
      drillname: 'Kniebeugen auf die Zehenspitzen',
      duration: '30 seconds',
      sets: '2',
      videoId: 'fifa11-533',
    },
    {
      id: 12,
      drillname: 'Springen Sprünge nach oben',
      duration: '30 seconds',
      sets: '2',
      videoId: 'fifa11-639',
    },
  ],
};