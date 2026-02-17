import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/hooks/useBookings";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Clock, Ticket, Film } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";

const Bookings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: bookings, isLoading, error } = useBookings();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "paid":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "expired":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                My Bookings
              </h1>
              <p className="text-muted-foreground">
                View and manage your movie bookings
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="bg-card">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Skeleton className="w-24 h-36 rounded-lg" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive">Failed to load bookings. Please try again.</p>
            </div>
          )}

          {!isLoading && !error && bookings && (
            <>
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="bg-card overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          {/* Movie Poster */}
                          <div className="sm:w-32 h-48 sm:h-auto flex-shrink-0">
                            <img
                              src={(booking as any).movies?.poster_url || "/placeholder.svg"}
                              alt={(booking as any).movies?.title || "Movie"}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Booking Details */}
                          <div className="flex-1 p-6 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <div>
                                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                                  <Film className="w-4 h-4 text-primary" />
                                  {(booking as any).movies?.title || "Unknown Movie"}
                                </h3>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {(booking as any).movies?.genres?.slice(0, 3).map((genre: string) => (
                                    <span
                                      key={genre}
                                      className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded"
                                    >
                                      {genre}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className={getStatusColor(booking.status)}
                              >
                                {booking.status?.toUpperCase() || "PENDING"}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {format(new Date(booking.show_date), "MMM d, yyyy")}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{booking.show_time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Ticket className="w-4 h-4" />
                                <span>{booking.seats_count} Ticket(s)</span>
                              </div>
                              <div className="text-primary font-semibold">
                                ₹{Number(booking.total_amount).toFixed(2)}
                              </div>
                            </div>

                            {booking.payment_id && (
                              <p className="text-xs text-muted-foreground">
                                Payment ID: {booking.payment_id}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Ticket className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No bookings yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start by booking tickets for your favorite movies!
                  </p>
                  <Button onClick={() => navigate("/")}>
                    Browse Movies
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Bookings;
