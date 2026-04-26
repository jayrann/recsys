"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Film, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { register } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{
    username?: string
    email?: string
    password?: string
    api?: string
  }>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors: typeof errors = {}
    if (!username || username.length < 3)
      newErrors.username = "Username must be at least 3 characters"
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address"
    if (!password || password.length < 6)
      newErrors.password = "Password must be at least 6 characters"
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      await register(username, email, password)
      router.replace("/login")
    } catch (err: unknown) {
      setErrors({
        api: err instanceof Error ? err.message : "Registration failed",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Film className="h-5 w-5 text-primary" />
            <span className="font-serif text-lg font-semibold text-foreground">
              MC-RecSys
            </span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-xl">Create Account</CardTitle>
            <CardDescription>
              Register to start getting personalised movie recommendations
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="flex flex-col gap-4">
              {errors.api && (
                <div className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {errors.api}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    if (errors.username)
                      setErrors((p) => ({ ...p, username: undefined }))
                  }}
                />
                {errors.username && (
                  <p className="text-xs text-destructive">{errors.username}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email)
                      setErrors((p) => ({ ...p, email: undefined }))
                  }}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password)
                        setErrors((p) => ({ ...p, password: undefined }))
                    }}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </p>
              <Button asChild variant="ghost" size="sm" className="w-full">
                <Link href="/">
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Back to Home
                </Link>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}