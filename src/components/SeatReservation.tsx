import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flight, Seat } from "@/types/booking";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Clock, AlertTriangle, Users, DollarSign, Armchair, Star } from "lucide-react";
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
      
      // Mark seat 3C as occupied by Moty Weiss
      const isOccupiedByMoty = row === 3 && column === 'C';
      
      seats.push({
        id: `${row}${column}`,
        row,
        column,
        type,
        price: SEAT_PRICES[type],
        isAvailable: isOccupiedByMoty ? false : Math.random() > 0.3, // 70% seats available
        occupiedBy: isOccupiedByMoty ? "Moty Weiss" : undefined,
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
          <CardContent className="p-6">
            {/* Legend */}
            <div className="flex flex-wrap gap-6 mb-8 p-4 bg-muted/20 rounded-lg border">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-md bg-background border-2 border-border flex items-center justify-center">
                  <Armchair className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-md bg-primary border-2 border-primary flex items-center justify-center">
                  <Armchair className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium">Your Seat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-md bg-muted border-2 border-muted flex items-center justify-center opacity-40">
                  <Armchair className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-md bg-accent/30 border-2 border-accent flex items-center justify-center">
                  <Armchair className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="text-sm font-medium">Business Class</span>
              </div>
            </div>

            {/* Seat Grid */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {/* Front of Plane Indicator */}
              <div className="text-center py-4 border-b-2 border-dashed border-muted-foreground/20">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-muted-foreground/40" />
                  Front of Aircraft
                </div>
              </div>

              {Array.from({ length: SEAT_ROWS }, (_, rowIndex) => {
                const row = rowIndex + 1;
                const isBusinessRow = BUSINESS_CLASS_ROWS.includes(row);
                return (
                  <div key={row}>
                    {isBusinessRow && row === BUSINESS_CLASS_ROWS[0] && (
                      <div className="bg-accent/10 py-2 px-4 rounded-md mb-4 border border-accent/30 flex items-center gap-2">
                        <Star className="w-4 h-4 text-foreground" />
                        <span className="text-sm font-semibold text-foreground">Business Class</span>
                      </div>
                    )}
                    {!isBusinessRow && row === BUSINESS_CLASS_ROWS[BUSINESS_CLASS_ROWS.length - 1] + 1 && (
                      <div className="bg-muted/30 py-2 px-4 rounded-md mb-4 border flex items-center gap-2">
                        <Armchair className="w-4 h-4 text-foreground" />
                        <span className="text-sm font-semibold text-foreground">Economy Class</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 text-center font-bold text-sm text-muted-foreground bg-muted/30 py-2 rounded">
                        {row}
                      </div>
                      <div className="flex gap-2 flex-1 justify-center">
                        {SEAT_COLUMNS.map((column, colIndex) => {
                          const seat = seats.find(
                            (s) => s.row === row && s.column === column
                          );
                          if (!seat) return null;

                          const isSelected = selectedSeats.some((s) => s.id === seat.id);
                          
                          return (
                            <>
                              {colIndex === 3 && <div className="w-8" />}
                              <TooltipProvider key={seat.id}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => handleSeatClick(seat)}
                                      disabled={!seat.isAvailable}
                                      className={cn(
                                        "w-12 h-12 rounded-md transition-all duration-200 border-2 relative group",
                                        "flex items-center justify-center",
                                        seat.isAvailable && !isSelected && !isBusinessRow && "bg-background border-border hover:border-primary hover:bg-primary/5",
                                        seat.isAvailable && !isSelected && isBusinessRow && "bg-accent/30 border-accent/50 hover:border-accent hover:bg-accent/40",
                                        isSelected && "bg-primary border-primary shadow-lg scale-105 hover:scale-110",
                                        !seat.isAvailable && "bg-muted border-muted cursor-not-allowed opacity-40"
                                      )}
                                      aria-label={`Seat ${seat.id}, ${seat.type} class, ${seat.isAvailable ? 'available' : 'occupied'}`}
                                      aria-pressed={isSelected}
                                    >
                                      <Armchair 
                                        className={cn(
                                          "w-6 h-6 transition-colors",
                                          isSelected && "text-primary-foreground",
                                          !isSelected && seat.isAvailable && "text-muted-foreground",
                                          !seat.isAvailable && "text-muted-foreground"
                                        )} 
                                      />
                                      <span className={cn(
                                        "absolute -bottom-5 text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity",
                                        isSelected && "opacity-100 text-primary"
                                      )}>
                                        {seat.id}
                                      </span>
                                    </button>
                                  </TooltipTrigger>
                                  {!seat.isAvailable && seat.occupiedBy && (
                                    <TooltipContent>
                                      <p className="font-semibold">Occupied by:</p>
                                      <p>{seat.occupiedBy}</p>
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </TooltipProvider>
                            </>
                          );
                        })}
                      </div>
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
