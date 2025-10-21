import { Heart, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { parseTrainingTitle } from '@/app/junioren/_lib/roman-numeral-utils'
import type { TrainingSession } from '@/app/junioren/_lib/types'

interface TrainingCardProps {
  session: TrainingSession
  isExpanded: boolean
  onToggleExpanded: () => void
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function TrainingCard({
  session,
  isExpanded,
  onToggleExpanded,
  isFavorite,
  onToggleFavorite,
}: TrainingCardProps) {
  const { title, romanNumber } = parseTrainingTitle(session.title)

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {romanNumber && (
                <Badge variant="secondary" className="text-xs">
                  {romanNumber}
                </Badge>
              )}
              {title}
            </CardTitle>
            <CardDescription>{session.description}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFavorite}
            className="ml-2"
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite ? 'fill-red-500 text-red-500' : ''
              }`}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Altersgruppe: {session.ageGroup}</span>
          <span>Kategorie: {session.category}</span>
        </div>

        {session.htmlPath && (
          <div className="mt-4">
            <Button variant="outline" size="sm" asChild>
              <a href={session.htmlPath} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Training anzeigen
              </a>
            </Button>
          </div>
        )}

        {session.pdfPath && (
          <div className="mt-2">
            <Button variant="outline" size="sm" asChild>
              <a href={session.pdfPath} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                PDF herunterladen
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}