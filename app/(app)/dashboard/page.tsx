"use client"

import { useState, useEffect } from "react"
import { Search, Loader2, Film, ArrowRight, Clapperboard } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { fetchMovies, type Movie } from "@/lib/api"

export default function DashboardPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialLoad, setInitialLoad] = useState(true)

  const PAGE_SIZE = 24

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchMovies(search || undefined, page, PAGE_SIZE)
        if (!cancelled) {
          setMovies(data.movies)
          setTotal(data.total)
          setInitialLoad(false)
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load movies. Make sure the backend is running.")
          setInitialLoad(false)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    const delay = initialLoad ? 0 : 400
    const timer = setTimeout(load, delay)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Movie Database
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse and rate movies to improve your personalised recommendations
        </p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search movies by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
      </div>

      {!loading && !error && (
        <p className="mb-4 text-xs text-muted-foreground">
          Showing {movies.length} of {total} movies
          {search && ` matching "${search}"`}
        </p>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 py-12">
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading movies...</span>
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {movies.map((movie) => (
            <Card key={movie.movie_id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Clapperboard className="h-4 w-4 text-muted-foreground/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-serif text-sm font-semibold text-card-foreground">
                    {movie.title}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    {movie.release_year && (
                      <span className="text-xs text-muted-foreground">{movie.release_year}</span>
                    )}
                    {movie.genres && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {movie.genres.split("|")[0]}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button asChild variant="outline" size="sm" className="shrink-0">
                  <Link href={`/rate/${movie.movie_id}`}>
                    Rate
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && movies.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <Film className="mb-3 h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">No movies found</p>
          <p className="mt-1 text-xs text-muted-foreground">Try adjusting your search</p>
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}