"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Clapperboard, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchMovies, type Movie } from "@/lib/api"

export default function RateIndexPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  const PAGE_SIZE = 20

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const data = await fetchMovies(search || undefined, page, PAGE_SIZE)
        if (!cancelled) {
          setMovies(data.movies)
          setTotal(data.total)
          setInitialLoad(false)
        }
      } catch {
        if (!cancelled) setInitialLoad(false)
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
          Rate Movies
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a movie to provide your multi-criteria rating
        </p>
      </div>

      {/* Search */}
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

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Loading movies...
          </span>
        </div>
      )}

      {/* Movie list */}
      {!loading && (
        <div className="flex flex-col gap-3">
          {movies.map((movie) => (
            <Card
              key={movie.movie_id}
              className="transition-shadow hover:shadow-md"
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Clapperboard className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif text-sm font-semibold text-card-foreground truncate">
                      {movie.title}
                    </h3>
                    {movie.genres && (
                      <Badge variant="secondary" className="text-[10px]">
                        {movie.genres.split("|")[0]}
                      </Badge>
                    )}
                  </div>
                  {movie.release_year && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {movie.release_year}
                    </p>
                  )}
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

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}