import { CheckCircle2, CheckIcon, X, XCircle } from 'lucide-react';

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from '@/components/ui/timeline';
import { cn } from '@/lib/utils';

const items = [
  {
    id: 1,
    date: 'Mar 15, 2024',
    title: 'Level 1',
    status: 'fail',
    tasks: [
      { name: 'Yo-Yo 600m', completed: true },
      { name: 'Jonglieren 60x', completed: false },
      { name: 'Springseil 60x', completed: true },
      { name: 'Prellwand 13/15s', completed: false },
    ],
  },
  {
    id: 2,
    date: 'Mar 16, 2024',
    title: 'Level 2',
    status: 'fail',
    tasks: [
      { name: 'Yo-Yo 800m', completed: false },
      { name: 'Jonglieren 80x', completed: false },
      { name: 'Springseil 80x', completed: false },
      { name: 'Prellwand 14/15s', completed: false },
    ],
  },
  {
    id: 3,
    date: 'Mar 17, 2024',
    title: 'Level 3',
    status: 'fail',
    tasks: [
      { name: 'Yo-Yo 1000m', completed: false },
      { name: 'Jonglieren 100x', completed: false },
      { name: 'Springseil 100x', completed: false },
      { name: 'Prellwand 15/15s', completed: false },
    ],
  },
];

export default function Component() {
  return (
    <Timeline defaultValue={3}>
      {items.map((item) => (
        <TimelineItem
          key={item.id}
          step={item.id}
          className="group-data-[orientation=vertical]/timeline:ms-10"
        >
          <TimelineHeader>
            <TimelineSeparator
              className={cn(
                'group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5',
                // Override the line color to light red.
                // The `!` modifier ensures this overrides the default blue from the base component.
                '!bg-red-400',
              )}
            />
            <TimelineDate>{item.date}</TimelineDate>
            <TimelineTitle>{item.title}</TimelineTitle>
            <TimelineIndicator
              className={cn(
                'group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7',
                item.status === 'fail' && '!bg-red-500 !text-white',
              )}
            >
              {item.status === 'fail' ? (
                <X size={16} />
              ) : (
                <CheckIcon
                  className="group-not-data-completed/timeline-item:hidden"
                  size={16}
                />
              )}
            </TimelineIndicator>
          </TimelineHeader>
          <TimelineContent>
            <div className="flex flex-col space-y-1">
              {item.tasks.map((task) => (
                <span key={task.name} className="flex items-center gap-1.5">
                  {task.name}
                  {task.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </span>
              ))}
            </div>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
