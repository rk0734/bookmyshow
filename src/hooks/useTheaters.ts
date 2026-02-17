import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Theater {
  id: string;
  name: string;
  location: string;
  total_screens: number;
}

export interface Showtime {
  id: string;
  movie_id: string;
  theater_id: string;
  show_date: string;
  show_time: string;
  screen_number: number;
  available_seats: number;
  price: number;
}

export interface TheaterWithShowtimes extends Theater {
  showtimes: Showtime[];
}

export const useTheatersForMovie = (movieId: string | undefined, date: string) => {
  return useQuery({
    queryKey: ["theaters-showtimes", movieId, date],
    queryFn: async () => {
      // Get showtimes for this movie on this date
      const { data: showtimes, error: stError } = await supabase
        .from("showtimes")
        .select("*")
        .eq("movie_id", movieId!)
        .eq("show_date", date)
        .order("show_time", { ascending: true });

      if (stError) throw stError;

      // Get unique theater ids
      const theaterIds = [...new Set((showtimes || []).map((s: any) => s.theater_id))];
      if (theaterIds.length === 0) return [] as TheaterWithShowtimes[];

      const { data: theaters, error: tError } = await supabase
        .from("theaters")
        .select("*")
        .in("id", theaterIds);

      if (tError) throw tError;

      // Group showtimes by theater
      return (theaters || []).map((theater: any) => ({
        ...theater,
        showtimes: (showtimes || []).filter((s: any) => s.theater_id === theater.id),
      })) as TheaterWithShowtimes[];
    },
    enabled: !!movieId && !!date,
  });
};
