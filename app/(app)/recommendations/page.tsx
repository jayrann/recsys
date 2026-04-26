"use client"

import { useState, useEffect, useRef } from "react"
import {
  Dna,
  Loader2,
  RefreshCw,
  Star,
  Info,
  BarChart3,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  fetchRecommendations,
  getUserId,
  type RecommendationResponse,
  type WeightProfile,
} from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"

const WEIGHT_LABELS: Record<keyof WeightProfile, string> = {
  w1_storyline: "Storyline",
  w2_acting: "Acting",
  w3_visuals: "Visuals",
  w4_emotional: "Emotional Impact",
  w5_enjoyment: "Enjoyment",
}

function WeightBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 100)
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 shrink-0 text-xs text-muted-foreground">
        {label}
      </span>
      <div className="flex-1 rounded-full bg-muted h-2">
        <div
          className="h-2 rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right text-xs font-medium text-foreground">
        {pct}%
      </span>
    </div>
  )
}

export default function RecommendationsPage() {
  const router = useRouter()
  const [data, setData] = useState<RecommendationResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const loadedRef = useRef(false)

  async function load() {
    const userId = getUserId()
    if (!userId) {
      router.replace("/login")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await fetchRecommendations(userId)
      setData(result)
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch recommendations"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true
      load()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="px-4 py-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Your Recommendations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Top 10 movies predicted by the Adaptive Genetic Algorithm
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={load}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2 hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Running Adaptive Genetic Algorithm...
          </p>
          <p className="text-xs text-muted-foreground">
            This may take a few seconds on first load
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 py-12 text-center px-4">
          <p className="text-sm text-destructive">{error}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Make sure you have rated at least 10 movies
          </p>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" onClick={load}>
              Try again
            </Button>
            <Button asChild size="sm">
              <Link href="/dashboard">Rate movies</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && data && (
        <>
          {/* AGA Info */}
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
                  Evolutionary computation optimised your criterion weights
                  across 50 chromosomes for up to 100 generations. The
                  algorithm adapts its mutation rate based on population
                  diversity to avoid premature convergence.
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">
                    {data.neighbours_found} neighbours found
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {data.recommendations.length} recommendations
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weight Profile */}
          {data.weight_profile && (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-serif text-sm">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Your Personalised Criterion Weights
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 pt-0">
                {(
                  Object.entries(data.weight_profile) as [
                    keyof WeightProfile,
                    number,
                  ][]
                ).map(([key, value]) => (
                  <WeightBar
                    key={key}
                    label={WEIGHT_LABELS[key]}
                    value={value}
                  />
                ))}
                <p className="mt-1 text-xs text-muted-foreground">
                  These weights represent how much each criterion influences
                  your recommendations. Learned from your rating history by
                  the AGA.
                </p>
              </CardContent>
            </Card>
          )}

          {/* No recommendations */}
          {data.recommendations.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
              <Star className="mb-3 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                Not enough data yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                Rate at least 10 movies to generate personalised
                recommendations. Focus on popular movies for better neighbour
                matching.
              </p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/dashboard">Browse and rate movies</Link>
              </Button>
            </div>
          )}

          {/* Recommendations list */}
          {data.recommendations.length > 0 && (
            <div className="flex flex-col gap-3">
              {data.recommendations.map((rec, index) => (
                <Card
                  key={rec.movie_id}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-serif text-sm font-semibold text-card-foreground">
                        {rec.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Movie ID: {rec.movie_id}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                      <span className="text-sm font-semibold text-foreground">
                        {rec.predicted_score.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">/ 5</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Footer note */}
          <div className="mt-6 flex items-start gap-2 rounded-md border border-border bg-muted px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Recommendations are generated using weighted Pearson
              collaborative filtering with criterion weights optimised by the
              Adaptive Genetic Algorithm. Rate more movies to improve accuracy.
            </p>
          </div>
        </>
      )}
    </div>
  )
}