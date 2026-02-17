import { useState } from "react";
import MovieCard from "./MovieCard";
import BookingDialog from "./BookingDialog";
import { useMovies, Movie } from "@/hooks/useMovies";
import { Skeleton } from "@/components/ui/skeleton";

const genres = ["All", "Action", "Comedy", "Drama", "Sci-Fi", "Animation", "Thriller", "Romance"];

const MovieListings = () => {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const { data: movies, isLoading, error } = useMovies(selectedGenre);

  const handleBookNow = (movie: Movie) => {
    setSelectedMovie(movie);
    setBookingOpen(true);
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Now Showing
            </h2>
            <p className="text-muted-foreground">
              Explore movies currently playing in theaters near you
            </p>
          </div>

          {/* Genre Filters */}
          <div className="flex flex-wrap gap-2">
            {genres.slice(0, 5).map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedGenre === genre
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-primary/20"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[2/3] rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load movies. Please try again.</p>
          </div>
        )}

        {/* Movie Grid */}
        {!isLoading && !error && movies && (
          <>
            {movies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onBookNow={handleBookNow}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No movies found for this genre.</p>
              </div>
            )}
          </>
        )}

        {/* See All Button */}
        <div className="text-center mt-10">
          <button className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            See All Movies
          </button>
        </div>
      </div>

      {/* Booking Dialog */}
      <BookingDialog
        movie={selectedMovie}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </section>
  );
};

export default MovieListings;
