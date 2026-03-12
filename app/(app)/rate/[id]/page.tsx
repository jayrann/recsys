"use client"

import { useState } from "react"
import { use } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Clapperboard, Calendar, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RatingSlider } from "@/components/rating-slider"
import { mockMovies } from "@/lib/mock-data"

const CRITERIA = [
  {
    key: "storyline",
    label: "Storyline",
    description: "Plot coherence, narrative depth, and storytelling quality",
  },
  {
    key: "acting",
    label: "Acting",
    description: "Performance quality, character portrayal, and emotional range",
  },
  {
    key: "visuals",
    label: "Visuals",
    description: "Cinematography, visual effects, and art direction",
  },
  {
    key: "soundtrack",
    label: "Soundtrack",
    description: "Musical score, sound design, and audio quality",
  },
] as const

interface PageProps {
  params: Promise<{ id: string }>
}

export default function MovieRatingPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const movie = mockMovies.find((m) => m.id === Number(resolvedParams.id))

  const [ratings, setRatings] = useState({
    storyline: 3,
    acting: 3,
    visuals: 3,
    soundtrack: 3,
  })

  const [submitted, setSubmitted] = useState(false)

  function handleChange(key: string, value: number) {
    setRatings((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit() {
    setSubmitted(true)
  }

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <p className="text-sm text-muted-foreground">Movie not found</p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    )
  }

  const averageRating =
    Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length

  return (
    <div className="px-4 py-6 lg:px-8">
      {/* Back link */}
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/dashboard">
          <ArrowLeft className="mr-1 h-3 w-3" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="mx-auto max-w-2xl">
        {/* Movie info */}
        <Card className="mb-6">
          <CardContent className="flex gap-4 p-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-muted">
              <Clapperboard className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-balance font-serif text-xl font-bold text-card-foreground">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {movie.year}
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  {movie.genre}
                </Badge>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  {movie.rating.toFixed(1)}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {movie.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rating form */}
        {!submitted ? (
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">
                Multi-Criteria Rating
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Rate this movie on each criterion from 1 (poor) to 5 (excellent)
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {CRITERIA.map((c) => (
                <RatingSlider
                  key={c.key}
                  label={c.label}
                  description={c.description}
                  value={ratings[c.key]}
                  onChange={(v) => handleChange(c.key, v)}
                />
              ))}

              <div className="mt-2 flex items-center justify-between rounded-md border border-border bg-muted px-4 py-3">
                <span className="text-sm font-medium text-foreground">
                  Average Rating
                </span>
                <span className="text-lg font-bold text-primary">
                  {averageRating.toFixed(1)}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    / 5
                  </span>
                </span>
              </div>

              <Button onClick={handleSubmit} size="lg" className="mt-2 w-full">
                Submit Rating
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <Check className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="font-serif text-lg font-semibold text-card-foreground">
                Rating Submitted
              </h2>
              <p className="text-center text-sm text-muted-foreground">
                Your multi-criteria rating for{" "}
                <span className="font-medium text-card-foreground">
                  {movie.title}
                </span>{" "}
                has been recorded.
              </p>
              <div className="mt-2 flex gap-3">
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard">Browse More</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/recommendations">View Recommendations</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
