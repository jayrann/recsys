import Link from "next/link"
import { Star, Calendar, Clapperboard } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Movie } from "@/lib/mock-data"

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative aspect-[2/3] w-full bg-muted">
        <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
          <Clapperboard className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-muted-foreground">{movie.title}</p>
        </div>
        <Badge className="absolute right-2 top-2 bg-accent text-accent-foreground">
          {movie.genre}
        </Badge>
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-balance font-serif text-base font-semibold leading-tight text-card-foreground">
          {movie.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {movie.year}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-accent text-accent" />
            {movie.rating.toFixed(1)}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {movie.description}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/rate/${movie.id}`}>Rate This Movie</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
