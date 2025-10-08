'use client';

import type { ReactElement } from 'react';

import {
  AvatarGroup,
  AvatarGroupTooltip,
} from '@/components/animate-ui/components/animate';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from '@/components/ui/timeline';
import { VideoAvatar } from '@/components/ui/video-avatar';

type Player = {
  name: string;
  image: string;
  videoAvatar?: string;
};

type PerformanceLevel = {
  level: number;
  yoYo: number;
  juggling: number;
  skipping: number;
  wall: string;
};

const players = [
  {
    name: 'Behrat',
    image:
      'https://res.cloudinary.com/dg8zbx8ja/image/upload/v1758780476/spieler-avatars/behrat.png',
  },
  {
    name: 'Bent',
    image:
      'https://res.cloudinary.com/dg8zbx8ja/image/upload/v1759777878/spieler-avatars/bent.png',
  },
  {
    name: 'Eray',
    image:
      'https://res.cloudinary.com/dg8zbx8ja/image/upload/v1758780481/spieler-avatars/eray.png',
  },
  {
    name: 'Erik',
    image:
      'https://res.cloudinary.com/dg8zbx8ja/image/upload/v1758780484/spieler-avatars/erik.png',
  },
  {
    name: 'Finley',
    image:
      'https://res.cloudinary.com/dg8zbx8ja/image/upload/v1758780488/spieler-avatars/finley.png',
  },
  {
    name: 'Jakob',
    image:
      'https://res.cloudinary.com/dg8zbx8ja/image/upload/v1758780493/spieler-avatars/jakob.png',
  },
  {
    name: 'Kayden',
    image:
      'https://res.cloudinary.com/dg8zbx8ja/image/upload/v1758780498/spieler-avatars/kayden.png',
  },
  {
    name: 'Lasse',
    image:
      'https://res.cloudinary.com/dg8zbx8ja/image/upload/v1758780503/spieler-avatars/lasse.png',
  },
  { name: 'LB', image: '/assets/images/spieler-avatars/lb.png' },
  {
    name: 'Lennox',
    image:
      'https://res.cloudinary.com/dg8zbx8ja/image/upload/v1758780507/spieler-avatars/lennox.png',
  },
  {
    name: 'Levi',
    image:
      'https://res.cloudinary.com/dg8zbx8ja/image/upload/v1758780512/spieler-avatars/levi.png',
  },
  {
    name: 'Lion',
    image:
      'https://res.cloudinary.com/dg8zbx8ja/image/upload/v1758780516/spieler-avatars/lion.png',
  },
  {
    name: 'Metin',
    image:
      'https://res.cloudinary.com/dg8zbx8ja/image/upload/v1758780521/spieler-avatars/metin.png',
  },
  {
    name: 'Paul',
    image:
      'https://res.cloudinary.com/dg8zbx8ja/image/upload/v1758780525/spieler-avatars/paul.png',
  },
  {
    name: 'Silas',
    image:
      'https://res.cloudinary.com/dg8zbx8ja/image/upload/v1758780530/spieler-avatars/silas.png',
  },
] as const satisfies readonly Player[];

const performanceLevels: readonly PerformanceLevel[] = [
  {
    level: 1,
    yoYo: 500,
    juggling: 50,
    skipping: 50,
    wall: '10/15s',
  },
  {
    level: 2,
    yoYo: 650,
    juggling: 65,
    skipping: 65,
    wall: '11/15s',
  },
  {
    level: 3,
    yoYo: 750,
    juggling: 75,
    skipping: 75,
    wall: '12/15s',
  },
  {
    level: 4,
    yoYo: 850,
    juggling: 85,
    skipping: 85,
    wall: '13/15s',
  },
  {
    level: 5,
    yoYo: 950,
    juggling: 95,
    skipping: 95,
    wall: '14/15s',
  },
  {
    level: 6,
    yoYo: 1000,
    juggling: 100,
    skipping: 100,
    wall: '15/15s',
  },
] as const;

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);

const AvatarStacks = ({ data }: { data: readonly Player[] }) => (
  <div className="overflow-x-auto py-2">
    <AvatarGroup
      className="h-16 -space-x-6 px-1"
      invertOverlap={false}
      sideOffset={16}
      tooltipTransition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      {data.map((player) => (
        <Avatar
          key={player.name}
          className="hover:border-primary h-16 w-16 border border-neutral-200 shadow-sm transition hover:z-10 hover:scale-105 dark:border-neutral-800"
        >
          {player.videoAvatar ? (
            <VideoAvatar
              src={player.videoAvatar}
              alt={player.name}
              className="h-16 w-16"
            />
          ) : (
            <AvatarImage src={player.image} alt={player.name} />
          )}
          <AvatarFallback>{getInitials(player.name)}</AvatarFallback>
          <AvatarGroupTooltip className="font-medium">
            {player.name}
          </AvatarGroupTooltip>
        </Avatar>
      ))}
    </AvatarGroup>
  </div>
);

export default function FortschrittTimeline(): ReactElement {
  return (
    <div className="bg-background min-h-[100svh] px-4 py-12">
      <div className="mx-auto w-full max-w-5xl">
        <Timeline defaultValue={1}>
          <TimelineItem
            step={1}
            className="group-data-[orientation=vertical]/timeline:ms-10"
          >
            <TimelineHeader>
              <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
              <TimelineTitle className="text-foreground text-xl font-semibold">
                Level 0
              </TimelineTitle>
              <TimelineIndicator className="group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7">
                1
              </TimelineIndicator>
            </TimelineHeader>
            <TimelineContent>
              <AvatarStacks data={players} />
            </TimelineContent>
          </TimelineItem>

          {performanceLevels.map((level) => (
            <TimelineItem
              key={level.level}
              step={level.level + 1}
              className="group-data-[orientation=vertical]/timeline:ms-10"
            >
              <TimelineHeader>
                <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                <TimelineTitle className="text-foreground text-xl font-semibold">
                  {`Level ${level.level}`}
                </TimelineTitle>
                <TimelineIndicator className="group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7">
                  {level.level + 1}
                </TimelineIndicator>
              </TimelineHeader>
              <TimelineContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  {`Yo-Yo ${level.yoYo}m | Jonglieren ${level.juggling}x | Springseil ${level.skipping}x | Prellwand ${level.wall}`}
                </p>
                <div className="overflow-x-auto py-2">
                  <Avatar className="hover:border-primary h-16 w-16 border border-neutral-200 shadow-sm transition hover:scale-105 dark:border-neutral-800">
                    <AvatarImage
                      src="/assets/images/spieler-avatars/lb.png"
                      alt="LB"
                    />
                    <AvatarFallback>LB</AvatarFallback>
                  </Avatar>
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </div>
  );
}
