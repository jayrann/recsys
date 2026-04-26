"use client"

import { useState, useEffect, useRef } from "react"
import {
  BarChart3,
  Users,
  Film,
  Star,
  Database,
  RefreshCw,
  Loader2,
  Trash2,
  Plus,
  Brain,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  fetchAdminStats,
  triggerRetrain,
  type AdminStats,
} from "@/lib/api"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

function getAuthHeaders() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("mcrs_token")
      : null
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

interface User {
  user_id: number
  username: string
  email: string
  role: string
  is_active: boolean
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [retraining, setRetraining] = useState(false)
  const [retrainMsg, setRetrainMsg] = useState<string | null>(null)
  const [deactivating, setDeactivating] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Add movie form
  const [movieId, setMovieId] = useState("")
  const [movieTitle, setMovieTitle] = useState("")
  const [movieYear, setMovieYear] = useState("")
  const [movieGenres, setMovieGenres] = useState("")
  const [addingMovie, setAddingMovie] = useState(false)
  const [movieMsg, setMovieMsg] = useState<string | null>(null)

  const loadedRef = useRef(false)

  async function loadStats() {
    setLoadingStats(true)
    try {
      const data = await fetchAdminStats()
      setStats(data)
    } catch {
      setError("Failed to load stats. Make sure you are logged in as admin.")
    } finally {
      setLoadingStats(false)
    }
  }

  async function loadUsers() {
    setLoadingUsers(true)
    try {
      const res = await fetch(`${BASE_URL}/admin/users`, {
        headers: getAuthHeaders(),
      })
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setUsers(data.users || [])
    } catch {
      setUsers([])
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true
      loadStats()
      loadUsers()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleRetrain(userId?: number) {
    setRetraining(true)
    setRetrainMsg(null)
    try {
      const data = await triggerRetrain(userId)
      setRetrainMsg(data.message)
      loadStats()
    } catch {
      setRetrainMsg("Retraining failed.")
    } finally {
      setRetraining(false)
    }
  }

  async function handleDeactivate(userId: number) {
    setDeactivating(userId)
    try {
      await fetch(`${BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })
      setUsers((prev) => prev.filter((u) => u.user_id !== userId))
    } catch {
      setError("Failed to deactivate user.")
    } finally {
      setDeactivating(null)
    }
  }

  async function handleAddMovie(e: React.FormEvent) {
    e.preventDefault()
    if (!movieId || !movieTitle) {
      setMovieMsg("Movie ID and title are required.")
      return
    }
    setAddingMovie(true)
    setMovieMsg(null)
    try {
      const res = await fetch(`${BASE_URL}/admin/movies`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          movie_id: parseInt(movieId),
          title: movieTitle,
          release_year: movieYear ? parseInt(movieYear) : null,
          genres: movieGenres || null,
        }),
      })
      if (!res.ok) throw new Error("Failed")
      setMovieMsg("Movie saved successfully.")
      setMovieId("")
      setMovieTitle("")
      setMovieYear("")
      setMovieGenres("")
      loadStats()
    } catch {
      setMovieMsg("Failed to save movie.")
    } finally {
      setAddingMovie(false)
    }
  }

  return (
    <div className="px-4 py-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          System management and monitoring
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">
                {loadingStats ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  stats?.total_users ?? 0
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <Film className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Movies</p>
              <p className="text-2xl font-bold text-foreground">
                {loadingStats ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  stats?.total_movies ?? 0
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Ratings</p>
              <p className="text-2xl font-bold text-foreground">
                {loadingStats ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  stats?.total_ratings?.toLocaleString() ?? 0
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cached Profiles</p>
              <p className="text-2xl font-bold text-foreground">
                {loadingStats ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  stats?.cached_weight_profiles ?? 0
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Status */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-3 p-4">
          <Database className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              Database Status
            </p>
            <p className="text-xs text-muted-foreground">
              {stats?.database ?? "Checking..."}
            </p>
          </div>
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              stats?.database === "connected"
                ? "bg-green-500"
                : "bg-yellow-500"
            }`}
          />
        </CardContent>
      </Card>

      {/* Model Retraining */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-base">
            <RefreshCw className="h-4 w-4 text-primary" />
            Model Retraining
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-xs text-muted-foreground">
            Clearing weight profiles forces the AGA to re-run for users on
            their next recommendation request.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleRetrain()}
              disabled={retraining}
              variant="outline"
            >
              {retraining ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Retrain All Users
            </Button>
          </div>
          {retrainMsg && (
            <p className="text-xs text-muted-foreground">{retrainMsg}</p>
          )}
        </CardContent>
      </Card>

      {/* Add Movie */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-base">
            <Plus className="h-4 w-4 text-primary" />
            Add or Update Movie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddMovie} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="movie-id">Movie ID *</Label>
                <Input
                  id="movie-id"
                  type="number"
                  placeholder="e.g. 1683"
                  value={movieId}
                  onChange={(e) => setMovieId(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="movie-title">Title *</Label>
                <Input
                  id="movie-title"
                  type="text"
                  placeholder="e.g. Toy Story (1995)"
                  value={movieTitle}
                  onChange={(e) => setMovieTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="movie-year">Release Year</Label>
                <Input
                  id="movie-year"
                  type="number"
                  placeholder="e.g. 1995"
                  value={movieYear}
                  onChange={(e) => setMovieYear(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="movie-genres">Genres</Label>
                <Input
                  id="movie-genres"
                  type="text"
                  placeholder="e.g. Animation|Comedy|Children"
                  value={movieGenres}
                  onChange={(e) => setMovieGenres(e.target.value)}
                />
              </div>
            </div>
            {movieMsg && (
              <p
                className={`text-xs ${
                  movieMsg.includes("success")
                    ? "text-green-600"
                    : "text-destructive"
                }`}
              >
                {movieMsg}
              </p>
            )}
            <Button type="submit" disabled={addingMovie} className="w-fit">
              {addingMovie ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Save Movie
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-serif text-base">
              <Users className="h-4 w-4 text-primary" />
              Registered Users
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={loadUsers}
              disabled={loadingUsers}
            >
              {loadingUsers ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingUsers ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No registered users found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                      ID
                    </th>
                    <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                      Username
                    </th>
                    <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                      Email
                    </th>
                    <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                      Role
                    </th>
                    <th className="pb-2 text-right text-xs font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.user_id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-2 text-xs text-muted-foreground">
                        {user.user_id}
                      </td>
                      <td className="py-2 font-medium text-foreground">
                        {user.username}
                      </td>
                      <td className="py-2 text-xs text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="py-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            user.role === "admin"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-2 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeactivate(user.user_id)}
                          disabled={deactivating === user.user_id}
                          className="text-destructive hover:text-destructive"
                        >
                          {deactivating === user.user_id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}