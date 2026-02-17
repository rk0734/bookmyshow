import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type Movie = Tables<"movies">;

export const useMovies = (genre?: string) => {
  return useQuery({
    queryKey: ["movies", genre],
    queryFn: async () => {
      let query = supabase
        .from("movies")
        .select("*")
        .eq("status", "now_showing")
        .order("rating", { ascending: false });

      if (genre && genre !== "All") {
        query = query.contains("genres", [genre]);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useMovie = (id: string) => {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Movie | null;
    },
    enabled: !!id,
  });
};
