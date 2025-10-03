'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';
import type { Playlist, Video } from '../_lib/types';

interface PlaylistViewProps {
  playlist: Playlist;
  currentVideoId: string;
  onVideoSelect: (video: Video) => void;
}

const getImagePath = (video: Video): string | null => {
  if (video.isHeader === true) {
    return null;
  }
  const imageMap: { [key: string]: string } = {
    'fifa11-20':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%201%20-%20Running%20Exercises/exercise_1_-_running_straight_ahead_illustrations.png',
    'fifa11-39':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%201%20-%20Running%20Exercises/exercise_2_-_running_hip_out_illustrations.png',
    'fifa11-54':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%201%20-%20Running%20Exercises/exercise_3_-_running_hip_in_illustrations.png',
    'fifa11-71':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%201%20-%20Running%20Exercises/exercise_4_-_running_circling_partner_illustrations.png',
    'fifa11-95':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%201%20-%20Running%20Exercises/exercise_5_-_running_jumping_with_shoulder_contact_illustrations.png',
    'fifa11-116':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%201%20-%20Running%20Exercises/exercise_6_-_running_quick_forwards_and_backwards_sprints_illustrations.png',
    'fifa11-180':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_7.1_-_the_bench_static_illustrations.png',
    'fifa11-210':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_7.2_-_the_bench_alternate_legs_illustrations.png',
    'fifa11-246':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_7.3_-_the_bench_one_leg_lift_and_hold_illustrations.png',
    'fifa11-287':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_8.1_-_sideways_bench_static_illustrations.png',
    'fifa11-320':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_8.2_-_sideways_bench_raise_and_lower_hip_illustrations.png',
    'fifa11-357':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_8.3_-_sideways_bench_with_leg_lift_illustrations.png',
    'fifa11-398':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_9_-_hamstrings_illustrations.png',
    'fifa11-411':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_9_-_hamstrings_illustrations.png',
    'fifa11-420':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_9_-_hamstrings_illustrations.png',
    'fifa11-438':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_10.1_-_single-leg_stance_hold_the_ball_illustrations.png',
    'fifa11-470':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_10.2_-_single-leg_balance_throwing_ball_with_partner_illustrations.png',
    'fifa11-502':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_10.3_-_single-leg_balance_test_your_partner_illustrations.png',
    'fifa11-533':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_11.1_-_squats_with_toe_raise_illustrations.png',
    'fifa11-572':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_11.2_-_squats_walking_lunges_illustrations.png',
    'fifa11-603':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_11.3_-_squats_one-leg_squats_illustrations.png',
    'fifa11-639':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_12.1_-_jumping_vertical_jumps_illustrations.png',
    'fifa11-673':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_12.2_-_jumping_lateral_jumps_illustrations.png',
    'fifa11-708':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_12.3_-_jumping_box_jumps_illustrations.png',
    'fifa11-775':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%203%20-%20Running%20Exercises/exercise_13_-_running_across_the_pitch_illustrations.png',
    'fifa11-798':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%203%20-%20Running%20Exercises/exercise_14_-_running_bounding_illustrations.png',
    'fifa11-824':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%203%20-%20Running%20Exercises/exercise_15_-_running_plant_and_cut_illustrations.png',
    'ws-24':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%201%20-%20Running%20Exercises/exercise_1_-_running_straight_ahead_illustrations.png',
    'ws-37':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%201%20-%20Running%20Exercises/exercise_2_-_running_hip_out_illustrations.png',
    'ws-60':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%201%20-%20Running%20Exercises/exercise_3_-_running_hip_in_illustrations.png',
    'ws-83':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%201%20-%20Running%20Exercises/exercise_4_-_running_circling_partner_illustrations.png',
    'ws-114':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%201%20-%20Running%20Exercises/exercise_5_-_running_jumping_with_shoulder_contact_illustrations.png',
    'ws-144':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%201%20-%20Running%20Exercises/exercise_6_-_running_quick_forwards_and_backwards_sprints_illustrations.png',
    'ws-170':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%203%20-%20Running%20Exercises/exercise_13_-_running_across_the_pitch_illustrations.png',
    'ws-183':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%203%20-%20Running%20Exercises/exercise_14_-_running_bounding_illustrations.png',
    'ws-198':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%203%20-%20Running%20Exercises/exercise_15_-_running_plant_and_cut_illustrations.png',
    'ws-227':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_7.1_-_the_bench_static_illustrations.png',
    'ws-237':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_7.2_-_the_bench_alternate_legs_illustrations.png',
    'ws-248':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_7.3_-_the_bench_one_leg_lift_and_hold_illustrations.png',
    'ws-258':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_8.1_-_sideways_bench_static_illustrations.png',
    'ws-268':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_8.2_-_sideways_bench_raise_and_lower_hip_illustrations.png',
    'ws-279':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_8.3_-_sideways_bench_with_leg_lift_illustrations.png',
    'ws-290':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_9_-_hamstrings_illustrations.png',
    'ws-304':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_9_-_hamstrings_illustrations.png',
    'ws-316':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/Part%202%20-%20Strength%2C%20Plyometrics%20and%20Balance%20Exercises/exercise_9_-_hamstrings_illustrations.png',
  };
  return imageMap[video.id] || null;
};

const getInstructionsPath = (video: Video): string | null => {
  if (video.isHeader === true) {
    return null;
  }
  const instructionsMap: { [key: string]: string } = {
    'fifa11-20':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_1_-_running_straight_ahead_instructions.png',
    'fifa11-39':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_2_-_running_hip_out_instructions.png',
    'fifa11-54':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_3_-_running_hip_in_instructions.png',
    'fifa11-71':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_4_-_running_circling_partner_instructions.png',
    'fifa11-95':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_5_-_running_jumping_with_shoulder_contact_instructions.png',
    'fifa11-116':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_6_-_running_quick_forwards_and_backwards_sprints_instructions.png',
    'fifa11-180':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_7.1_-_the_bench_static_instructions.png',
    'fifa11-210':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_7.2_-_the_bench_alternate_legs_instructions.png',
    'fifa11-246':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_7.3_-_the_bench_one_leg_lift_and_hold_instructions.png',
    'fifa11-287':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_8.1_-_sideways_bench_static_instructions.png',
    'fifa11-320':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_8.2_-_sideways_bench_raise_and_lower_hip_instructions.png',
    'fifa11-357':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_8.3_-_sideways_bench_with_leg_lift_instructions.png',
    'fifa11-398':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_9_-_hamstrings_beginner_-_intermediate_-_advanced_instructions.png',
    'fifa11-411':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_9_-_hamstrings_beginner_-_intermediate_-_advanced_instructions.png',
    'fifa11-420':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_9_-_hamstrings_beginner_-_intermediate_-_advanced_instructions.png',
    'fifa11-438':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_10.1_-_single-leg_stance_hold_the_ball_instructions.png',
    'fifa11-470':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_10.2_-_single-leg_balance_throwing_ball_with_partner_instructions.png',
    'fifa11-502':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_10.3_-_single-leg_balance_test_your_partner_instructions.png',
    'fifa11-533':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_11.1_-_squats_with_toe_raise_instructions.png',
    'fifa11-572':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_11.2_-_squats_walking_lunges_instructions.png',
    'fifa11-603':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_11.3_-_squats_one-leg_squats_instructions.png',
    'fifa11-639':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_12.1_-_jumping_vertical_jumps_instructions.png',
    'fifa11-673':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_12.2_-_jumping_lateral_jumps_instructions.png',
    'fifa11-708':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_12.3_-_jumping_box_jumps_instructions.png',
    'fifa11-775':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_13_-_running_across_the_pitch_instructions.png',
    'fifa11-798':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_14_-_running_bounding_instructions.png',
    'fifa11-824':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_15_-_running_plant_and_cut_instructions.png',
    'ws-24':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_1_-_running_straight_ahead_instructions.png',
    'ws-37':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_2_-_running_hip_out_instructions.png',
    'ws-60':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_3_-_running_hip_in_instructions.png',
    'ws-83':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_4_-_running_circling_partner_instructions.png',
    'ws-114':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_5_-_running_jumping_with_shoulder_contact_instructions.png',
    'ws-144':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_6_-_running_quick_forwards_and_backwards_sprints_instructions.png',
    'ws-170':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_13_-_running_across_the_pitch_instructions.png',
    'ws-183':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_14_-_running_bounding_instructions.png',
    'ws-198':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_15_-_running_plant_and_cut_instructions.png',
    'ws-227':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_7.1_-_the_bench_static_instructions.png',
    'ws-237':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_7.2_-_the_bench_alternate_legs_instructions.png',
    'ws-248':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_7.3_-_the_bench_one_leg_lift_and_hold_instructions.png',
    'ws-258':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_8.1_-_sideways_bench_static_instructions.png',
    'ws-268':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_8.2_-_sideways_bench_raise_and_lower_hip_instructions.png',
    'ws-279':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_8.3_-_sideways_bench_with_leg_lift_instructions.png',
    'ws-290':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_9_-_hamstrings_beginner_-_intermediate_-_advanced_instructions.png',
    'ws-304':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_9_-_hamstrings_beginner_-_intermediate_-_advanced_instructions.png',
    'ws-316':
      'https://data-h03.fra1.cdn.digitaloceanspaces.com/11plus-workbook-updated_extracted/ins/exercise_9_-_hamstrings_beginner_-_intermediate_-_advanced_instructions.png',
  };
  return instructionsMap[video.id] || null;
};

const openImageInNewTab = (imagePath: string) => {
  window.open(imagePath, '_blank');
};

export default function PlaylistView({
  playlist,
  currentVideoId,
  onVideoSelect,
}: PlaylistViewProps) {
  let chapterCounter = 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-foreground text-2xl font-bold">{playlist.name}</h2>
        <p className="text-muted-foreground mt-1">{playlist.description}</p>
      </div>
      <div className="space-y-2">
        {playlist.videos.map((video) => {
          if (video.isHeader === true) {
            return (
              <div key={video.id} className="pt-6 pb-2">
                <h3 className="text-primary text-xl font-semibold tracking-wide">
                  {video.title}
                </h3>
              </div>
            );
          }

          chapterCounter++;
          const isActive = video.id === currentVideoId;
          const imagePath = getImagePath(video);
          const instructionsPath = getInstructionsPath(video);
          const hasSupplementaryMedia =
            instructionsPath !== null || imagePath !== null;

          return (
            <div
              key={video.id}
              className={cn(
                'w-full rounded-lg p-3 transition-all duration-200',
                isActive ? 'bg-accent ring-primary ring-2' : 'bg-card',
              )}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                <button
                  onClick={() => onVideoSelect(video)}
                  className="hover:bg-muted/50 flex flex-1 items-start gap-4 rounded p-2 text-left transition-colors"
                >
                  <div className="w-8 flex-shrink-0 text-center">
                    {isActive ? (
                      <Play className="text-primary mx-auto h-6 w-6" />
                    ) : (
                      <span className="text-muted-foreground font-semibold">
                        {chapterCounter}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={cn(
                        'font-semibold',
                        isActive ? 'text-primary' : 'text-foreground',
                      )}
                    >
                      {video.title}
                    </p>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                      {video.description}
                    </p>
                  </div>
                  <p className="text-muted-foreground font-mono text-sm">
                    {video.timestamp}
                  </p>
                </button>

                {hasSupplementaryMedia && (
                  <div className="flex justify-end gap-2 sm:flex-col sm:items-end sm:gap-2">
                    {instructionsPath !== null && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          openImageInNewTab(instructionsPath);
                        }}
                        title="Anleitung anzeigen"
                      >
                        Anleitung
                      </Button>
                    )}
                    {imagePath !== null && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          openImageInNewTab(imagePath);
                        }}
                        title="Fehlerbild anzeigen"
                      >
                        Fehler
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
