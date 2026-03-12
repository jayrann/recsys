import { Star, TrendingUp, Clapperboard } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Recommendation } from "@/lib/mock-data"

interface RecommendationCardProps {
  recommendation: Recommendation
  rank: number
}

export function RecommendationCard({ recommendation, rank }: RecommendationCardProps) {
  const { movie, predictedRating, matchScore } = recommendation

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="flex gap-4 p-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-muted">
          <Clapperboard className="h-7 w-7 text-muted-foreground/50" />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {rank}
                </span>
                <h3 className="font-serif text-sm font-semibold text-card-foreground">
                  {movie.title}
                </h3>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {movie.year} &middot; {movie.director}
              </p>
            </div>

            <Badge variant="secondary" className="shrink-0">
              {movie.genre}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              <span className="text-xs font-semibold text-card-foreground">
                {predictedRating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">predicted</span>
            </div>

            <div className="flex flex-1 items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <Progress value={matchScore} className="h-2 flex-1" />
              <span className="text-xs font-semibold text-card-foreground">
                {matchScore}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
