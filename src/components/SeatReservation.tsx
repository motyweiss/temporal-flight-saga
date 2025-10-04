import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flight, Seat } from "@/types/booking";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Clock, AlertTriangle, Users, DollarSign, Armchair } from "lucide-react";
import {
  SEAT_RESERVATION_TIMEOUT,
  TIMER_WARNING_THRESHOLD,
  TIMER_CRITICAL_THRESHOLD,
  SEAT_ROWS,
  SEAT_COLUMNS,
  SEAT_PRICES,
  BUSINESS_CLASS_ROWS,
} from "@/constants/booking";

interface SeatReservationProps {
  flight: Flight;
  onConfirm: (seats: Seat[]) => void;
  onBack: () => void;
}

/**
 * Generate seat map for the aircraft
 */
const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  for (let row = 1; row <= SEAT_ROWS; row++) {
    for (const column of SEAT_COLUMNS) {
      const isBusinessClass = BUSINESS_CLASS_ROWS.includes(row);
      const type = isBusinessClass ? "business" : "economy";
      
      seats.push({
        id: `${row}${column}`,
        row,
        column,
        type,
        price: SEAT_PRICES[type],
        isAvailable: Math.random() > 0.3, // 70% seats available
      });
    }
  }
  return seats;
};

const SeatReservation = ({ flight, onConfirm, onBack }: SeatReservationProps) => {
  const [seats] = useState<Seat[]>(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(SEAT_RESERVATION_TIMEOUT);
  const [hasShownWarning, setHasShownWarning] = useState(false);
  const [hasShownCritical, setHasShownCritical] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-release seats and go back
          setSelectedSeats([]);
          toast({
            title: "Time Expired",
            description: "Your seat reservation time has expired. Please select your seats again.",
            variant: "destructive",
          });
          onBack();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onBack]);

  // Show warnings at thresholds
  useEffect(() => {
    if (timeRemaining === TIMER_WARNING_THRESHOLD && !hasShownWarning) {
      setHasShownWarning(true);
      toast({
        title: "Time Warning",
        description: "Only 1 minute remaining to complete your seat selection!",
        variant: "default",
      });
    }
    
    if (timeRemaining === TIMER_CRITICAL_THRESHOLD && !hasShownCritical) {
      setHasShownCritical(true);
      toast({
        title: "Critical: Time Running Out!",
        description: "Only 30 seconds left! Please complete your selection now.",
        variant: "destructive",
      });
    }
  }, [timeRemaining, hasShownWarning, hasShownCritical]);

  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable) {
      toast({
        title: "Seat Unavailable",
        description: "This seat is already taken. Please select another seat.",
        variant: "destructive",
      });
      return;
    }

    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.id === seat.id);
      if (isSelected) {
        toast({
          title: "Seat Deselected",
          description: `Seat ${seat.id} has been removed from your selection.`,
        });
        return prev.filter((s) => s.id !== seat.id);
      } else {
        toast({
          title: "Seat Selected",
          description: `Seat ${seat.id} added to your booking.`,
        });
        return [...prev, seat];
      }
    });
  };

  const handleConfirm = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No Seats Selected",
        description: "Please select at least one seat to continue.",
        variant: "destructive",
      });
      return;
    }
    onConfirm(selectedSeats);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (timeRemaining / SEAT_RESERVATION_TIMEOUT) * 100;
  const isWarning = timeRemaining <= TIMER_WARNING_THRESHOLD;
  const isCritical = timeRemaining <= TIMER_CRITICAL_THRESHOLD;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-3 animate-slide-up">
        <h2 className="text-4xl font-bold bg-gradient-magic bg-clip-text text-transparent">
          Select Your Seats
        </h2>
        <p className="text-muted-foreground text-lg">
          Flight {flight.flightNumber}: {flight.departure} → {flight.arrival}
        </p>
      </div>

      {/* Timer Card */}
      <Card className={cn(
        "shadow-lg border-2 transition-all duration-300 animate-slide-up",
        isCritical && "border-destructive bg-destructive/5 animate-pulse",
        isWarning && !isCritical && "border-warning bg-warning/5"
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                isCritical && "bg-destructive/20 animate-pulse",
                isWarning && !isCritical && "bg-warning/20",
                !isWarning && "bg-primary/20"
              )}>
                <Clock className={cn(
                  "w-6 h-6",
                  isCritical && "text-destructive",
                  isWarning && !isCritical && "text-warning",
                  !isWarning && "text-primary"
                )} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Time Remaining</div>
                <div className={cn(
                  "text-3xl font-bold font-mono transition-colors",
                  isCritical && "text-destructive",
                  isWarning && !isCritical && "text-warning",
                  !isWarning && "text-primary"
                )}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>
            {isWarning && (
              <Badge variant={isCritical ? "destructive" : "default"} className="flex items-center gap-2 text-base px-4 py-2">
                <AlertTriangle className="w-4 h-4" />
                {isCritical ? "Critical!" : "Hurry Up!"}
              </Badge>
            )}
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seat Map */}
        <Card className="lg:col-span-2 shadow-lg animate-slide-up" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Armchair className="w-6 h-6 text-primary" />
              Aircraft Seat Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-muted border-2" />
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-primary text-primary-foreground border-2 border-primary" />
                <span className="text-sm">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-muted-foreground/20 border-2" />
                <span className="text-sm">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-accent/20 border-2 border-accent" />
                <span className="text-sm">Business</span>
              </div>
            </div>

            {/* Seat Grid */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {Array.from({ length: SEAT_ROWS }, (_, rowIndex) => {
                const row = rowIndex + 1;
                const isBusinessRow = BUSINESS_CLASS_ROWS.includes(row);
                return (
                  <div key={row} className="flex items-center gap-2">
                    <div className="w-8 text-center font-semibold text-muted-foreground">
                      {row}
                    </div>
                    <div className="flex gap-1 flex-1">
                      {SEAT_COLUMNS.map((column, colIndex) => {
                        const seat = seats.find(
                          (s) => s.row === row && s.column === column
                        );
                        if (!seat) return null;

                        const isSelected = selectedSeats.some((s) => s.id === seat.id);
                        
                        return (
                          <div key={seat.id} className="flex-1">
                            <button
                              onClick={() => handleSeatClick(seat)}
                              disabled={!seat.isAvailable}
                              className={cn(
                                "w-full aspect-square rounded text-xs font-semibold transition-all duration-200 border-2",
                                "hover:scale-110 active:scale-95",
                                seat.isAvailable && !isSelected && !isBusinessRow && "bg-muted hover:bg-muted/70 border-muted",
                                seat.isAvailable && !isSelected && isBusinessRow && "bg-accent/20 hover:bg-accent/30 border-accent",
                                isSelected && "bg-primary text-primary-foreground border-primary shadow-md scale-110",
                                !seat.isAvailable && "bg-muted-foreground/20 cursor-not-allowed opacity-50 border-muted-foreground/20"
                              )}
                              aria-label={`Seat ${seat.id}, ${seat.type} class, ${seat.isAvailable ? 'available' : 'occupied'}`}
                              aria-pressed={isSelected}
                            >
                              {column}
                            </button>
                            {colIndex === 2 && <div className="w-4" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Booking Summary */}
        <Card className="shadow-lg h-fit sticky top-24 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Booking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Selected Seats</div>
                {selectedSeats.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map((seat) => (
                      <Badge
                        key={seat.id}
                        variant="secondary"
                        className="text-base font-semibold"
                      >
                        {seat.id}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No seats selected</p>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flight Price</span>
                  <span className="font-semibold">${flight.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seats ({selectedSeats.length})</span>
                  <span className="font-semibold">
                    ${selectedSeats.reduce((sum, s) => sum + s.price, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-bold flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Total
                  </span>
                  <span className="text-3xl font-bold bg-gradient-magic bg-clip-text text-transparent">
                    ${flight.price + selectedSeats.reduce((sum, s) => sum + s.price, 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <Button
                onClick={handleConfirm}
                disabled={selectedSeats.length === 0}
                className="w-full gradient-primary shadow-md hover:shadow-glow"
                size="lg"
                aria-label="Confirm seat selection"
              >
                Confirm Selection
              </Button>
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full"
                size="lg"
                aria-label="Go back to flight selection"
              >
                Back to Flights
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeatReservation;
