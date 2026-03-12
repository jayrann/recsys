"use client"

import { useState, useMemo } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MovieCard } from "@/components/movie-card"
import { mockMovies, GENRES } from "@/lib/mock-data"

export default function DashboardPage() {
  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState("All")
  const [sortBy, setSortBy] = useState("title")

  const filteredMovies = useMemo(() => {
    let movies = [...mockMovies]

    if (search) {
      const q = search.toLowerCase()
      movies = movies.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q)
      )
    }

    if (genre !== "All") {
      movies = movies.filter((m) => m.genre === genre)
    }

    if (sortBy === "title") {
      movies.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === "year") {
      movies.sort((a, b) => b.year - a.year)
    } else if (sortBy === "rating") {
      movies.sort((a, b) => b.rating - a.rating)
    }

    return movies
  }, [search, genre, sortBy])

  return (
    <div className="px-4 py-6 lg:px-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Movie Database
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse and rate movies to improve your recommendations
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or director..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-3">
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger className="w-36">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              {GENRES.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="year">Year</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <p className="mb-4 text-xs text-muted-foreground">
        Showing {filteredMovies.length} of {mockMovies.length} movies
      </p>

      {/* Movie grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <p className="text-sm font-medium text-muted-foreground">
            No movies found
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  )
}
