import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateBooking, useUpdateBookingStatus } from "@/hooks/useBookings";
import { useToast } from "@/hooks/use-toast";
import { Movie } from "@/hooks/useMovies";
import { Showtime } from "@/hooks/useTheaters";
import TheaterSelection from "./TheaterSelection";
import SeatMap from "./SeatMap";
import { CreditCard, Loader2, Ticket, CheckCircle, Smartphone, Landmark } from "lucide-react";
import { format } from "date-fns";

interface BookingDialogProps {
  movie: Movie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type BookingStep = "theater" | "details" | "seats" | "payment" | "confirmation";
type PaymentMethod = "credit" | "debit" | "upi";

const BookingDialog = ({ movie, open, onOpenChange }: BookingDialogProps) => {
  const [step, setStep] = useState<BookingStep>("theater");
  const [seatsCount, setSeatsCount] = useState(1);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedTheater, setSelectedTheater] = useState("");
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createBooking = useCreateBooking();
  const updateBookingStatus = useUpdateBookingStatus();

  const totalAmount = selectedShowtime ? seatsCount * Number(selectedShowtime.price) : 0;

  const resetDialog = () => {
    setStep("theater");
    setSeatsCount(1);
    setSelectedShowtime(null);
    setSelectedTheater("");
    setSelectedSeatIds([]);
    setPaymentMethod("upi");
    setBookingId(null);
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  const handleSelectShowtime = (showtime: Showtime, theaterName: string) => {
    setSelectedShowtime(showtime);
    setSelectedTheater(theaterName);
    setStep("details");
  };

  const handleProceedToSeats = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to book tickets.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    setStep("seats");
  };

  const handleSeatsConfirmed = async (seats: string[]) => {
    setSelectedSeatIds(seats);

    if (!movie || !selectedShowtime) return;

    try {
      const booking = await createBooking.mutateAsync({
        movie_id: movie.id,
        seats_count: seatsCount,
        total_amount: totalAmount,
        show_date: selectedShowtime.show_date,
        show_time: selectedShowtime.show_time,
        status: "pending",
      });

      setBookingId(booking.id);
      setStep("payment");
    } catch (error) {
      toast({
        title: "Booking failed",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive",
      });
    }
  };

  const handleMockPayment = async () => {
    if (!bookingId) return;
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const mockPaymentId = `PAY_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      await updateBookingStatus.mutateAsync({
        bookingId,
        status: "paid",
        paymentId: mockPaymentId,
      });
      setStep("confirmation");
      toast({
        title: "📧 Booking Confirmed!",
        description: `Your booking for ${movie?.title} has been confirmed. A confirmation email has been sent to your registered email address.`,
      });
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!movie) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Step 1: Theater & Showtime Selection */}
        {step === "theater" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" />
                Book Tickets
              </DialogTitle>
              <DialogDescription>
                {movie.title} • {movie.language} • {movie.duration_minutes} mins
              </DialogDescription>
            </DialogHeader>
            <h2 className="text-lg font-bold text-foreground mt-2">
              Theaters Showing {movie.title}
            </h2>
            <TheaterSelection
              movie={movie}
              onSelectShowtime={handleSelectShowtime}
              onClose={handleClose}
            />
          </>
        )}

        {/* Step 2: Ticket Count */}
        {step === "details" && selectedShowtime && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" />
                How Many Tickets?
              </DialogTitle>
              <DialogDescription>
                {movie.title} • {selectedTheater}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-secondary/50 rounded-lg p-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{format(new Date(selectedShowtime.show_date), "EEEE, MMM d")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{selectedShowtime.show_time.slice(0, 5)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Screen</span>
                  <span className="font-medium">Screen {selectedShowtime.screen_number}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Number of Tickets</Label>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" onClick={() => setSeatsCount(Math.max(1, seatsCount - 1))} disabled={seatsCount <= 1}>-</Button>
                  <Input type="number" value={seatsCount} onChange={(e) => setSeatsCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))} className="w-20 text-center" min={1} max={10} />
                  <Button variant="outline" size="icon" onClick={() => setSeatsCount(Math.min(10, seatsCount + 1))} disabled={seatsCount >= 10}>+</Button>
                </div>
                <p className="text-sm text-muted-foreground">{selectedShowtime.available_seats} seats available</p>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{seatsCount} ticket(s) × ₹{selectedShowtime.price}</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("theater")}>Back</Button>
              <Button onClick={handleProceedToSeats}>
                Select Seats
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Step 3: Seat Selection */}
        {step === "seats" && selectedShowtime && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" />
                Select Your Seats
              </DialogTitle>
              <DialogDescription>
                {movie.title} • {selectedTheater} • Screen {selectedShowtime.screen_number}
              </DialogDescription>
            </DialogHeader>

            <SeatMap
              totalSeats={120}
              availableSeats={selectedShowtime.available_seats}
              maxSelectable={seatsCount}
              onConfirm={handleSeatsConfirmed}
              onBack={() => setStep("details")}
            />
          </>
        )}

        {/* Step 4: Payment */}
        {step === "payment" && selectedShowtime && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment
              </DialogTitle>
              <DialogDescription>Complete your booking for {movie.title}</DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-5">
              {/* Booking Summary */}
              <div className="bg-secondary/50 rounded-lg p-4 space-y-2 text-sm">
                <h3 className="font-semibold text-foreground text-base mb-2">Booking Summary</h3>
                <div className="flex justify-between"><span className="text-muted-foreground">Movie</span><span className="font-medium">{movie.title}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Theater</span><span className="font-medium">{selectedTheater}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{format(new Date(selectedShowtime.show_date), "EEEE, MMM d")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{selectedShowtime.show_time.slice(0, 5)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Seats</span><span className="font-medium text-primary">{selectedSeatIds.join(", ")}</span></div>
                <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold"><span>Total</span><span className="text-primary">₹{totalAmount.toFixed(2)}</span></div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Select Payment Method</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                  className="space-y-2"
                >
                  <label
                    className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition-all ${
                      paymentMethod === "debit" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <RadioGroupItem value="debit" id="debit" />
                    <Landmark className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Debit Card</p>
                      <p className="text-xs text-muted-foreground">Pay using your bank debit card</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition-all ${
                      paymentMethod === "credit" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <RadioGroupItem value="credit" id="credit" />
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Credit Card</p>
                      <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition-all ${
                      paymentMethod === "upi" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <RadioGroupItem value="upi" id="upi" />
                    <Smartphone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">UPI</p>
                      <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              <p className="text-center text-xs text-muted-foreground">This is a mock payment simulation</p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => { setStep("seats"); setSelectedSeatIds([]); }}>Back</Button>
              <Button onClick={handleMockPayment} disabled={isProcessing}>
                {isProcessing ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>) : `Pay ₹${totalAmount.toFixed(2)}`}
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Step 5: Confirmation / Receipt */}
        {step === "confirmation" && selectedShowtime && (
          <>
            <DialogHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <DialogTitle>Booking Confirmed!</DialogTitle>
              <DialogDescription>Your tickets have been booked successfully</DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4 space-y-2 text-center">
                <h3 className="font-bold text-lg text-foreground">{movie.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedTheater}</p>
                <p className="text-muted-foreground">
                  {format(new Date(selectedShowtime.show_date), "EEEE, MMMM d, yyyy")} at {selectedShowtime.show_time.slice(0, 5)}
                </p>
                <p className="text-primary font-semibold">
                  Seats: {selectedSeatIds.join(", ")}
                </p>
                <div className="border-t pt-2 mt-2">
                  <p className="text-lg font-bold text-primary">₹{totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground capitalize">Paid via {paymentMethod === "upi" ? "UPI" : paymentMethod === "credit" ? "Credit Card" : "Debit Card"}</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full">Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
