import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WORKOUT_PRESETS } from '../_lib/presets';
import type { WorkoutPreset } from '../_lib/types';

interface PresetSelectorProps {
  selectedPreset: WorkoutPreset | null;
  onSelectPreset: (preset: WorkoutPreset) => void;
}

export default function PresetSelector({ selectedPreset, onSelectPreset }: PresetSelectorProps) {
  const handleSelect = (presetId: string) => {
    const preset = WORKOUT_PRESETS.find(p => p.id === presetId);
    if (preset) {
      onSelectPreset(preset);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Preset</CardTitle>
        <CardDescription>Select a workout routine to begin.</CardDescription>
      </CardHeader>
      <CardContent>
        <Select onValueChange={handleSelect} value={selectedPreset?.id}>
          <SelectTrigger>
            <SelectValue placeholder="Select a preset..." />
          </SelectTrigger>
          <SelectContent>
            {WORKOUT_PRESETS.map(preset => (
              <SelectItem key={preset.id} value={preset.id}>
                {preset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedPreset && (
          <div className="mt-4 text-sm text-muted-foreground space-y-1">
            <p><strong>Description:</strong> {selectedPreset.description}</p>
            <p><strong>Exercises:</strong> {selectedPreset.exercises.length}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}