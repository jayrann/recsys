"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, CheckCircle2, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { fetchMovie, submitRating, getUserId, type Movie } from "@/lib/api"

const CRITERIA = [
  {
    key: "storyline" as const,
    label: "Storyline Quality",
    description: "Narrative coherence, script depth, and plot execution",
  },
  {
    key: "acting" as const,
    label: "Acting Performance",
    description: "Character portrayal and emotional authenticity",
  },
  {
    key: "visuals" as const,
    label: "Visual & Production Quality",
    description: "Cinematography, effects, and art direction",
  },
  {
    key: "emotional_impact" as const,
    label: "Emotional Impact",
    description: "How effectively the film resonates emotionally",
  },
  {
    key: "enjoyment" as const,
    label: "Overall Enjoyment",
    description: "Entertainment value and overall satisfaction",
  },
]

type Ratings = {
  storyline: number
  acting: number
  visuals: number
  emotional_impact: number
  enjoyment: number
}

export default function RateMoviePage() {
  const params = useParams()
  const router = useRouter()
  const movieId = Number(params.id)

  const [movie, setMovie] = useState<Movie | null>(null)
  const [loadingMovie, setLoadingMovie] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [ratings, setRatings] = useState<Ratings>({
    storyline: 3,
    acting: 3,
    visuals: 3,
    emotional_impact: 3,
    enjoyment: 3,
  })

  const averageRating = (
    Object.values(ratings).reduce((a, b) => a + b, 0) / 5
  ).toFixed(1)

  useEffect(() => {
    fetchMovie(movieId)
      .then(setMovie)
      .catch(() => setError("Movie not found"))
      .finally(() => setLoadingMovie(false))
  }, [movieId])

  async function handleSubmit() {
    const userId = getUserId()
    if (!userId) {
      router.push("/login")
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await submitRating(movieId, ratings)
      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit rating")
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingMovie) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error && !movie) {
    return (
      <div className="px-4 py-6 lg:px-8">
        <p className="text-sm text-destructive">{error}</p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link href="/dashboard">Back to movies</Link>
        </Button>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
        <CheckCircle2 className="mb-4 h-12 w-12 text-primary" />
        <h2 className="font-serif text-xl font-bold text-foreground">Rating Submitted!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your multi-criteria rating for{" "}
          <span className="font-medium text-foreground">{movie?.title}</span> has been saved.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Overall rating: {averageRating} / 5.0 (auto-calculated)
        </p>
        <div className="mt-6 flex gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard">Rate more movies</Link>
          </Button>
          <Button asChild>
            <Link href="/recommendations">View recommendations</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to movies
          </Link>
        </Button>

        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted">
            <Film className="h-5 w-5 text-muted-foreground/50" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              {movie?.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {movie?.release_year && (
                <span className="text-sm text-muted-foreground">{movie.release_year}</span>
              )}
              {movie?.genres && (
                <span className="text-sm text-muted-foreground">· {movie.genres.replace(/\|/g, ", ")}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Multi-Criteria Rating</CardTitle>
            <CardDescription>
              Rate this movie across all five criteria. The overall rating is calculated automatically.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            {CRITERIA.map(({ key, label, description }) => (
              <div key={key} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                  <span className="min-w-[2rem] text-right text-sm font-semibold text-primary">
                    {ratings[key].toFixed(1)}
                  </span>
                </div>
                <Slider
                  min={1}
                  max={5}
                  step={0.5}
                  value={[ratings[key]]}
                  onValueChange={([val]) =>
                    setRatings((prev) => ({ ...prev, [key]: val }))
                  }
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Poor (1)</span>
                  <span>Excellent (5)</span>
                </div>
              </div>
            ))}

            {/* Overall summary */}
            <div className="rounded-md bg-muted px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Overall Rating (auto-calculated)
                </span>
                <span className="text-lg font-bold text-primary">{averageRating} / 5.0</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Average of your five criterion scores
              </p>
            </div>

            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Rating"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
