import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturedMovie {
  id: number;
  title: string;
  tagline: string;
  rating: number;
  duration: string;
  genres: string[];
  poster: string;
  backdrop: string;
}

const featuredMovies: FeaturedMovie[] = [
  {
    id: 1,
    title: "Dune: Part Two",
    tagline: "Long live the fighters",
    rating: 8.8,
    duration: "2h 46m",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    poster: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&h=800&fit=crop"
  },
  {
    id: 2,
    title: "Oppenheimer",
    tagline: "The world forever changes",
    rating: 8.5,
    duration: "3h 0m",
    genres: ["Biography", "Drama", "History"],
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=800&fit=crop"
  },
  {
    id: 3,
    title: "The Dark Knight",
    tagline: "Why so serious?",
    rating: 9.0,
    duration: "2h 32m",
    genres: ["Action", "Crime", "Drama"],
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1920&h=800&fit=crop"
  }
];

const FeaturedCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  const currentMovie = featuredMovies[currentIndex];

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${currentMovie.backdrop})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Movie Poster */}
          <div className="hidden md:block w-64 lg:w-80 shrink-0">
            <img
              src={currentMovie.poster}
              alt={currentMovie.title}
              className="w-full rounded-2xl shadow-2xl animate-float"
              style={{ boxShadow: "var(--shadow-glow)" }}
            />
          </div>

          {/* Movie Info */}
          <div className="text-center md:text-left max-w-2xl animate-fade-in">
            <span className="featured-badge mb-4 inline-block">Featured</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3">
              {currentMovie.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6 italic">
              "{currentMovie.tagline}"
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
              <div className="rating-badge">
                <Star className="w-4 h-4 fill-current" />
                <span>{currentMovie.rating}/10</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{currentMovie.duration}</span>
              </div>
              <div className="flex gap-2">
                {currentMovie.genres.map((genre) => (
                  <span key={genre} className="genre-tag">{genre}</span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8">
                Book Tickets
              </Button>
              <Button size="lg" variant="outline" className="border-border hover:bg-secondary">
                Watch Trailer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background/80 transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background/80 transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-primary w-8"
                : "bg-muted-foreground/50 hover:bg-muted-foreground"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedCarousel;
