import { forwardRef } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie } from "@/hooks/useMovies";
import { format } from "date-fns";

interface MovieCardProps {
  movie: Movie;
  onBookNow: (movie: Movie) => void;
}

const MovieCard = forwardRef<HTMLDivElement, MovieCardProps>(
  ({ movie, onBookNow }, ref) => {
    const formattedVotes = movie.votes_count
      ? movie.votes_count >= 1000
        ? `${(movie.votes_count / 1000).toFixed(0)}K`
        : movie.votes_count.toString()
      : "0";

    const releaseDate = movie.release_date
      ? format(new Date(movie.release_date), "MMM d, yyyy")
      : "Coming Soon";

    return (
      <div ref={ref} className="movie-card group cursor-pointer">
        {/* Poster */}
        <div className="aspect-[2/3] relative overflow-hidden rounded-xl">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay on hover */}
          <div className="movie-overlay flex flex-col justify-end p-4">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={(e) => {
                e.stopPropagation();
                onBookNow(movie);
              }}
            >
              Book Now
            </Button>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 rating-badge">
            <Star className="w-3 h-3 fill-current" />
            <span>{movie.rating?.toFixed(1) || "N/A"}</span>
          </div>

          {/* Availability Badge */}
          {movie.available_seats !== null && movie.available_seats < 20 && (
            <div className="absolute top-3 left-3 bg-destructive/90 text-destructive-foreground text-xs px-2 py-1 rounded-full">
              {movie.available_seats} seats left
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-semibold text-foreground text-lg truncate mb-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          <div className="flex flex-wrap gap-1 mb-2">
            {movie.genres?.slice(0, 2).map((genre, index) => (
              <span key={genre} className="text-xs text-muted-foreground">
                {genre}
                {index < Math.min((movie.genres?.length || 0), 2) - 1 ? " •" : ""}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{releaseDate}</span>
            <span>{formattedVotes} votes</span>
          </div>
        </div>
      </div>
    );
  }
);

MovieCard.displayName = "MovieCard";

export default MovieCard;
