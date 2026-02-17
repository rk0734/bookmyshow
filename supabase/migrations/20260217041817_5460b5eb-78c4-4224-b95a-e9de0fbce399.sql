
-- Create theaters table
CREATE TABLE public.theaters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  total_screens INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.theaters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Theaters are viewable by everyone"
ON public.theaters FOR SELECT USING (true);

-- Create showtimes table linking movies to theaters
CREATE TABLE public.showtimes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  theater_id UUID NOT NULL REFERENCES public.theaters(id) ON DELETE CASCADE,
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  screen_number INTEGER NOT NULL DEFAULT 1,
  available_seats INTEGER NOT NULL DEFAULT 100,
  price NUMERIC NOT NULL DEFAULT 250.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.showtimes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Showtimes are viewable by everyone"
ON public.showtimes FOR SELECT USING (true);

-- Seed theaters
INSERT INTO public.theaters (name, location) VALUES
  ('PVR Cinemas - Phoenix Mall', 'Lower Parel, Mumbai'),
  ('INOX - R City Mall', 'Ghatkopar, Mumbai'),
  ('Cinépolis - Viviana Mall', 'Thane, Mumbai'),
  ('PVR ICON - Infinity Mall', 'Andheri West, Mumbai'),
  ('Carnival Cinemas - IMAX', 'Wadala, Mumbai');

-- Seed showtimes for all movies across theaters (next 7 days)
INSERT INTO public.showtimes (movie_id, theater_id, show_date, show_time, screen_number, available_seats, price)
SELECT
  m.id,
  t.id,
  CURRENT_DATE + d.day_offset,
  s.time_val::TIME,
  (ROW_NUMBER() OVER (PARTITION BY m.id, t.id, d.day_offset ORDER BY s.time_val))::INTEGER,
  80 + (RANDOM() * 40)::INTEGER,
  COALESCE(m.price_per_ticket, 250)
FROM public.movies m
CROSS JOIN public.theaters t
CROSS JOIN (VALUES (0),(1),(2),(3),(4),(5),(6)) AS d(day_offset)
CROSS JOIN (VALUES ('10:00'),('13:30'),('16:45'),('19:00'),('21:30')) AS s(time_val)
WHERE m.status = 'now_showing';
