import { Dna, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { RecommendationCard } from "@/components/recommendation-card"
import { mockRecommendations } from "@/lib/mock-data"

export default function RecommendationsPage() {
  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Your Recommendations
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Top 5 movies predicted by the Adaptive Genetic Algorithm based on your
          multi-criteria ratings
        </p>
      </div>

      {/* Algorithm info */}
      <Card className="mb-6">
        <CardContent className="flex items-start gap-3 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary">
            <Dna className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-card-foreground">
              Adaptive Genetic Algorithm
            </h3>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              The recommendation engine uses evolutionary computation to optimize
              movie suggestions. It evaluates candidates across storyline,
              acting, visuals, and soundtrack criteria, applying crossover and
              mutation operators to converge on your ideal preferences.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations list */}
      <div className="flex flex-col gap-4">
        {mockRecommendations.map((rec, index) => (
          <RecommendationCard
            key={rec.id}
            recommendation={rec}
            rank={index + 1}
          />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 flex items-start gap-2 rounded-md border border-border bg-muted px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          These recommendations are generated using mock data for demonstration
          purposes. In production, the Adaptive Genetic Algorithm would process
          real user ratings to generate personalized predictions.
        </p>
      </div>
    </div>
  )
}
