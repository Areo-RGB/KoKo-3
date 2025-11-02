// app/video-player/_lib/video-data.ts
// Single source of truth for all video data, structured hierarchically.

// --- Interfaces for the VideoPlayer component and related utilities ---

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
  category: string; // e.g., "Training", "Wissen"
  type: 'chapters' | 'playlist';
  videoUrl?: string;
  playlistTitle: string;
  chapters: VideoChapter[];
}

export interface PlaylistItem {
  id: string;
  title: string;
  artist?: string;
  duration: string;
  videoId: string;
  chapterId?: string;
  isNew?: boolean;
  rank?: number;
  score?: string;
  startTime?: number;
  endTime?: number;
  videoUrl?: string;
}

// --- Interfaces for HierarchicalVideoData (used in page.tsx) ---

export interface Video {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  chapters: VideoChapter[];
  type: 'chapters' | 'playlist';
  playlistTitle?: string;
}

export interface Subcategory {
  name: string;
  videos: Video[];
}

export interface Category {
  name: string;
  subcategories: Subcategory[];
}

export interface HierarchicalVideoData {
  categories: Category[];
  legacyVideos: Video[];
}

// --- The Consolidated, Hierarchical Video Data Structure ---
const allVideoData: HierarchicalVideoData = {
  categories: [
    {
      name: 'Wissen',
      subcategories: [
        {
          name: 'Ernährung',
          videos: [
            {
              id: 'wissen-ernaehrung-grundlagen',
              title: 'Grundlagen der Sporternährung - Kraftstoff für das Spiel',
              videoUrl:
                'https://data-h03.fra1.cdn.digitaloceanspaces.com/Wissen/Ern%C3%A4hrung/Kraftstoff_f%C3%BCr_das_Spiel.mp4',
              type: 'chapters',
              playlistTitle: 'Grundlagen der Sporternährung',
              chapters: [
                {
                  id: 'wissen-ernaehrung-grundlagen-full',
                  title:
                    'Grundlagen der Sporternährung - Kraftstoff für das Spiel',
                  startTime: 0,
                },
              ],
            },
            {
              id: 'wissen-ernaehrung-workout',
              title: 'Pre- und Post-Workout Ernährung - Leistung steigern',
              videoUrl:
                'https://data-h03.fra1.cdn.digitaloceanspaces.com/Wissen/Ern%C3%A4hrung/Leistung_steigern.mp4',
              type: 'chapters',
              playlistTitle: 'Workout Ernährung',
              chapters: [
                {
                  id: 'wissen-ernaehrung-workout-full',
                  title: 'Pre- und Post-Workout Ernährung - Leistung steigern',
                  startTime: 0,
                },
              ],
            },
            {
              id: 'wissen-ernaehrung-sportgetraenke',
              title: 'Sportgetränke: Schokomilch vs. professionelle Drinks',
              videoUrl:
                'https://data-h03.fra1.cdn.digitaloceanspaces.com/Wissen/Ern%C3%A4hrung/Schokomilch_vs.mp4',
              type: 'chapters',
              playlistTitle: 'Sportgetränke & Elektrolyte',
              chapters: [
                {
                  id: 'wissen-ernaehrung-sportgetraenke-full',
                  title: 'Sportgetränke: Schokomilch vs. professionelle Drinks',
                  startTime: 0,
                },
              ],
            },
          ],
        },
        {
          name: 'Prävention',
          videos: [
            {
              id: 'wissen-praevention-verletzungen',
              title: 'Verletzungsprävention im Fußball - Der Preis des Spiels',
              videoUrl:
                'https://data-h03.fra1.cdn.digitaloceanspaces.com/Wissen/Pr%C3%A4vention/Der_Preis_des_Spiels.mp4',
              type: 'chapters',
              playlistTitle: 'Verletzungsprävention',
              chapters: [
                {
                  id: 'wissen-praevention-verletzungen-full',
                  title:
                    'Verletzungsprävention im Fußball - Der Preis des Spiels',
                  startTime: 0,
                },
              ],
            },
          ],
        },
        {
          name: 'Talent',
          videos: [
            {
              id: 'wissen-talent-identifikation',
              title: 'Die Wissenschaft der Talentsuche im Jugendfußball',
              videoUrl:
                'https://data-h03.fra1.cdn.digitaloceanspaces.com/Wissen/Talent/Die_Wissenschaft_der_Talentsuche.mp4',
              type: 'chapters',
              playlistTitle: 'Talentidentifikation',
              chapters: [
                {
                  id: 'wissen-talent-identifikation-full',
                  title: 'Die Wissenschaft der Talentsuche im Jugendfußball',
                  startTime: 0,
                },
              ],
            },
            {
              id: 'wissen-talent-entwicklung',
              title: 'Wie man einen Fußball-Superstar erkennt',
              videoUrl:
                'https://data-h03.fra1.cdn.digitaloceanspaces.com/Wissen/Talent/How_to_Spot_a_Soccer_Superstar.mp4',
              type: 'chapters',
              playlistTitle: 'Talententwicklung',
              chapters: [
                {
                  id: 'wissen-talent-entwicklung-full',
                  title: 'Wie man einen Fußball-Superstar erkennt',
                  startTime: 0,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Fussball',
      subcategories: [
        {
          name: 'Torwart',
          videos: [
            {
              id: 'torwart-teil-1-koordination',
              title: 'Torwart Teil 1: Koordination',
              description:
                'Spezialisierte Torwartübungen für Jugendtorhüterinnen und -torhüter.',
              type: 'playlist',
              playlistTitle: 'Torwart Teil 1: Koordination',
              videoUrl:
                'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-1-koordination/teil-1-koordination-abwurftechnik.mp4',
              chapters: [
                {
                  id: 'teil-1-koordination-abwurftechnik',
                  title: 'Abwurftechnik',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-1-koordination/teil-1-koordination-abwurftechnik.mp4',
                },
                {
                  id: 'teil-1-koordination-blickfeld',
                  title: 'Blickfeld',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-1-koordination/teil-1-koordination-blickfeld.mp4',
                },
                {
                  id: 'teil-1-koordination-prellen-mit-2-baellen',
                  title: 'Prellen Mit 2 Baellen',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-1-koordination/teil-1-koordination-prellen-mit-2-baellen.mp4',
                },
                {
                  id: 'teil-1-koordination-prellen-mit-schritttechniken',
                  title: 'Prellen Mit Schritttechniken',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-1-koordination/teil-1-koordination-prellen-mit-schritttechniken.mp4',
                },
                {
                  id: 'teil-1-koordination-prellen-mit-verschiedenen-uebergaengen-1',
                  title: 'Prellen Mit Verschiedenen Uebergaengen 1',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-1-koordination/teil-1-koordination-prellen-mit-verschiedenen-uebergaengen-1.mp4',
                },
                {
                  id: 'teil-1-koordination-prellen-mit-verschiedenen-uebergaengen-2',
                  title: 'Prellen Mit Verschiedenen Uebergaengen 2',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-1-koordination/teil-1-koordination-prellen-mit-verschiedenen-uebergaengen-2.mp4',
                },
                {
                  id: 'teil-1-koordination-prellen-mit-wahrnehmung',
                  title: 'Prellen Mit Wahrnehmung',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-1-koordination/teil-1-koordination-prellen-mit-wahrnehmung.mp4',
                },
                {
                  id: 'teil-1-koordination-prellen',
                  title: 'Prellen',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-1-koordination/teil-1-koordination-prellen.mp4',
                },
                {
                  id: 'teil-1-koordination-schritttechniken',
                  title: 'Schritttechniken',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-1-koordination/teil-1-koordination-schritttechniken.mp4',
                },
                {
                  id: 'teil-1-koordination-spielnahe-bewegungen-im-handlungsraum',
                  title: 'Spielnahe Bewegungen Im Handlungsraum',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-1-koordination/teil-1-koordination-spielnahe-bewegungen-im-handlungsraum.mp4',
                },
                {
                  id: 'teil-1-koordination-visuelle-signale-wahrnehmen-und-umsetzen-1',
                  title: 'Visuelle Signale Wahrnehmen Und Umsetzen 1',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-1-koordination/teil-1-koordination-visuelle-signale-wahrnehmen-und-umsetzen-1.mp4',
                },
                {
                  id: 'teil-1-koordination-visuelle-signale-wahrnehmen-und-umsetzen-2',
                  title: 'Visuelle Signale Wahrnehmen Und Umsetzen 2',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-1-koordination/teil-1-koordination-visuelle-signale-wahrnehmen-und-umsetzen-2.mp4',
                },
              ],
            },
            {
              id: 'torwart-teil-2-gymnastik',
              title: 'Torwart Teil 2: Gymnastik',
              description:
                'Spezialisierte Torwartübungen für Jugendtorhüterinnen und -torhüter.',
              type: 'playlist',
              playlistTitle: 'Torwart Teil 2: Gymnastik',
              videoUrl:
                'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-2-gymnastik/teil-2-gymnastik-achterkreise.mp4',
              chapters: [
                {
                  id: 'teil-2-gymnastik-achterkreise',
                  title: 'Achterkreise',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-2-gymnastik/teil-2-gymnastik-achterkreise.mp4',
                },
                {
                  id: 'teil-2-gymnastik-ball-hinter-dem-ruecken-aufnehmen',
                  title: 'Ball Hinter Dem Ruecken Aufnehmen',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-2-gymnastik/teil-2-gymnastik-ball-hinter-dem-ruecken-aufnehmen.mp4',
                },
                {
                  id: 'teil-2-gymnastik-coaching-grundstellung',
                  title: 'Coaching Grundstellung',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-2-gymnastik/teil-2-gymnastik-coaching-grundstellung.mp4',
                },
                {
                  id: 'teil-2-gymnastik-coaching-schrittbreite',
                  title: 'Coaching Schrittbreite',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-2-gymnastik/teil-2-gymnastik-coaching-schrittbreite.mp4',
                },
                {
                  id: 'teil-2-gymnastik-grundstellung-kevin-trapp',
                  title: 'Grundstellung Kevin Trapp',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-2-gymnastik/teil-2-gymnastik-grundstellung-kevin-trapp.mp4',
                },
                {
                  id: 'teil-2-gymnastik-ueber-dem-koerper',
                  title: 'Ueber Dem Koerper',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-2-gymnastik/teil-2-gymnastik-ueber-dem-koerper.mp4',
                },
              ],
            },
            {
              id: 'torwart-teil-3-fussballtechnik',
              title: 'Torwart Teil 3: Fussballtechnik',
              description:
                'Spezialisierte Torwartübungen für Jugendtorhüterinnen und -torhüter.',
              type: 'playlist',
              playlistTitle: 'Torwart Teil 3: Fussballtechnik',
              videoUrl:
                'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-3-fussballtechnik/teil-3-fussballtechnik-ballgewoehnung-dropkick-pass-flach.mp4',
              chapters: [
                {
                  id: 'teil-3-fussballtechnik-ballgewoehnung-dropkick-pass-flach',
                  title: 'Ballgewoehnung Dropkick Pass Flach',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-3-fussballtechnik/teil-3-fussballtechnik-ballgewoehnung-dropkick-pass-flach.mp4',
                },
                {
                  id: 'teil-3-fussballtechnik-ballgewoehnung-dropkick-pass-halbhoch',
                  title: 'Ballgewoehnung Dropkick Pass Halbhoch',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-3-fussballtechnik/teil-3-fussballtechnik-ballgewoehnung-dropkick-pass-halbhoch.mp4',
                },
                {
                  id: 'teil-3-fussballtechnik-ballgewoehnung-dropkick-flach-ueber-den-winkel',
                  title: 'Ballgewoehnung Dropkick Flach Ueber Den Winkel',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-3-fussballtechnik/teil-3-fussballtechnik-ballgewoehnung-dropkick-flach-ueber-den-winkel.mp4',
                },
                {
                  id: 'teil-3-fussballtechnik-ballgewoehnung-erster-kontakt',
                  title: 'Ballgewoehnung Erster Kontakt',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-3-fussballtechnik/teil-3-fussballtechnik-ballgewoehnung-erster-kontakt.mp4',
                },
                {
                  id: 'teil-3-fussballtechnik-ballgewoehnung-halbhohes-rueckspiel',
                  title: 'Ballgewoehnung Halbhohes Rueckspiel',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-3-fussballtechnik/teil-3-fussballtechnik-ballgewoehnung-halbhohes-rueckspiel.mp4',
                },
                {
                  id: 'teil-3-fussballtechnik-chipball',
                  title: 'Chipball',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-3-fussballtechnik/teil-3-fussballtechnik-chipball.mp4',
                },
                {
                  id: 'teil-3-fussballtechnik-chipball-kevin-trapp',
                  title: 'Chipball Kevin Trapp',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-3-fussballtechnik/teil-3-fussballtechnik-chipball-kevin-trapp.mp4',
                },
                {
                  id: 'teil-3-fussballtechnik-coaching-ballsicherheit-am-fuss-1',
                  title: 'Coaching Ballsicherheit Am Fuss 1',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-3-fussballtechnik/teil-3-fussballtechnik-coaching-ballsicherheit-am-fuss-1.mp4',
                },
                {
                  id: 'teil-3-fussballtechnik-coaching-ballsicherheit-am-fuss-2',
                  title: 'Coaching Ballsicherheit Am Fuss 2',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-3-fussballtechnik/teil-3-fussballtechnik-coaching-ballsicherheit-am-fuss-2.mp4',
                },
                {
                  id: 'teil-3-fussballtechnik-wahrnehmen-von-passoptionen',
                  title: 'Wahrnehmen Von Passoptionen',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-3-fussballtechnik/teil-3-fussballtechnik-wahrnehmen-von-passoptionen.mp4',
                },
              ],
            },
            {
              id: 'torwart-teil-4-grundtechniken-der-torhueterinnen',
              title: 'Torwart Teil 4: Grundtechniken Der Torhueterinnen',
              description:
                'Spezialisierte Torwartübungen für Jugendtorhüterinnen und -torhüter.',
              type: 'playlist',
              playlistTitle: 'Torwart Teil 4: Grundtechniken',
              videoUrl:
                'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-abkippen.mp4',
              chapters: [
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-abkippen',
                  title: 'Abkippen',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-abkippen.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-abkippen-oder-abdruck',
                  title: 'Abkippen Oder Abdruck',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-abkippen-oder-abdruck.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-abtauchen',
                  title: 'Abtauchen',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-abtauchen.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-abtauchen-mit-zeitdruck',
                  title: 'Abtauchen Mit Zeitdruck',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-abtauchen-mit-zeitdruck.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-abtauchen-und-fallen',
                  title: 'Abtauchen Und Fallen',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-abtauchen-und-fallen.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-aufnahme-flach-und-aufsetzer-zentral',
                  title: 'Aufnahme Flach Und Aufsetzer Zentral',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-aufnahme-flach-&-aufsetzer-zentral.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-coaching',
                  title: 'Coaching',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-coaching.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-coaching-stellungsspiel',
                  title: 'Coaching Stellungsspiel',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-coaching-stellungsspiel.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-coaching-zum-abtauchen-und-fallen',
                  title: 'Coaching Zum Abtauchen Und Fallen',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-coaching-zum-abtauchen-und-fallen.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-coaching-zur-korbtechnik',
                  title: 'Coaching Zur Korbtechnik',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-coaching-zur-korbtechnik.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-demo-trainingsform',
                  title: 'Demo Trainingsform',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-demo-trainingsform.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-eigentraining-voruebung-abdruck-aus-dem-stand',
                  title: 'Eigentraining Voruebung Abdruck Aus Dem Stand',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-eigentraining-voruebung-abdruck-aus-dem-stand.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-eigentraining-voruebung-abdruck-nach-kurzer-absetzbewegung',
                  title:
                    'Eigentraining Voruebung Abdruck Nach Kurzer Absetzbewegung',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-eigentraining-voruebung-abdruck-nach-kurzer-absetzbewegung.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-einbeinknie',
                  title: 'Einbeinknie',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-einbeinknie.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-erklaerung',
                  title: 'Erklaerung',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-erklaerung.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-fallen-mit-zeitdruck-und-absetzbewegung',
                  title: 'Fallen Mit Zeitdruck Und Absetzbewegung',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-fallen-mit-zeitdruck-und-absetzbewegung.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-fangen-halbhoch',
                  title: 'Fangen Halbhoch',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-fangen-halbhoch.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-fangen-mit-koordinativer-aufgabe',
                  title: 'Fangen Mit Koordinativer Aufgabe',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-fangen-mit-koordinativer-aufgabe.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-fangen-oben-drop-kick',
                  title: 'Fangen Oben Drop Kick',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-fangen-oben-drop-kick.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-fangen-oben-volley',
                  title: 'Fangen Oben Volley',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-fangen-oben-volley.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-fangen-oben-vom-boden',
                  title: 'Fangen Oben Vom Boden',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-fangen-oben-vom-boden.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-hauptuebung-abkippen-oder-abdruck',
                  title: 'Hauptuebung Abkippen Oder Abdruck',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-hauptuebung-abkippen-oder-abdruck.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-hauptuebung-abtauchen-und-fallen',
                  title: 'Hauptuebung Abtauchen Und Fallen',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-hauptuebung-abtauchen-und-fallen.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-korbtechnik',
                  title: 'Korbtechnik',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-korbtechnik.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-langsitz-mit-offenem-tor',
                  title: 'Langsitz Mit Offenem Tor',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-langsitz-mit-offenem-tor.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-seitsitz-flach-und-halbhoch',
                  title: 'Seitsitz Flach & Halbhoch',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-seitsitz-flach-&-halbhoch.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-seitsitz-flach',
                  title: 'Seitsitz Flach',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-seitsitz-flach.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-serie-von-links',
                  title: 'Serie Von Links',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-serie-von-links.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-trainingsgespraech-mit-kevin-trapp',
                  title: 'Trainingsgespraech Mit Kevin Trapp',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-trainingsgespraech-mit-kevin-trapp.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-voruebung-abdruck',
                  title: 'Voruebung Abdruck',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-voruebung-abdruck.mp4',
                },
                {
                  id: 'teil-4-grundtechniken-der-torhueterinnen-voruebung-abkippen',
                  title: 'Voruebung Abkippen',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/_torwart/Teil-4-grundtechniken-der-torhueterinnen/teil-4-grundtechniken-der-torhueterinnen-voruebung-abkippen.mp4',
                },
              ],
            },
          ],
        },
        {
          name: 'Nachwuchstraining',
          videos: [
            {
              id: 'nachwuchstraining-mehrere-felder',
              title: 'Nachwuchstraining - Mehrere Felder',
              type: 'playlist',
              playlistTitle: 'Nachwuchstraining - Mehrere Felder',
              videoUrl:
                'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Mehrere_Felder/Mehrere_Felder_-_2_%2B_1_vs_2_%2B_1_und_2_%2B_1_vs_3_und_2_vs_2.mp4',
              chapters: [
                {
                  id: 'mehrere-felder-2-plus-1-vs-2-plus-1-und-2-plus-1-vs-3-und-2-vs-2',
                  title:
                    'Mehrere Felder - 2 + 1 vs 2 + 1 und 2 + 1 vs 3 und 2 vs 2',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Mehrere_Felder/Mehrere_Felder_-_2_%2B_1_vs_2_%2B_1_und_2_%2B_1_vs_3_und_2_vs_2.mp4',
                },
                {
                  id: 'mehrere-felder-3-vs-3-plus-torhuter-auf-hybridfeldern',
                  title: 'Mehrere Felder - 3 vs 3 + Torhüter auf Hybridfeldern',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Mehrere_Felder/Mehrere_Felder_-_3_vs_3_%2B_Torhuter_auf_Hybridfeldern.mp4',
                },
                {
                  id: 'mehrere-felder-3-vs-3-mit-drehendem-angriffsrecht-und-dribbellinie-auf-vier-feldern',
                  title:
                    'Mehrere Felder - 3 vs 3 mit drehendem Angriffsrecht und Dribbellinie auf vier Feldern',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Mehrere_Felder/Mehrere_Felder_-_3_vs_3_mit_drehendem_Angriffsrecht_und_Dribbellinie_auf_vier_Feldern.mp4',
                },
                {
                  id: 'mehrere-felder-3-vs-3-und-2-vs-2-mit-passtoren',
                  title: 'Mehrere Felder - 3 vs 3 und 2 vs 2 mit Passtoren',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Mehrere_Felder/Mehrere_Felder_-_3_vs_3_und_2_vs_2_mit_Passtoren.mp4',
                },
                {
                  id: 'mehrere-felder-4-plus-2-vs-4-plus-2-im-sechseck-und-4-vs-4-mit-drehendem-angriffsrecht',
                  title:
                    'Mehrere Felder - 4 + 2 vs 4 + 2 im Sechseck und 4 vs 4 mit drehendem Angriffsrecht',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Mehrere_Felder/Mehrere_Felder_-_4_%2B_2_vs_4_%2B_2_im_Sechseck_und_4_vs_4_mit_drehendem_Angriffsrecht.mp4',
                },
                {
                  id: 'mehrere-felder-4-plus-2-vs-4-plus-2-im-sechseck-und-5-vs-5-mit-torhutern',
                  title:
                    'Mehrere Felder - 4 + 2 vs 4 + 2 im Sechseck und 5 vs 5 mit Torhütern',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Mehrere_Felder/Mehrere_Felder_-_4_%2B_2_vs_4_%2B_2_im_Sechseck_und_5_vs_5_mit_Torhutern.mp4',
                },
                {
                  id: 'mehrere-felder-4-vs-4-linie-bespielen-und-4-vs-4-plus-1-nur-direkte-tore-zahlen',
                  title:
                    'Mehrere Felder - 4 vs 4 Linie bespielen und 4 vs 4 + 1 nur direkte Tore zahlen',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Mehrere_Felder/Mehrere_Felder_-_4_vs_4_Linie_bespielen_und_4_vs_4_%2B_1_nur_direkte_Tore_zahlen.mp4',
                },
                {
                  id: 'trainingsphilosophie-deutschland-8-felder-7-aktiv',
                  title:
                    'Trainingsphilosophie Deutschland - 8 Felder - 7 aktiv',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Mehrere_Felder/Trainingsphilosophie_Deutschland_-_8_Felder_-_7_aktiv.mp4',
                },
              ],
            },
            {
              id: 'nachwuchstraining-uber-unterzahlspiele',
              title: 'Nachwuchstraining - Über-/Unterzahlspiele',
              type: 'playlist',
              playlistTitle: 'Nachwuchstraining - Über-/Unterzahlspiele',
              videoUrl:
                'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Uberzahl-_Unterzahlspiele/Uber_Unterzahlspiele_-_2_vs_2_mit_fliegdenen_Torhutern.mp4',
              chapters: [
                {
                  id: 'uber-unterzahlspiele-2-vs-2-mit-fliegenden-torhutern',
                  title:
                    'Über-/Unterzahlspiele - 2 vs 2 mit fliegenden Torhütern',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Uberzahl-_Unterzahlspiele/Uber_Unterzahlspiele_-_2_vs_2_mit_fliegdenen_Torhutern.mp4',
                },
                {
                  id: 'uber-unterzahlspiele-3-vs-3-mit-uberzahlspieler-auf-minifeld-mit-direktem-abschluss',
                  title:
                    'Über-/Unterzahlspiele - 3 vs 3 mit Überzahlspieler auf Minifeld mit direktem Abschluss',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Uberzahl-_Unterzahlspiele/Uber_Unterzahlspiele_-_3_vs_3_mit_Uberzahlspieler_auf_Minifeld_mit_direktem_Abschluss.mp4',
                },
                {
                  id: 'uber-unterzahlspiele-4-vs-4-plus-uberzahlspieler-mit-direkten-abschlussen',
                  title:
                    'Über-/Unterzahlspiele - 4 vs 4 + Überzahlspieler mit direkten Abschlüssen',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Uberzahl-_Unterzahlspiele/Uber_Unterzahlspiele_-_4_vs_4_%2B_Uberzahlspieler_mit_direkten_Abschlussen.mp4',
                },
                {
                  id: 'uber-unterzahlspiele-4-vs-4-mit-2-uberzahlspielern-und-direktem-abschluss',
                  title:
                    'Über-/Unterzahlspiele - 4 vs 4 mit 2 Überzahlspielern und direktem Abschluss',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Uberzahl-_Unterzahlspiele/Uber_Unterzahlspiele_-_4_vs_4_mit_2_Uberzahlspielern_und_direktem_Abschluss.mp4',
                },
                {
                  id: 'uber-unterzahlspiele-4-vs-4-mit-uberzahlspieler-und-kontaktvorgabe',
                  title:
                    'Über-/Unterzahlspiele - 4 vs 4 mit Überzahlspieler und Kontaktvorgabe',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Uberzahl-_Unterzahlspiele/Uber_Unterzahlspiele_-_4_vs_4_mit_Uberzahlspieler_und_Kontaktvorgabe.mp4',
                },
              ],
            },
            {
              id: 'nachwuchstraining-linie-bespielen-verteidigen',
              title: 'Nachwuchstraining - Linie bespielen/verteidigen',
              type: 'playlist',
              playlistTitle: 'Nachwuchstraining - Linie bespielen/verteidigen',
              videoUrl:
                'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Linie_bespielen_verteidigen/Linie_bespielen_-_3_vs_3_auf_Minifeld.mp4',
              chapters: [
                {
                  id: 'linie-bespielen-3-vs-3-auf-minifeld',
                  title: 'Linie bespielen - 3 vs 3 auf Minifeld',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Linie_bespielen_verteidigen/Linie_bespielen_-_3_vs_3_auf_Minifeld.mp4',
                },
                {
                  id: 'linie-bespielen-4-plus-1-vs-4-plus-1-auf-linie',
                  title: 'Linie bespielen - 4 + 1 vs 4 + 1 auf Linie',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Linie_bespielen_verteidigen/Linie_bespielen_-_4_+_1_vs_4_+_1_auf_Linie.mp4',
                },
                {
                  id: 'linie-bespielen-4-vs-4-mit-torhutern-variante-1',
                  title: 'Linie bespielen - 4 vs 4 mit Torhütern Variante 1',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Linie_bespielen_verteidigen/Linie_bespielen_-_4_vs_4_mit_Torhutern_Variante_1.mp4',
                },
                {
                  id: 'linie-bespielen-4-vs-4-mit-torhutern-variante-2',
                  title: 'Linie bespielen - 4 vs 4 mit Torhütern Variante 2',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Linie_bespielen_verteidigen/Linie_bespielen_-_4_vs_4_mit_Torhutern_Variante_2.mp4',
                },
                {
                  id: 'linie-bespielen-4-vs-4-mit-torhutern-auf-engem-raum',
                  title:
                    'Linie bespielen - 4 vs 4 mit Torhütern auf engem Raum',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Linie_bespielen_verteidigen/Linie_bespielen_-_4_vs_4_mit_Torhutern_auf_engem_Raum.mp4',
                },
                {
                  id: 'linie-bespielen-verteidigen-bei-4-plus-tw-vs-4',
                  title: 'Linie bespielen - verteidigen bei 4 + TW vs. 4',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Linie_bespielen_verteidigen/Linie_bespielen_-_verteidigen_bei_4_+_TW_vs._4.mp4',
                },
                {
                  id: 'mehrere-felder-4-vs-4-linie-bespielen-und-4-vs-4-plus-1-nur-direkte-tore-zahlen-kombi',
                  title:
                    'Mehrere Felder - 4 vs 4 Linie bespielen und 4 vs 4 + 1 nur direkte Tore zählen',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Linie_bespielen_verteidigen/Mehrere_Felder_-_4_vs_4_Linie_bespielen_und_4_vs_4_+_1_nur_direkte_Tore_zahlen.mp4',
                },
              ],
            },
            {
              id: 'nachwuchstraining-gleichzahlspiele-mit-anspielern',
              title: 'Nachwuchstraining - Gleichzahlspiele mit Anspielern',
              type: 'playlist',
              playlistTitle:
                'Nachwuchstraining - Gleichzahlspiele mit Anspielern',
              videoUrl:
                'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele_mit_Anspielern/Gleichzahl_-_nur_nach_vorne_passen_tiefe_Anspieler_bei_3_%2B_TW_vs._3.mp4',
              chapters: [
                {
                  id: 'gleichzahl-nur-nach-vorne-passen-tiefe-anspieler-bei-3-plus-tw-vs-3',
                  title:
                    'Gleichzahl - nur nach vorne passen tiefe Anspieler bei 3 + TW vs. 3',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele_mit_Anspielern/Gleichzahl_-_nur_nach_vorne_passen_tiefe_Anspieler_bei_3_%2B_TW_vs._3.mp4',
                },
                {
                  id: 'gleichzahl-mit-anspieler-3-plus-tw-vs-3-mit-drehendem-angriffsrecht',
                  title:
                    'Gleichzahl mit Anspieler - 3 + TW vs. 3 mit drehendem Angriffsrecht',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele_mit_Anspielern/Gleichzahl_mit_Anspieler_-_3_%2B_TW_vs._3_mit_drehendem_Angriffsrecht.mp4',
                },
                {
                  id: 'gleichzahlspiele-3-vs-3-mit-anspieler-torhuter-zentrumslinie-und-drehendem-angriffsrecht',
                  title:
                    'Gleichzahlspiele - 3 vs 3 mit Anspieler Torhüter Zentrumslinie und drehendem Angriffsrecht',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele_mit_Anspielern/Gleichzahlspiele_-_3_vs_3_mit_Anspieler_Torhuter_Zentrumslinie_und_drehendem_Angriffsrecht.mp4',
                },
                {
                  id: 'gleichzahlspiele-3-vs-3-plus-2-tiefe-anspieler-im-minifeld',
                  title:
                    'Gleichzahlspiele - 3 vs 3 plus 2 tiefe Anspieler im Minifeld',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele_mit_Anspielern/Gleichzahlspiele_-_3_vs_3_plus_2_tiefe_Anspieler_im_Minifeld.mp4',
                },
                {
                  id: 'gleichzahlspiele-3-vs-3-plus-3-anspieler-mit-drehendem-angriffsrecht',
                  title:
                    'Gleichzahlspiele - 3 vs 3 plus 3 Anspieler mit drehendem Angriffsrecht',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele_mit_Anspielern/Gleichzahlspiele_-_3_vs_3_plus_3_Anspieler_mit_drehendem_Angriffsrecht.mp4',
                },
                {
                  id: 'gleichzahlspiele-3-vs-3-plus-4-anspieler-und-torhuter-im-sechseck',
                  title:
                    'Gleichzahlspiele - 3 vs 3 plus 4 Anspieler und Torhüter im Sechseck',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele_mit_Anspielern/Gleichzahlspiele_-_3_vs_3_plus_4_Anspieler_und_Torhuter_im_Sechseck.mp4',
                },
                {
                  id: 'gleichzahlspiele-3-vs-3-plus-anspieler-torhuter-und-drehendem-angriffsrecht',
                  title:
                    'Gleichzahlspiele - 3 vs 3 plus Anspieler Torhüter und drehendem Angriffsrecht',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele_mit_Anspielern/Gleichzahlspiele_-_3_vs_3_plus_Anspieler_Torhuter_und_drehendem_Angriffsrecht.mp4',
                },
                {
                  id: 'gleichzahlspiele-4-vs-4-flankenspiel-plus-4-anspieler-und-torhuter',
                  title:
                    'Gleichzahlspiele - 4 vs 4 Flankenspiel plus 4 Anspieler und Torhüter',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele_mit_Anspielern/Gleichzahlspiele_-_4_vs_4_Flankenspiel_plus_4_Anspieler_und_Torhuter.mp4',
                },
                {
                  id: 'gleichzahlspiele-4-vs-4-plus-2-anspieler-seitlich',
                  title: 'Gleichzahlspiele - 4 vs 4 plus 2 Anspieler seitlich',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele_mit_Anspielern/Gleichzahlspiele_-_4_vs_4_plus_2_Anspieler_seitlich.mp4',
                },
                {
                  id: 'gleichzahlspiele-4-vs-4-plus-4-anspieler-neben-dem-tor-im-sechseck',
                  title:
                    'Gleichzahlspiele - 4 vs 4 plus 4 Anspieler neben dem Tor im Sechseck',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele_mit_Anspielern/Gleichzahlspiele_-_4_vs_4_plus_4_Anspieler_neben_dem_Tor_im_Sechseck.mp4',
                },
              ],
            },
            {
              id: 'nachwuchstraining-gleichzahlspiele',
              title: 'Nachwuchstraining - Gleichzahlspiele',
              type: 'playlist',
              playlistTitle: 'Nachwuchstraining - Gleichzahlspiele',
              videoUrl:
                'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele/Gleichzahl_-_nur_nach_vorne_passen_tiefe_Anspieler_bei_3_%2B_TW_vs._3.mp4',
              chapters: [
                {
                  id: 'gleichzahl-nur-nach-vorne-passen-tiefe-anspieler-bei-3-plus-tw-vs-3',
                  title:
                    'Gleichzahl - nur nach vorne passen tiefe Anspieler bei 3 + TW vs. 3',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele/Gleichzahl_-_nur_nach_vorne_passen_tiefe_Anspieler_bei_3_%2B_TW_vs._3.mp4',
                },
                {
                  id: 'gleichzahl-mit-anspieler-3-plus-tw-vs-3-mit-drehendem-angriffsrecht',
                  title:
                    'Gleichzahl mit Anspieler - 3 + TW vs. 3 mit drehendem Angriffsrecht',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele/Gleichzahl_mit_Anspieler_-_3_%2B_TW_vs._3_mit_drehendem_Angriffsrecht.mp4',
                },
                {
                  id: 'gleichzahlspiele-2-vs-2-mit-8s-zeit',
                  title: 'Gleichzahlspiele - 2 vs 2 mit 8s Zeit',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele/Gleichzahlspiele_-_2_vs_2_mit_8s_Zeit.mp4',
                },
                {
                  id: 'gleichzahlspiele-3-plus-1-vs-3-auf-hybridfeld',
                  title: 'Gleichzahlspiele - 3 + 1 vs 3 auf Hybridfeld',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele/Gleichzahlspiele_-_3_%2B_1_vs_3_auf_Hybridfeld.mp4',
                },
                {
                  id: 'gleichzahlspiele-3-vs-3-auf-minispielfeld-mit-shotclock',
                  title:
                    'Gleichzahlspiele - 3 vs 3 auf Minispielfeld mit Shotclock',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele/Gleichzahlspiele_-_3_vs_3_auf_Minispielfeld_mit_Shotclock.mp4',
                },
                {
                  id: 'gleichzahlspiele-3-vs-3-mit-dribbellinie-und-drehendem-angriffsrecht',
                  title:
                    'Gleichzahlspiele - 3 vs 3 mit Dribbellinie und drehendem Angriffsrecht',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele/Gleichzahlspiele_-_3_vs_3_mit_Dribbellinie_und_drehendem_Angriffsrecht.mp4',
                },
                {
                  id: 'gleichzahlspiele-4-plus-tw-vs-4-mit-drehendem-angriffsrecht',
                  title:
                    'Gleichzahlspiele - 4 + TW vs. 4 mit drehendem Angriffsrecht',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele/Gleichzahlspiele_-_4_%2B_TW_vs._4_mit_drehendem_Angriffsrecht.mp4',
                },
                {
                  id: 'gleichzahlspiele-4-plus-torwart-vs-4-plus-torwart',
                  title: 'Gleichzahlspiele - 4 + Torwart vs 4 + Torwart',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele/Gleichzahlspiele_-_4_%2B_Torwart_vs_4_%2B_Torwart.mp4',
                },
                {
                  id: 'gleichzahlspiele-4-vs-4-mit-torhuter-und-flanken',
                  title: 'Gleichzahlspiele - 4 vs 4 mit Torhüter und Flanken',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele/Gleichzahlspiele_-_4_vs_4_mit_Torhuter_und_Flanken.mp4',
                },
                {
                  id: 'gleichzahlspiele-start-flanke-bei-4-plus-tw-vs-4',
                  title: 'Gleichzahlspiele - Start Flanke bei 4 + TW vs. 4',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele/Gleichzahlspiele_-_Start_Flanke_bei_4_%2B_TW_vs._4.mp4',
                },
                {
                  id: 'gleichzahlspiele-start-flanke-schnell-bei-4-plus-tw-vs-4',
                  title:
                    'Gleichzahlspiele - Start Flanke schnell bei 4 + TW vs. 4',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele/Gleichzahlspiele_-_Start_Flanke_schnell_bei_4_%2B_TW_vs._4.mp4',
                },
                {
                  id: 'gleichzahlspiele-start-flugball-beim-4-plus-tw-vs-4',
                  title: 'Gleichzahlspiele - Start Flugball beim 4 + TW vs. 4',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele/Gleichzahlspiele_-_Start_Flugball_beim_4_%2B_TW_vs._4.mp4',
                },
                {
                  id: 'gleichzahlspiele-nur-nach-vorne-passen-bei-4-plus-tw-vs-4',
                  title:
                    'Gleichzahlspiele - nur nach vorne passen bei 4 + TW vs. 4',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele/Gleichzahlspiele_-_nur_nach_vorne_passen_bei_4_%2B_TW_vs._4.mp4',
                },
                {
                  id: 'gleichzahlspiele-vom-2-vs-2-plus-torhuter-zum-4-vs-4-plus-torhuter',
                  title:
                    'Gleichzahlspiele - vom 2 vs 2 + Torhüter zum 4 vs 4 + Torhüter',
                  videoUrl:
                    'https://pub-deed098848fd4b7ea64955bcfb956394.r2.dev/video/Nachwuchstraining/Nachwuchstraining_-_Gleichzahlspiele/Gleichzahlspiele_-_vom_2_vs_2_%2B_Torhuter_zum_4_vs_4_%2B_Torhuter.mp4',
                },
              ],
            },
          ],
        },
        {
          name: 'Ball Control & Dribbling',
          videos: [
            {
              id: '10-ball-control',
              title: '10 Ball Control',
              description: 'Simple ball control exercises to improve touch',
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
                  id: 'la-croqueta-dribble',
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
              ],
            },
          ],
        },
        {
          name: 'Ball Mastery',
          videos: [
            {
              id: '5-ball-mastery',
              title: '5 Ball Mastery',
              description: 'Five ball mastery combinations',
              type: 'chapters',
              videoUrl:
                'https://data-h03.fra1.cdn.digitaloceanspaces.com/ballkontrolle.mp4',
              playlistTitle: '5 Ball Mastery',
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
                {
                  id: 'v-cuts-mastery',
                  title: 'V-Cuts',
                  startTime: 471,
                  endTime: 531,
                },
              ],
            },
            {
              id: '5-v-cut-skills',
              title: '5 V-Cut Skills',
              description: 'Five V-Cut ball mastery skills',
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
          ],
        },
        {
          name: 'Skills',
          videos: [
            {
              id: 'chop',
              title: 'Chop',
              description: 'Easy chop skills to beat defenders',
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
          ],
        },
        {
          name: 'Flexibility & Recovery',
          videos: [
            {
              id: '24-yoga-stretches',
              title: '24 Yoga Stretches',
              description:
                'Full deep stretch and yoga routine for soccer players',
              type: 'chapters',
              videoUrl:
                "https://data-h03.fra1.cdn.digitaloceanspaces.com/7mlc/stretch/Pro_Footballer's_Full_Deep_Stretch_and_Yoga_Routine_-_30_Minute_Yoga_for_Soccer_Players_faststart.mp4",
              playlistTitle: '24 Yoga Stretches',
              chapters: [
                {
                  id: 'toe-stretch',
                  title: 'Toe Stretch',
                  startTime: 69,
                  endTime: 130,
                },
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
            {
              id: 'mobility-tests',
              title: 'Mobility Tests',
              description:
                'Six essential mobility tests to assess flexibility and range of motion',
              type: 'playlist',
              playlistTitle: 'Mobility Tests',
              chapters: [
                {
                  id: 'test1-sit-on-heels',
                  title: 'Test 1: Can you sit on your heels?',
                  videoUrl:
                    'https://video-idea.fra1.cdn.digitaloceanspaces.com/mobility-tests/Test1_SitOnHeels.mp4',
                  duration: 77,
                },
                {
                  id: 'test1-sit-on-heels-advanced',
                  title: 'Test 1 Advanced: Sit on heels advanced version',
                  videoUrl:
                    'https://video-idea.fra1.cdn.digitaloceanspaces.com/mobility-tests/Test1_SitOnHeels_Advanced.mp4',
                  duration: 35,
                },
                {
                  id: 'test2-squat-deep',
                  title: 'Test 2: Can you squat deep?',
                  videoUrl:
                    'https://video-idea.fra1.cdn.digitaloceanspaces.com/mobility-tests/Test2_SquatDeep.mp4',
                  duration: 74,
                },
                {
                  id: 'test2-squat-deep-advanced',
                  title: 'Test 2 Advanced: Deep squat advanced version',
                  videoUrl:
                    'https://video-idea.fra1.cdn.digitaloceanspaces.com/mobility-tests/Test2_SquatDeep_Advanced.mp4',
                  duration: 27,
                },
                {
                  id: 'test3-touch-toes',
                  title: 'Test 3: Can you touch your toes?',
                  videoUrl:
                    'https://video-idea.fra1.cdn.digitaloceanspaces.com/mobility-tests/Test3_TouchToes.mp4',
                  duration: 71,
                },
                {
                  id: 'test3-touch-toes-advanced',
                  title: 'Test 3 Advanced: Touch toes advanced version',
                  videoUrl:
                    'https://video-idea.fra1.cdn.digitaloceanspaces.com/mobility-tests/Test3_TouchToes_Advanced.mp4',
                  duration: 11,
                },
                {
                  id: 'test4-apley-scratch',
                  title: 'Test 4: The Apley Scratch Test',
                  videoUrl:
                    'https://video-idea.fra1.cdn.digitaloceanspaces.com/mobility-tests/Test4_ApleyScratch.mp4',
                  duration: 62,
                },
                {
                  id: 'test4-apley-scratch-advanced',
                  title: 'Test 4 Advanced: Apley Scratch advanced version',
                  videoUrl:
                    'https://video-idea.fra1.cdn.digitaloceanspaces.com/mobility-tests/Test4_ApleyScratch_Advanced.mp4',
                  duration: 12,
                },
                {
                  id: 'test5-wall-shoulder-flexion',
                  title: 'Test 5: The Wall Shoulder Flexion Test',
                  videoUrl:
                    'https://video-idea.fra1.cdn.digitaloceanspaces.com/mobility-tests/Test5_WallShoulderFlexion.mp4',
                  duration: 42,
                },
                {
                  id: 'test5-wall-shoulder-flexion-advanced',
                  title:
                    'Test 5 Advanced: Wall Shoulder Flexion advanced version',
                  videoUrl:
                    'https://video-idea.fra1.cdn.digitaloceanspaces.com/mobility-tests/Test5_WallShoulderFlexion_Advanced.mp4',
                  duration: 14,
                },
                {
                  id: 'test6-thoracic-rotation',
                  title: 'Test 6: The Thoracic Rotation Test',
                  videoUrl:
                    'https://video-idea.fra1.cdn.digitaloceanspaces.com/mobility-tests/Test6_ThoracicRotation.mp4',
                  duration: 55,
                },
                {
                  id: 'test6-thoracic-rotation-advanced',
                  title: 'Test 6 Advanced: Thoracic Rotation advanced version',
                  videoUrl:
                    'https://video-idea.fra1.cdn.digitaloceanspaces.com/mobility-tests/Test6_ThoracicRotation_Advanced.mp4',
                  duration: 10,
                },
              ],
            },
          ],
        },
        {
          name: 'Passing & First Touch',
          videos: [
            {
              id: '5-passing-drills',
              title: '5 Passing Drills',
              description:
                'Five passing drills with combinations and first touch',
              type: 'chapters',
              videoUrl:
                'https://data-h03.fra1.cdn.digitaloceanspaces.com/Passing.mp4',
              playlistTitle: '5 Passing Drills',
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
              description:
                'Individual first touch drills against a rebound wall',
              type: 'playlist',
              playlistTitle: 'Prellwand-1',
              chapters: [
                {
                  id: 'inside-outside-touch',
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
            {
              id: 'passing-patterns',
              title: 'Passing Patterns',
              description:
                'Five passing pattern drills for team coordination and movement',
              type: 'playlist',
              playlistTitle: 'Passing Patterns',
              chapters: [
                {
                  id: 'pattern-one',
                  title: 'Pattern One',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759397064/trainings-video/Fussball/Passing_First_Touch/clips/01_PATTERN_ONE.mp4',
                },
                {
                  id: 'pattern-two',
                  title: 'Pattern Two',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759397070/trainings-video/Fussball/Passing_First_Touch/clips/02_PATTERN_TWO.mp4',
                },
                {
                  id: 'pattern-three',
                  title: 'Pattern Three',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759397078/trainings-video/Fussball/Passing_First_Touch/clips/03_PATTERN_THREE.mp4',
                },
                {
                  id: 'pattern-four',
                  title: 'Pattern Four',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759397086/trainings-video/Fussball/Passing_First_Touch/clips/04_PATTERN_FOUR.mp4',
                },
                {
                  id: 'pattern-five',
                  title: 'Pattern Five',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759397094/trainings-video/Fussball/Passing_First_Touch/clips/05_PATTERN_FIVE.mp4',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Athletik',
      subcategories: [
        {
          name: 'Agility & Speed',
          videos: [
            {
              id: 'agility-drills',
              title: 'Agility Drills',
              description: 'A collection of 15 agility drills.',
              type: 'playlist',
              playlistTitle: 'Agility Drills',
              chapters: [
                {
                  id: 'two-foot-forwards',
                  title: 'Two Foot Forwards',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759873141/agility-drills/01_two-foot-forwards.mp4',
                },
                {
                  id: 'two-foot-sideways',
                  title: 'Two Foot Sideways',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759873143/agility-drills/02_two-foot-sideways.mp4',
                },
                {
                  id: 'icky-shuffle',
                  title: 'Icky Shuffle',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759873146/agility-drills/03_icky-shuffle.mp4',
                },
                {
                  id: 'backwards-icky-shuffle',
                  title: 'Backwards Icky Shuffle',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759873150/agility-drills/04_backwards-icky-shuffle.mp4',
                },
                {
                  id: 'in-and-out',
                  title: 'In & Out',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759873153/agility-drills/05_in-and-out.mp4',
                },
                {
                  id: 'sl-in-and-out',
                  title: 'SL In & Out',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759873158/agility-drills/06_sl-in-and-out.mp4',
                },
                {
                  id: 'lateral-in-and-out',
                  title: 'Lateral In & Out',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759873162/agility-drills/07_lateral-in-and-out.mp4',
                },
                {
                  id: 'crossover',
                  title: 'Crossover',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759873164/agility-drills/08_crossover.mp4',
                },
                {
                  id: 'foot-exchange',
                  title: 'Foot Exchange',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759873167/agility-drills/09_foot-exchange.mp4',
                },
                {
                  id: 'reverse-crossover',
                  title: 'Reverse Crossover',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759873171/agility-drills/10_reverse-crossover.mp4',
                },
                {
                  id: 'hip-twist',
                  title: 'Hip Twist',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759873176/agility-drills/11_hip-twist.mp4',
                },
                {
                  id: 'carioca',
                  title: 'Carioca',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759873179/agility-drills/12_carioca.mp4',
                },
                {
                  id: 'two-footed-hop',
                  title: 'Two Footed Hop',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759873182/agility-drills/13_two-footed-hop.mp4',
                },
                {
                  id: 'one-footed-hop',
                  title: 'One Footed Hop',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759873185/agility-drills/14_one-footed-hop.mp4',
                },
                {
                  id: 'two-forward-one-back',
                  title: 'Two Forward One Back',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759873189/agility-drills/15_two-forward-one-back.mp4',
                },
              ],
            },
            {
              id: '15-footwork-exercises',
              title: '15 Footwork Exercises',
              description:
                'Increase Your Foot Speed Coordination With These Fast Feet Drills',
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
              type: 'chapters',
              videoUrl:
                'https://data-h03.fra1.digitaloceanspaces.com/10-Fast-Feet.mp4',
              playlistTitle: '10 Ladder Drills',
              chapters: [
                {
                  id: 'hopscotch',
                  title: 'Hopscotch',
                  startTime: 87,
                  endTime: 125,
                },
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
            {
              id: '10-fast-feet',
              title: '10 Fast Feet',
              description:
                'Ten fast feet drills to increase foot speed and coordination',
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
            {
              id: '20-football-feet',
              title: '20 Football Feet',
              description: 'Twenty fast feet variations for footballers',
              type: 'chapters',
              videoUrl:
                'https://data-h03.fra1.cdn.digitaloceanspaces.com/20-fast-feet.mp4',
              playlistTitle: '20 Football Feet',
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
                {
                  id: 'side-to-side',
                  title: 'Side to Side',
                  startTime: 49,
                  endTime: 64,
                },
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
                {
                  id: 'crossover',
                  title: 'Crossover',
                  startTime: 129,
                  endTime: 151,
                },
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
                {
                  id: 'in-out',
                  title: 'In - Out',
                  startTime: 249,
                  endTime: 273,
                },
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
                {
                  id: 'hop-scotch',
                  title: 'Hop Scotch',
                  startTime: 388,
                  endTime: 415,
                },
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
          ],
        },
      ],
    },
    {
      name: 'Sprint',
      subcategories: [
        {
          name: 'Acceleration',
          videos: [
            {
              id: 'acceleration-drills',
              title: 'Acceleration Drills',
              description:
                'Eighteen essential acceleration drills to improve sprint starts, explosive power, and first-step quickness',
              type: 'playlist',
              playlistTitle: 'Acceleration Drills',
              chapters: [
                {
                  id: 'wall-drills',
                  title: '01 Wall Drills',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759516442/01_Wall_Drills_stifji.mp4',
                },
                {
                  id: 'half-kneeling-sprint-start',
                  title: '02 Half-Kneeling Sprint Start',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759516441/02_Half-Kneeling_Sprint_Start_shwfx1.mp4',
                },
                {
                  id: 'single-leg-broad-jumps',
                  title: '03 Single Leg Broad Jumps',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759516415/03_Single_Leg_Broad_Jumps_dnicbk.mp4',
                },
                {
                  id: 'single-leg-hop-back-to-broad-jump',
                  title: '04 Single Leg Hop Back to Broad Jump',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759516421/04_Single_Leg_Hop_Back_to_Broad_Jump_w2wvzi.mp4',
                },
                {
                  id: 'bounds',
                  title: '05 Bounds',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759516433/05_Bounds_suuics.mp4',
                },
                {
                  id: 'broad-jump-to-single-leg-bounds',
                  title: '06 Broad Jump to Single Leg Bounds',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759516427/06_Broad_Jump_to_Single_Leg_Bounds_ccngpb.mp4',
                },
                {
                  id: 'depth-jumps',
                  title: '07 Depth Jumps',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759516435/07_Depth_Jumps_tyrdfm.mp4',
                },
                {
                  id: 'forward-ankle-jumps',
                  title: '08 Forward Ankle Jumps',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759516432/08_Forward_Ankle_Jumps_ilgniq.mp4',
                },
                {
                  id: 'lateral-jump-to-broad-jump',
                  title: '09 Lateral Jump to Broad Jump',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759516430/09_Lateral_Jump_to_Broad_Jump_joywjb.mp4',
                },
                {
                  id: 'single-leg-line-hops',
                  title: '10 Single Leg Line Hops',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759516434/10_Single_Leg_Line_Hops_i9o2se.mp4',
                },
                {
                  id: 'resisted-sprints-hops',
                  title: '11 Resisted Sprints & Hops',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759516440/11_Resisted_Sprints_Hops_jh28yk.mp4',
                },
                {
                  id: 'resisted-horizontal-high-knees',
                  title: '12 Resisted Horizontal High Knees',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759516423/12_Resisted_Horizontal_High_Knees_dhiahy.mp4',
                },
                {
                  id: 'resisted-broad-jumps',
                  title: '13 Resisted Broad Jumps',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759516412/13_Resisted_Broad_Jumps_gyfgij.mp4',
                },
                {
                  id: 'kettlebell-ankle-mobility',
                  title: '14 Kettlebell Ankle Mobility',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759516417/14_Kettlebell_Ankle_Mobility_nxkscr.mp4',
                },
                {
                  id: 'single-leg-plate-jumps',
                  title: '15 Single Leg Plate Jumps',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759516417/15_Single_Leg_Plate_Jumps_arh4k7.mp4',
                },
                {
                  id: 'single-leg-calf-machine-hops',
                  title: '16 Single Leg Calf Machine Hops',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759516423/16_Single_Leg_Calf_Machine_Hops_vdpxxw.mp4',
                },
                {
                  id: 'bent-knee-calf-raise',
                  title: '17 Bent Knee Calf Raise',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759516416/17_Bent_Knee_Calf_Raise_ukss3a.mp4',
                },
                {
                  id: 'heels-up-squat',
                  title: '18 Heels-Up Squat',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759516415/18_Heels-Up_Squat_jkmrxn.mp4',
                },
              ],
            },
          ],
        },
        {
          name: 'Drills',
          videos: [
            {
              id: 'sprint-drills',
              title: 'Sprint Drills',
              description:
                'Eleven essential sprint drills to improve acceleration, top speed, and running mechanics',
              type: 'playlist',
              playlistTitle: 'Sprint Drills',
              chapters: [
                {
                  id: 'walking-high-knees',
                  title: 'Walking High Knees',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759395562/01_WALKING_HIGH_KNEES_r7gpak.mp4',
                },
                {
                  id: 'a-skip',
                  title: 'A-Skip',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759395553/02_A-SKIP_hqmw0f.mp4',
                },
                {
                  id: 'b-skip',
                  title: 'B-Skip',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759395561/03_B-SKIP_mc1yra.mp4',
                },
                {
                  id: 'c-skip',
                  title: 'C-Skip',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759395562/04_C-SKIP_fln2ag.mp4',
                },
                {
                  id: 'high-knees',
                  title: 'High Knees',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759395558/05_HIGH_KNEES_hiromc.mp4',
                },
                {
                  id: 'karaoke',
                  title: 'Karaoke',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759395553/06_KARAOKE_tz01aa.mp4',
                },
                {
                  id: 'fast-legs',
                  title: 'Fast Legs',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759395577/07_FAST_LEGS_smq8gt.mp4',
                },
                {
                  id: 'alternating-fast-legs',
                  title: 'Alternating Fast Legs',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759395548/08_ALTERNATING_FAST_LEGS_dv6mcr.mp4',
                },
                {
                  id: 'double-alternating-fast-legs',
                  title: 'Double Alternating Fast Legs',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759395551/09_DOUBLE_ALTERNATING_FAST_LEGS_i5hsxn.mp4',
                },
                {
                  id: 'stick-it-drill',
                  title: 'Stick It Drill',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759395568/10_STICK_IT_DRILL_ejqfed.mp4',
                },
                {
                  id: '1-2-3-drill',
                  title: '1-2-3 Drill',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759395544/11_1_2_3_DRILL_esduxj.mp4',
                },
              ],
            },
          ],
        },
        {
          name: 'Speed Training',
          videos: [
            {
              id: 'speed-training-drills',
              title: 'Speed Training Drills',
              description:
                'Ten essential speed training drills to improve acceleration, explosiveness, and power',
              type: 'playlist',
              playlistTitle: 'Speed Training Drills',
              chapters: [
                {
                  id: 'pogo-jumps',
                  title: 'Pogo Jumps',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759398301/trainings-video/Sprint/Speed_Training/clips/01_POGO_JUMPS.mp4',
                },
                {
                  id: 'jump-squats',
                  title: 'Jump Squats',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759398307/trainings-video/Sprint/Speed_Training/clips/02_JUMP_SQUATS.mp4',
                },
                {
                  id: 'a-skips',
                  title: 'A-Skips',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759398312/trainings-video/Sprint/Speed_Training/clips/03_A_SKIPS.mp4',
                },
                {
                  id: 'lateral-a-skips',
                  title: 'Lateral A-Skips',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759398318/trainings-video/Sprint/Speed_Training/clips/04_LATERAL_A_SKIPS.mp4',
                },
                {
                  id: 'kneeling-knee-drives',
                  title: 'Kneeling Knee Drives',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759398323/trainings-video/Sprint/Speed_Training/clips/05_KNEELING_KNEE_DRIVES.mp4',
                },
                {
                  id: 'lateral-bounds',
                  title: 'Lateral Bounds',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759398329/trainings-video/Sprint/Speed_Training/clips/06_LATERAL_BOUNDS.mp4',
                },
                {
                  id: 'high-knees-speed',
                  title: 'High Knees',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759398334/trainings-video/Sprint/Speed_Training/clips/07_HIGH_KNEES.mp4',
                },
                {
                  id: 'broad-jumps',
                  title: 'Broad Jumps',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759398339/trainings-video/Sprint/Speed_Training/clips/08_BROAD_JUMPS.mp4',
                },
                {
                  id: 'jump-lunges',
                  title: 'Jump Lunges',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759398345/trainings-video/Sprint/Speed_Training/clips/09_JUMP_LUNGES.mp4',
                },
                {
                  id: '30m-sprints',
                  title: '30m Sprints',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759397953/trainings-video/Sprint/Speed_Training/clips/10_30M_SPRINTS.mp4',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Routines',
      subcategories: [
        {
          name: 'Core',
          videos: [
            {
              id: 'core-drills',
              title: 'Core Drills',
              description: 'Essential core strengthening exercises',
              type: 'playlist',
              playlistTitle: 'Core Drills',
              chapters: [
                {
                  id: 'low-plank-hold',
                  title: '01 Low Plank Hold',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759515706/01_Low_Plank_Hold_chzrfb.mp4',
                },
                {
                  id: 'v-sit',
                  title: '02 V Sit',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759515718/02_V_Sit_hvlowu.mp4',
                },
                {
                  id: 'bicycle-crunches',
                  title: '03 Bicycle Crunches',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759515708/03_Bicycle_Crunches_qndppc.mp4',
                },
                {
                  id: 'side-plank',
                  title: '04 Side Plank',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759515707/04_Side_Plank_grij0p.mp4',
                },
                {
                  id: 'glute-bridges',
                  title: '05 Glute Bridges',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759515713/05_Glute_Bridges_iksr6t.mp4',
                },
                {
                  id: 'leg-raises',
                  title: '06 Leg Raises',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759515720/06_Leg_Raises_ghtxd2.mp4',
                },
                {
                  id: 'pushups',
                  title: '07 Pushups',
                  videoUrl:
                    'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759515727/07_Pushups_ogejxg.mp4',
                },
              ],
            },
          ],
        },
        {
          name: 'FIFA 11+',
          videos: [
            {
              id: 'fifa-11-plus-original',
              title: 'FIFA 11+ Original Programm',
              description:
                'Das komplette FIFA 11+ Verletzungspräventionsprogramm mit Laufen, Kraft, Plyometrie und Gleichgewichtsübungen.',
              type: 'chapters',
              videoUrl: 'https://data-h03.fra1.cdn.digitaloceanspaces.com/FIFA',
              playlistTitle: 'FIFA 11+ Original',
              chapters: [
                {
                  id: 'fifa11-header-part-1',
                  title: 'Teil 1: Laufübungen',
                  startTime: 0,
                },
                {
                  id: 'fifa11-20',
                  title: '1. Geradeaus',
                  description: '2 Mal durchführen.',
                  startTime: 20,
                },
                {
                  id: 'fifa11-39',
                  title: '2. Hüftdrehung nach aussen',
                  description: '2 Mal durchführen.',
                  startTime: 39,
                },
                {
                  id: 'fifa11-54',
                  title: '3. Hüftdrehung nach innen',
                  description: '2 Mal durchführen.',
                  startTime: 54,
                },
                {
                  id: 'fifa11-71',
                  title: '4. Seitgalopp',
                  description: '2 Mal durchführen.',
                  startTime: 71,
                },
                {
                  id: 'fifa11-95',
                  title: '5. Schulterkontakt',
                  description: '2 Mal durchführen.',
                  startTime: 95,
                },
                {
                  id: 'fifa11-116',
                  title: '6. Vor- und Zurücksprinten',
                  description: '2 Mal durchführen.',
                  startTime: 116,
                },
                {
                  id: 'fifa11-header-part-2',
                  title: 'Teil 2: Kraft, Plyometrie und Gleichgewicht',
                  startTime: 180,
                },
                {
                  id: 'fifa11-180',
                  title: '7.1 Unterarmstütz Halten',
                  description: '3 Wiederholungen (jeweils 20–30 Sekunden).',
                  startTime: 180,
                },
                {
                  id: 'fifa11-210',
                  title: '7.2 Unterarmstütz Beine wechselnd anheben',
                  description: '3 Wiederholungen (jeweils 40–60 Sekunden).',
                  startTime: 210,
                },
                {
                  id: 'fifa11-246',
                  title: '7.3 Unterarmstütz Bein anheben und halten',
                  description:
                    '3 Wiederholungen (jeweils 20–30 Sekunden auf jeder Seite).',
                  startTime: 246,
                },
                {
                  id: 'fifa11-287',
                  title: '8.1 Seitlicher Unterarmstütz Halten',
                  description:
                    '3 Wiederholungen (jeweils 20–30 Sekunden auf jeder Seite).',
                  startTime: 287,
                },
                {
                  id: 'fifa11-320',
                  title: '8.2 Seitlicher Unterarmstütz Hüfte heben und senken',
                  description:
                    '3 Wiederholungen (jeweils 20–30 Sekunden auf jeder Seite).',
                  startTime: 320,
                },
                {
                  id: 'fifa11-357',
                  title: '8.3 Seitlicher Unterarmstütz Bein heben und senken',
                  description:
                    '3 Wiederholungen (jeweils 20–30 Sekunden auf jeder Seite).',
                  startTime: 357,
                },
                {
                  id: 'fifa11-398',
                  title: '9.1 Oberschenkelrückseite Anfänger',
                  description: '1 Mal (3–5 Wiederholungen).',
                  startTime: 398,
                },
                {
                  id: 'fifa11-411',
                  title: '9.2 Oberschenkelrückseite Fortgeschritten',
                  description: '1 Mal (7–10 Wiederholungen).',
                  startTime: 411,
                },
                {
                  id: 'fifa11-420',
                  title: '9.3 Oberschenkelrückseite Topfit',
                  description: '1 Mal (mindestens 12–15 Wiederholungen).',
                  startTime: 420,
                },
                {
                  id: 'fifa11-438',
                  title: '10.1 Einbeinstand mit dem Ball',
                  description: '2 Mal (jeweils 30 Sekunden auf jedem Bein).',
                  startTime: 438,
                },
                {
                  id: 'fifa11-470',
                  title: '10.2 Einbeinstand Ball gegenseitig zuwerfen',
                  description: '2 Mal (jeweils 30 Sekunden auf jedem Bein).',
                  startTime: 470,
                },
                {
                  id: 'fifa11-502',
                  title: '10.3 Einbeinstand Gleichgewicht testen',
                  description: '2 Mal (jeweils 30 Sekunden auf jedem Bein).',
                  startTime: 502,
                },
                {
                  id: 'fifa11-533',
                  title: '11.1 Kniebeugen auf die Zehenspitzen',
                  description: '2 Mal (jeweils 30 Sekunden).',
                  startTime: 533,
                },
                {
                  id: 'fifa11-572',
                  title: '11.2 Kniebeugen Ausfallschritte',
                  description: '2 Mal (jeweils 10 Schritte mit jedem Bein).',
                  startTime: 572,
                },
                {
                  id: 'fifa11-603',
                  title: '11.3 Kniebeugen auf einem Bein',
                  description: '2 Mal (jeweils 10 Mal auf jedem Bein).',
                  startTime: 603,
                },
                {
                  id: 'fifa11-639',
                  title: '12.1 Springen Sprünge nach oben',
                  description: '2 Mal (30 Sekunden).',
                  startTime: 639,
                },
                {
                  id: 'fifa11-673',
                  title: '12.2 Springen Sprünge zur Seite',
                  description: '2 Mal (30 Sekunden).',
                  startTime: 673,
                },
                {
                  id: 'fifa11-708',
                  title: '12.3 Springen Kreuzsprünge',
                  description: '2 Mal (30 Sekunden).',
                  startTime: 708,
                },
                {
                  id: 'fifa11-header-part-3',
                  title: 'Teil 3: Laufübungen',
                  startTime: 775,
                },
                {
                  id: 'fifa11-775',
                  title: '13. Laufen über das Spielfeld',
                  description: '2 Mal durchführen.',
                  startTime: 775,
                },
                {
                  id: 'fifa11-798',
                  title: '14. Laufen Hoch-Weit-Sprünge',
                  description: '2 Mal durchführen.',
                  startTime: 798,
                },
                {
                  id: 'fifa11-824',
                  title: '15. Laufen Richtungswechsel',
                  description: '2 Mal durchführen.',
                  startTime: 824,
                },
              ],
            },
            {
              id: 'fifa-11-plus-world-soccer',
              title: 'FIFA 11+ World Soccer Programm',
              description:
                'Alternatives FIFA 11+ Verletzungspräventionsprogramm mit aktualisierten Übungen und Demonstrationen.',
              type: 'chapters',
              videoUrl:
                'https://data-h03.fra1.cdn.digitaloceanspaces.com/ws.mp4',
              playlistTitle: 'FIFA 11+ World Soccer',
              chapters: [
                {
                  id: 'ws-header-part-1',
                  title: 'Teil 1: Laufübungen',
                  startTime: 0,
                },
                {
                  id: 'ws-24',
                  title: '1. Geradeaus',
                  description: '2 Mal durchführen.',
                  startTime: 24,
                },
                {
                  id: 'ws-37',
                  title: '2. Hüftdrehung nach aussen',
                  description: '2 Mal durchführen.',
                  startTime: 37,
                },
                {
                  id: 'ws-60',
                  title: '3. Hüftdrehung nach innen',
                  description: '2 Mal durchführen.',
                  startTime: 60,
                },
                {
                  id: 'ws-83',
                  title: '4. Seitgalopp',
                  description: '2 Mal durchführen.',
                  startTime: 83,
                },
                {
                  id: 'ws-114',
                  title: '5. Schulterkontakt',
                  description: '2 Mal durchführen.',
                  startTime: 114,
                },
                {
                  id: 'ws-144',
                  title: '6. Vor- und Zurücksprinten',
                  description: '2 Mal durchführen.',
                  startTime: 144,
                },
                {
                  id: 'ws-170',
                  title: '7. Laufen über das Spielfeld',
                  description: '2 Mal durchführen.',
                  startTime: 170,
                },
                {
                  id: 'ws-183',
                  title: '8. Laufen Hoch-Weit-Sprünge',
                  description: '2 Mal durchführen.',
                  startTime: 183,
                },
                {
                  id: 'ws-198',
                  title: '9. Laufen Richtungswechsel',
                  description: '2 Mal durchführen.',
                  startTime: 198,
                },
                {
                  id: 'ws-header-part-2',
                  title: 'Teil 2: Kraft, Plyometrie und Gleichgewicht',
                  startTime: 227,
                },
                {
                  id: 'ws-227',
                  title: '10. Unterarmstütz: Level 1 - Halten',
                  description: '3 Wiederholungen (jeweils 20–30 Sekunden).',
                  startTime: 227,
                },
                {
                  id: 'ws-237',
                  title: '11. Unterarmstütz: Level 2 - Beine wechselnd anheben',
                  description: '3 Wiederholungen (jeweils 40–60 Sekunden).',
                  startTime: 237,
                },
                {
                  id: 'ws-248',
                  title: '12. Unterarmstütz: Level 3 - Bein anheben und halten',
                  description:
                    '3 Wiederholungen (jeweils 20–30 Sekunden auf jeder Seite).',
                  startTime: 248,
                },
                {
                  id: 'ws-258',
                  title: '13. Seitlicher Unterarmstütz: Level 1 - Halten',
                  description:
                    '3 Wiederholungen (jeweils 20–30 Sekunden auf jeder Seite).',
                  startTime: 258,
                },
                {
                  id: 'ws-268',
                  title:
                    '14. Seitlicher Unterarmstütz: Level 2 - Hüfte heben und senken',
                  description:
                    '3 Wiederholungen (jeweils 20–30 Sekunden auf jeder Seite).',
                  startTime: 268,
                },
                {
                  id: 'ws-279',
                  title:
                    '15. Seitlicher Unterarmstütz: Level 3 - mit Beinhebung',
                  description:
                    '3 Wiederholungen (jeweils 20–30 Sekunden auf jeder Seite).',
                  startTime: 279,
                },
                {
                  id: 'ws-290',
                  title: '16. Oberschenkelrückseite: Level 1',
                  description: '1 Mal (3–5 Wiederholungen).',
                  startTime: 290,
                },
                {
                  id: 'ws-304',
                  title: '17. Oberschenkelrückseite: Level 2',
                  description: '1 Mal (7–10 Wiederholungen).',
                  startTime: 304,
                },
                {
                  id: 'ws-316',
                  title: '18. Oberschenkelrückseite: Level 3',
                  description: '1 Mal (mindestens 12–15 Wiederholungen).',
                  startTime: 316,
                },
                {
                  id: 'ws-328',
                  title:
                    '19. Kopenhagen Adduktoren: Level 1 - Seitliche Beinhebung',
                  description: '2 Mal (jeweils 30 Sekunden auf jeder Seite).',
                  startTime: 328,
                },
                {
                  id: 'ws-339',
                  title:
                    '20. Kopenhagen Adduktoren: Level 2 - Oberes Knie gestützt',
                  description: '2 Mal (jeweils 30 Sekunden auf jeder Seite).',
                  startTime: 339,
                },
                {
                  id: 'ws-352',
                  title:
                    '21. Kopenhagen Adduktoren: Level 3 - Oberer Knöchel gestützt',
                  description: '2 Mal (jeweils 30 Sekunden auf jeder Seite).',
                  startTime: 352,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  legacyVideos: [], // All legacy videos have been categorized
};

// --- Export the final data structure ---
export const hierarchicalVideoData: HierarchicalVideoData = allVideoData;

// --- HELPER FUNCTIONS ---

// Flatten the hierarchical data into a simple array of VideoData objects for easy lookup.
const allVideosAsVideoData: VideoData[] = allVideoData.categories
  .flatMap((category) =>
    category.subcategories.flatMap((subcategory) =>
      subcategory.videos.map((video) => ({
        ...video,
        category: category.name,
        playlistTitle: video.playlistTitle || video.title,
      })),
    ),
  )
  .concat(
    allVideoData.legacyVideos.map((video) => ({
      ...video,
      category: 'Legacy', // Assign a default category
      playlistTitle: video.playlistTitle || video.title,
    })),
  );

export const formatDuration = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

export const generatePlaylist = (video: VideoData): PlaylistItem[] => {
  return video.chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    artist: video.playlistTitle,
    duration:
      chapter.startTime !== undefined && chapter.endTime !== undefined
        ? formatDuration(chapter.endTime - chapter.startTime)
        : chapter.duration
          ? formatDuration(chapter.duration)
          : '---',
    videoId: video.id,
    chapterId: chapter.id,
    isNew: !!chapter.videoUrl,
    rank: chapter.rank,
    score: chapter.score,
    startTime: chapter.startTime,
    endTime: chapter.endTime,
    videoUrl: chapter.videoUrl || video.videoUrl,
  }));
};

export const getVideoById = (id: string): VideoData | undefined => {
  return allVideosAsVideoData.find((video) => video.id === id);
};
