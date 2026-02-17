import Header from "@/components/Header";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import MovieListings from "@/components/MovieListings";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 md:pt-20">
        <FeaturedCarousel />
        <MovieListings />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
