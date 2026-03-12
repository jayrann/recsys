import Link from "next/link"
import { Film, ArrowRight, Brain, BarChart3, Dna } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-primary" />
            <span className="font-serif text-lg font-semibold text-foreground">
              MC-RecSys
            </span>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5">
            <Dna className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              Final Year Project
            </span>
          </div>

          <h1 className="text-balance font-serif text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
            Multi-Criteria Movie Recommender System
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            An intelligent recommendation engine that evaluates movies across
            multiple criteria using an Adaptive Genetic Algorithm to deliver
            personalized suggestions.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/login">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">Explore Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mx-auto mt-16 grid max-w-3xl gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-5">
            <BarChart3 className="mb-3 h-6 w-6 text-primary" />
            <h3 className="font-serif text-sm font-semibold text-card-foreground">
              Multi-Criteria Rating
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Rate movies on storyline, acting, visuals, and soundtrack for
              fine-grained preference modeling.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <Dna className="mb-3 h-6 w-6 text-primary" />
            <h3 className="font-serif text-sm font-semibold text-card-foreground">
              Adaptive Genetic Algorithm
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Evolutionary optimization adapts to user preferences and improves
              recommendation accuracy over time.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <Brain className="mb-3 h-6 w-6 text-primary" />
            <h3 className="font-serif text-sm font-semibold text-card-foreground">
              Personalized Results
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Get top-5 movie recommendations tailored to your unique
              multi-dimensional taste profile.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <p className="text-center text-xs text-muted-foreground">
          MC-RecSys &mdash; Multi-Criteria Movie Recommender System using
          Adaptive Genetic Algorithm. A Final Year Project.
        </p>
      </footer>
    </div>
  )
}
