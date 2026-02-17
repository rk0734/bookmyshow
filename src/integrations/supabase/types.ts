export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string
          id: string
          movie_id: string
          payment_id: string | null
          seats_count: number
          show_date: string
          show_time: string
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          movie_id: string
          payment_id?: string | null
          seats_count?: number
          show_date: string
          show_time: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          movie_id?: string
          payment_id?: string | null
          seats_count?: number
          show_date?: string
          show_time?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
      movies: {
        Row: {
          available_seats: number | null
          backdrop_url: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          genres: string[] | null
          id: string
          language: string | null
          poster_url: string
          price_per_ticket: number | null
          rating: number | null
          release_date: string | null
          status: Database["public"]["Enums"]["movie_status"] | null
          title: string
          updated_at: string
          votes_count: number | null
        }
        Insert: {
          available_seats?: number | null
          backdrop_url?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          genres?: string[] | null
          id?: string
          language?: string | null
          poster_url: string
          price_per_ticket?: number | null
          rating?: number | null
          release_date?: string | null
          status?: Database["public"]["Enums"]["movie_status"] | null
          title: string
          updated_at?: string
          votes_count?: number | null
        }
        Update: {
          available_seats?: number | null
          backdrop_url?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          genres?: string[] | null
          id?: string
          language?: string | null
          poster_url?: string
          price_per_ticket?: number | null
          rating?: number | null
          release_date?: string | null
          status?: Database["public"]["Enums"]["movie_status"] | null
          title?: string
          updated_at?: string
          votes_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      showtimes: {
        Row: {
          available_seats: number
          created_at: string
          id: string
          movie_id: string
          price: number
          screen_number: number
          show_date: string
          show_time: string
          theater_id: string
        }
        Insert: {
          available_seats?: number
          created_at?: string
          id?: string
          movie_id: string
          price?: number
          screen_number?: number
          show_date: string
          show_time: string
          theater_id: string
        }
        Update: {
          available_seats?: number
          created_at?: string
          id?: string
          movie_id?: string
          price?: number
          screen_number?: number
          show_date?: string
          show_time?: string
          theater_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "showtimes_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showtimes_theater_id_fkey"
            columns: ["theater_id"]
            isOneToOne: false
            referencedRelation: "theaters"
            referencedColumns: ["id"]
          },
        ]
      }
      theaters: {
        Row: {
          created_at: string
          id: string
          location: string
          name: string
          total_screens: number
        }
        Insert: {
          created_at?: string
          id?: string
          location: string
          name: string
          total_screens?: number
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          name?: string
          total_screens?: number
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          favorite_genres: string[] | null
          id: string
          notifications_enabled: boolean | null
          preferred_language: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          favorite_genres?: string[] | null
          id?: string
          notifications_enabled?: boolean | null
          preferred_language?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          favorite_genres?: string[] | null
          id?: string
          notifications_enabled?: boolean | null
          preferred_language?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status: "pending" | "paid" | "cancelled" | "expired"
      movie_status: "now_showing" | "coming_soon" | "ended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: ["pending", "paid", "cancelled", "expired"],
      movie_status: ["now_showing", "coming_soon", "ended"],
    },
  },
} as const
