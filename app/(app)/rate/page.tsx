import Link from "next/link"
import { mockMovies } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clapperboard, Star, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function RateIndexPage() {
  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Rate Movies
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a movie to provide multi-criteria ratings
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {mockMovies.map((movie) => (
          <Card key={movie.id} className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted">
                <Clapperboard className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-sm font-semibold text-card-foreground">
                    {movie.title}
                  </h3>
                  <Badge variant="secondary" className="text-[10px]">
                    {movie.genre}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{movie.year}</span>
                  <span>&middot;</span>
                  <span className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    {movie.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/rate/${movie.id}`}>
                  Rate
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
