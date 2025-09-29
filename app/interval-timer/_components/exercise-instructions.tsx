import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExerciseInstructionsProps {
  instructions: string | null;
}

export default function ExerciseInstructions({ instructions }: ExerciseInstructionsProps) {
  if (!instructions) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructions</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{instructions}</p>
      </CardContent>
    </Card>
  );
}