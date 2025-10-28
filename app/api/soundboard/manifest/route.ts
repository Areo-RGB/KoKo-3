import { NextRequest, NextResponse } from 'next/server';

// Digital Ocean Spaces configuration
const DO_SPACES_BUCKET = 'data-h03.fra1.cdn.digitaloceanspaces.com';
const SOUNDBOARD_PATH = '/soundboard';

// Required for static export mode
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export async function GET(request: NextRequest) {
  try {
    // For now, return a mock manifest structure
    // In production, this would fetch from Digital Ocean Spaces
    const manifest = {
      topics: [
        {
          id: 'lol',
          name: 'League of Legends',
          sounds: [
            {
              id: 'first-blood',
              label: 'First Blood',
              src: `https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/first-blood.mp3`,
              sources: [`https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/first-blood.mp3`],
            },
            {
              id: 'double-kill',
              label: 'Double Kill',
              src: `https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/double-kill.mp3`,
              sources: [`https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/double-kill.mp3`],
            },
            {
              id: 'triple-kill',
              label: 'Triple Kill',
              src: `https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/triple-kill.mp3`,
              sources: [`https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/triple-kill.mp3`],
            },
            {
              id: 'quadra-kill',
              label: 'Quadra Kill',
              src: `https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/quadra-kill.mp3`,
              sources: [`https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/quadra-kill.mp3`],
            },
            {
              id: 'penta-kill',
              label: 'Penta Kill',
              src: `https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/penta-kill.mp3`,
              sources: [`https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/penta-kill.mp3`],
            },
            {
              id: 'ace',
              label: 'Ace',
              src: `https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/ace.mp3`,
              sources: [`https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/ace.mp3`],
            },
            {
              id: 'legendary',
              label: 'Legendary',
              src: `https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/legendary.mp3`,
              sources: [`https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/legendary.mp3`],
            },
            {
              id: 'unstoppable',
              label: 'Unstoppable',
              src: `https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/unstoppable.mp3`,
              sources: [`https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/unstoppable.mp3`],
            },
            {
              id: 'godlike',
              label: 'Godlike',
              src: `https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/godlike.mp3`,
              sources: [`https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/godlike.mp3`],
            },
            {
              id: 'rampage',
              label: 'Rampage',
              src: `https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/rampage.mp3`,
              sources: [`https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/lol/rampage.mp3`],
            },
          ],
        },
        {
          id: 'sports',
          name: 'Sports',
          sounds: [
            {
              id: 'goal',
              label: 'Goal!',
              src: `https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/sports/goal.mp3`,
              sources: [`https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/sports/goal.mp3`],
            },
            {
              id: 'foul',
              label: 'Foul',
              src: `https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/sports/foul.mp3`,
              sources: [`https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/sports/foul.mp3`],
            },
            {
              id: 'offside',
              label: 'Offside',
              src: `https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/sports/offside.mp3`,
              sources: [`https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/sports/offside.mp3`],
            },
            {
              id: 'penalty',
              label: 'Penalty',
              src: `https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/sports/penalty.mp3`,
              sources: [`https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/sports/penalty.mp3`],
            },
            {
              id: 'corner',
              label: 'Corner Kick',
              src: `https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/sports/corner.mp3`,
              sources: [`https://${DO_SPACES_BUCKET}${SOUNDBOARD_PATH}/sports/corner.mp3`],
            },
          ],
        },
      ],
    };

    return NextResponse.json(manifest, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error fetching soundboard manifest:', error);
    return NextResponse.json(
      { error: 'Failed to fetch soundboard manifest' },
      { status: 500 }
    );
  }
}