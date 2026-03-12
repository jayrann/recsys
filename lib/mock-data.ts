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

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    year: 1994,
    genre: "Drama",
    director: "Frank Darabont",
    rating: 4.7,
    poster: "/posters/shawshank.jpg",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
  },
  {
    id: 2,
    title: "Inception",
    year: 2010,
    genre: "Sci-Fi",
    director: "Christopher Nolan",
    rating: 4.5,
    poster: "/posters/inception.jpg",
    description:
      "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
  },
  {
    id: 3,
    title: "The Dark Knight",
    year: 2008,
    genre: "Action",
    director: "Christopher Nolan",
    rating: 4.6,
    poster: "/posters/dark-knight.jpg",
    description:
      "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest tests.",
  },
  {
    id: 4,
    title: "Forrest Gump",
    year: 1994,
    genre: "Drama",
    director: "Robert Zemeckis",
    rating: 4.4,
    poster: "/posters/forrest-gump.jpg",
    description:
      "The presidencies of Kennedy and Johnson through the eyes of an Alabama man with an IQ of 75.",
  },
  {
    id: 5,
    title: "The Matrix",
    year: 1999,
    genre: "Sci-Fi",
    director: "Lana Wachowski",
    rating: 4.3,
    poster: "/posters/matrix.jpg",
    description:
      "A computer programmer discovers that reality as he knows it is a simulation created by machines.",
  },
  {
    id: 6,
    title: "Pulp Fiction",
    year: 1994,
    genre: "Thriller",
    director: "Quentin Tarantino",
    rating: 4.5,
    poster: "/posters/pulp-fiction.jpg",
    description:
      "The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine in four tales of violence.",
  },
  {
    id: 7,
    title: "Spirited Away",
    year: 2001,
    genre: "Animation",
    director: "Hayao Miyazaki",
    rating: 4.6,
    poster: "/posters/spirited-away.jpg",
    description:
      "During her family's move, a young girl enters the world of gods, witches, and spirits.",
  },
  {
    id: 8,
    title: "The Grand Budapest Hotel",
    year: 2014,
    genre: "Comedy",
    director: "Wes Anderson",
    rating: 4.2,
    poster: "/posters/grand-budapest.jpg",
    description:
      "A writer encounters the owner of an aging high-class hotel, who tells of his early years.",
  },
  {
    id: 9,
    title: "Interstellar",
    year: 2014,
    genre: "Sci-Fi",
    director: "Christopher Nolan",
    rating: 4.5,
    poster: "/posters/interstellar.jpg",
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  },
  {
    id: 10,
    title: "Pride and Prejudice",
    year: 2005,
    genre: "Romance",
    director: "Joe Wright",
    rating: 4.1,
    poster: "/posters/pride-prejudice.jpg",
    description:
      "Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy.",
  },
  {
    id: 11,
    title: "Fight Club",
    year: 1999,
    genre: "Thriller",
    director: "David Fincher",
    rating: 4.4,
    poster: "/posters/fight-club.jpg",
    description:
      "An insomniac office worker and a devil-may-care soap maker form an underground fight club.",
  },
  {
    id: 12,
    title: "Toy Story",
    year: 1995,
    genre: "Animation",
    director: "John Lasseter",
    rating: 4.3,
    poster: "/posters/toy-story.jpg",
    description:
      "A cowboy doll is profoundly threatened when a new spaceman action figure supplants him as top toy.",
  },
]

export const mockRecommendations: Recommendation[] = [
  {
    id: 1,
    movie: mockMovies[1],
    predictedRating: 4.8,
    matchScore: 96,
  },
  {
    id: 2,
    movie: mockMovies[8],
    predictedRating: 4.6,
    matchScore: 93,
  },
  {
    id: 3,
    movie: mockMovies[6],
    predictedRating: 4.5,
    matchScore: 89,
  },
  {
    id: 4,
    movie: mockMovies[0],
    predictedRating: 4.4,
    matchScore: 85,
  },
  {
    id: 5,
    movie: mockMovies[4],
    predictedRating: 4.2,
    matchScore: 82,
  },
]
