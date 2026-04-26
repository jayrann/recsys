// mock-data.ts
// ============
// This file is kept for backwards compatibility only.
// All real data now comes from lib/api.ts connected to the FastAPI backend.
// The mock data below is no longer used by any page.

export interface Movie {
  id: number
  title: string
  year: number
  genre: string
  director: string
  rating: number
  poster: string
  description: string
}

export interface Recommendation {
  id: number
  movie: Movie
  predictedRating: number
  matchScore: number
}

export const GENRES = [
  "All",
  "Action",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Thriller",
  "Romance",
  "Animation",
] as const

// No longer used — real movies come from GET /movies
export const mockMovies: Movie[] = []

// No longer used — real recommendations come from GET /recommendations/{user_id}
export const mockRecommendations: Recommendation[] = []