/**
 * api.ts
 * ======
 * All API calls to the MCRS FastAPI backend.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface Movie {
  movie_id: number
  title: string
  release_year: number | null
  genres: string | null
}

export interface Recommendation {
  movie_id: number
  title: string
  predicted_score: number
}

export interface WeightProfile {
  w1_storyline: number
  w2_acting: number
  w3_visuals: number
  w4_emotional: number
  w5_enjoyment: number
}

export interface RecommendationResponse {
  user_id: number
  neighbours_found: number
  recommendations: Recommendation[]
  weight_profile: WeightProfile
}

export interface UserProfile {
  user_id: number
  total_ratings: number
  weight_profile: WeightProfile
  aga_mae: number | null
  aga_generations: number | null
  recent_ratings: { movie_id: number; overall_rating: number }[]
}

export interface AdminStats {
  total_users: number
  total_movies: number
  total_ratings: number
  cached_weight_profiles: number
  dataset_loaded: boolean
  database: string
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("mcrs_token")
}

export function getUserId(): number | null {
  if (typeof window === "undefined") return null
  const id = localStorage.getItem("mcrs_user_id")
  return id ? parseInt(id) : null
}

export function saveAuth(token: string, userId: number, role: string = "user") {
  localStorage.setItem("mcrs_token", token)
  localStorage.setItem("mcrs_user_id", String(userId))
  localStorage.setItem("mcrs_role", role)
}



export function clearAuth() {
  localStorage.removeItem("mcrs_token")
  localStorage.removeItem("mcrs_user_id")
  localStorage.removeItem("mcrs_role")
}

function authHeaders(): HeadersInit {
  const token = getToken()
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

export async function register(
  username: string,
  email: string,
  password: string
): Promise<{ user_id: number; username: string; message: string }> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, role: "user" }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || "Registration failed")
  }
  return res.json()
}

export async function login(
  username: string,
  password: string
): Promise<{ access_token: string; user_id: number; role: string }> {
  const form = new URLSearchParams()
  form.append("username", username)
  form.append("password", password)

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || "Login failed")
  }
  return res.json()
}

// ─────────────────────────────────────────────────────────────────────────────
// MOVIES ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchMovies(
  title?: string,
  page = 1,
  pageSize = 50
): Promise<{ total: number; movies: Movie[] }> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  })
  if (title) params.append("title", title)

  const res = await fetch(`${BASE_URL}/movies?${params}`)
  if (!res.ok) throw new Error("Failed to fetch movies")
  return res.json()
}

export async function fetchMovie(movieId: number): Promise<Movie> {
  const res = await fetch(`${BASE_URL}/movies/${movieId}`)
  if (!res.ok) throw new Error("Movie not found")
  return res.json()
}

// ─────────────────────────────────────────────────────────────────────────────
// RATINGS ENDPOINT
// ─────────────────────────────────────────────────────────────────────────────

export async function submitRating(
  movieId: number,
  ratings: {
    storyline: number
    acting: number
    visuals: number
    emotional_impact: number
    enjoyment: number
  }
): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/ratings`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ movie_id: movieId, ...ratings }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || "Failed to submit rating")
  }
  return res.json()
}

// ─────────────────────────────────────────────────────────────────────────────
// RECOMMENDATIONS ENDPOINT
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchRecommendations(
  userId: number
): Promise<RecommendationResponse> {
  const res = await fetch(`${BASE_URL}/recommendations/${userId}`, {
    headers: authHeaders(),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || "Failed to fetch recommendations")
  }
  return res.json()
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE ENDPOINT
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchProfile(userId: number): Promise<UserProfile> {
  const res = await fetch(`${BASE_URL}/profile/${userId}`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Failed to fetch profile")
  return res.json()
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await fetch(`${BASE_URL}/admin/stats`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Failed to fetch stats")
  return res.json()
}

export async function triggerRetrain(
  userId?: number
): Promise<{ message: string }> {
  const url = userId
    ? `${BASE_URL}/admin/retrain?user_id=${userId}`
    : `${BASE_URL}/admin/retrain`
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Retrain failed")
  return res.json()
}

export function getRole(): string {
  if (typeof window === "undefined") return "user"
  return localStorage.getItem("mcrs_role") || "user"
}