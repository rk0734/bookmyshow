import { useState } from "react";
import { format, addDays } from "date-fns";
import { Movie } from "@/hooks/useMovies";
import { useTheatersForMovie, Showtime } from "@/hooks/useTheaters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar } from "lucide-react";

interface TheaterSelectionProps {
  movie: Movie;
  onSelectShowtime: (showtime: Showtime, theaterName: string) => void;
  onClose: () => void;
}

const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

const TheaterSelection = ({ movie, onSelectShowtime, onClose }: TheaterSelectionProps) => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const { data: theaters, isLoading } = useTheatersForMovie(movie.id, selectedDate);

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
        {dates.map((date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const isSelected = dateStr === selectedDate;
          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0 ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/20"
              }`}
            >
              <span>{format(date, "EEE")}</span>
              <span className="text-sm font-bold">{format(date, "d")}</span>
              <span>{format(date, "MMM")}</span>
            </button>
          );
        })}
      </div>

      {/* Theater List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : theaters && theaters.length > 0 ? (
        <div className="space-y-5">
          {theaters.map((theater) => (
            <div
              key={theater.id}
              className="border border-border rounded-lg p-4 space-y-3"
            >
              <div>
                <h3 className="font-semibold text-foreground">{theater.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {theater.location}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {theater.showtimes.map((st) => (
                  <Button
                    key={st.id}
                    variant="outline"
                    size="sm"
                    className="text-primary border-primary/40 hover:bg-primary hover:text-primary-foreground"
                    onClick={() => onSelectShowtime(st, theater.name)}
                  >
                    {st.show_time.slice(0, 5)}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                From ₹{Math.min(...theater.showtimes.map((s) => Number(s.price)))}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No shows available on this date.
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default TheaterSelection;
