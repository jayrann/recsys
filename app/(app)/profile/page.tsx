"use client"

import { useState, useEffect, useRef } from "react"
import { User, Star, BarChart3, Loader2, Film, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  fetchProfile,
  getUserId,
  type UserProfile,
  type WeightProfile,
} from "@/lib/api"
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

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    const userId = getUserId()
    if (!userId) {
      router.replace("/login")
      return
    }
    fetchProfile(userId)
      .then(setProfile)
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-6 lg:px-8">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your preference profile and rating history
        </p>
      </div>

      {/* User Info Card */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <User className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-serif text-lg font-bold text-foreground">
              {profile?.username ?? `User ${profile?.user_id}`}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground truncate">
                {profile?.email ?? "No email on record"}
              </p>
            </div>
            <Badge variant="secondary" className="mt-2 text-xs">
              User ID: {profile?.user_id}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Movies Rated</p>
              <p className="text-xl font-bold text-foreground">
                {profile?.total_ratings ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">AGA Generations</p>
              <p className="text-xl font-bold text-foreground">
                {profile?.aga_generations ?? "—"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Best MAE</p>
              <p className="text-xl font-bold text-foreground">
                {profile?.aga_mae !== null && profile?.aga_mae !== undefined
                  ? profile.aga_mae.toFixed(4)
                  : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weight Profile */}
      {profile?.weight_profile && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-serif text-sm">
              <BarChart3 className="h-4 w-4 text-primary" />
              Your Personalised Criterion Weights
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-0">
            {(
              Object.entries(profile.weight_profile) as [
                keyof WeightProfile,
                number,
              ][]
            ).map(([key, value]) => (
              <WeightBar key={key} label={WEIGHT_LABELS[key]} value={value} />
            ))}
            <p className="mt-1 text-xs text-muted-foreground">
              Learned from your rating history by the Adaptive Genetic
              Algorithm. Rate more movies to refine these weights.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recent Ratings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-sm">
            <Film className="h-4 w-4 text-primary" />
            Recent Ratings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!profile?.recent_ratings || profile.recent_ratings.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No ratings yet. Go rate some movies!
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {profile.recent_ratings.map((r) => (
                <div
                  key={r.movie_id}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                >
                  <span className="text-sm text-foreground">
                    Movie ID: {r.movie_id}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    <span className="text-sm font-semibold">
                      {Number(r.overall_rating).toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">/ 5</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}