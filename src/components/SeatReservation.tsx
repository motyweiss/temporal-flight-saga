import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flight, Seat } from "@/types/booking";
import { Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface SeatReservationProps {
  flight: Flight;
  onConfirm: (seats: Seat[]) => void;
  onBack: () => void;
}

const SEAT_TIMEOUT = 15 * 60; // 15 minutes in seconds

const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const columns = ["A", "B", "C", "D", "E", "F"];
  
  for (let row = 1; row <= 20; row++) {
    for (const column of columns) {
      seats.push({
        id: `${row}${column}`,
        row,
        column,
        type: row <= 4 ? "business" : "economy",
        price: row <= 4 ? 200 : 50,
        isAvailable: Math.random() > 0.3, // 70% seats available
      });
    }
  }
  
  return seats;
};

const SeatReservation = ({ flight, onConfirm, onBack }: SeatReservationProps) => {
  const [seats] = useState<Seat[]>(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(SEAT_TIMEOUT);

  useEffect(() => {
    if (selectedSeats.length === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          toast({
            title: "Reservation Expired",
            description: "Your seat reservation has timed out. Please select seats again.",
            variant: "destructive",
          });
          setSelectedSeats([]);
          return SEAT_TIMEOUT;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedSeats.length]);

  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable) return;

    const isSelected = selectedSeats.find((s) => s.id === seat.id);
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
      // Reset timer on seat selection change
      setTimeRemaining(SEAT_TIMEOUT);
      toast({
        title: "Seat Reserved",
        description: `Seat ${seat.id} reserved for 15 minutes`,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Select Your Seats</h2>
        <p className="text-muted-foreground">
          Flight {flight.flightNumber} - {flight.departure} to {flight.arrival}
        </p>
      </div>

      {selectedSeats.length > 0 && (
        <Card className="p-6 mb-8 shadow-elegant border-2 border-warning">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Clock className="w-6 h-6 text-warning animate-pulse-glow" />
              <div>
                <div className="font-semibold text-lg">Reservation Timer</div>
                <div className="text-sm text-muted-foreground">
                  Seats will be released after timeout
                </div>
              </div>
            </div>
            <div className="text-4xl font-bold text-warning">
              {formatTime(timeRemaining)}
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6 shadow-card">
            <div className="mb-6 flex justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded border-2 border-border bg-background" />
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-primary" />
                <span className="text-sm">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-muted" />
                <span className="text-sm">Occupied</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((row) => (
                  <div key={row} className="flex items-center gap-2 mb-2">
                    <div className="w-8 text-sm font-semibold text-muted-foreground text-right">
                      {row}
                    </div>
                    {["A", "B", "C", "D", "E", "F"].map((column) => {
                      const seat = seats.find((s) => s.row === row && s.column === column);
                      const isSelected = selectedSeats.find((s) => s.id === seat?.id);
                      
                      return (
                        <button
                          key={column}
                          onClick={() => seat && handleSeatClick(seat)}
                          disabled={!seat?.isAvailable}
                          className={cn(
                            "w-10 h-10 rounded border-2 transition-all duration-200 text-xs font-semibold",
                            !seat?.isAvailable && "bg-muted cursor-not-allowed",
                            seat?.isAvailable && !isSelected && "border-border hover:border-primary hover:scale-110",
                            isSelected && "bg-primary text-primary-foreground border-primary scale-110"
                          )}
                        >
                          {column}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 shadow-card sticky top-4">
            <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <div className="text-sm text-muted-foreground">Selected Seats</div>
                <div className="font-semibold">
                  {selectedSeats.length === 0 ? "None" : selectedSeats.map((s) => s.id).join(", ")}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Seat Price</div>
                <div className="font-semibold">${totalPrice}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Flight Price</div>
                <div className="font-semibold">${flight.price}</div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-2xl font-bold text-primary">
                  ${totalPrice + flight.price}
                </div>
              </div>
            </div>

            {selectedSeats.length === 0 && (
              <div className="flex items-start gap-2 p-4 rounded bg-muted mb-4">
                <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Please select at least one seat to continue
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Button
                className="w-full gradient-primary"
                size="lg"
                disabled={selectedSeats.length === 0}
                onClick={() => onConfirm(selectedSeats)}
              >
                Continue to Review
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={onBack}
              >
                Back to Flights
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SeatReservation;
