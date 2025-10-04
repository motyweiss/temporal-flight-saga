import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flight, Seat } from "@/types/booking";
import { Clock, AlertCircle, Users, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface SeatReservationProps {
  flight: Flight;
  onConfirm: (seats: Seat[]) => void;
  onBack: () => void;
}

const SEAT_TIMEOUT = 15 * 60;

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
        isAvailable: Math.random() > 0.3,
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
            title: "תם הזמן להזמנה",
            description: "המושבים שהזמנת שוחררו. אנא בחר מושבים מחדש.",
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
      setTimeRemaining(SEAT_TIMEOUT);
      toast({
        title: "מושב נבחר",
        description: `מושב ${seat.id} נשמר למשך 15 דקות`,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((SEAT_TIMEOUT - timeRemaining) / SEAT_TIMEOUT) * 100;
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-3 animate-slide-up">
        <h2 className="text-4xl font-bold">בחר מושבים</h2>
        <p className="text-muted-foreground text-lg">
          טיסה {flight.flightNumber} - {flight.departure} ל{flight.arrival}
        </p>
      </div>

      {selectedSeats.length > 0 && (
        <Card className="border-2 border-warning/50 shadow-lg animate-scale-in">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Clock className="w-6 h-6 text-warning animate-pulse" />
                  <div>
                    <div className="font-bold text-lg">טיימר הזמנה</div>
                    <div className="text-sm text-muted-foreground">
                      המושבים ישוחררו לאחר תום הזמן
                    </div>
                  </div>
                </div>
                <div className="text-5xl font-bold text-warning tabular-nums">
                  {formatTime(timeRemaining)}
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex justify-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded border-2 border-border bg-background" />
                  <span className="text-sm">פנוי</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-gradient-primary shadow-md" />
                  <span className="text-sm">נבחר</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-muted" />
                  <span className="text-sm">תפוס</span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="bg-muted/30 p-6 rounded-lg">
                <div className="flex flex-col items-center gap-2 mb-6">
                  <div className="text-xs font-semibold text-muted-foreground">קדימה</div>
                  <div className="w-16 h-8 bg-gradient-primary rounded-t-full" />
                </div>

                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((row) => (
                    <div key={row} className="flex items-center justify-center gap-2">
                      <div className="w-8 text-sm font-semibold text-muted-foreground">
                        {row}
                      </div>
                      {["A", "B", "C"].map((column) => {
                        const seat = seats.find((s) => s.row === row && s.column === column);
                        const isSelected = selectedSeats.find((s) => s.id === seat?.id);
                        
                        return (
                          <button
                            key={column}
                            onClick={() => seat && handleSeatClick(seat)}
                            disabled={!seat?.isAvailable}
                            className={cn(
                              "w-10 h-10 rounded-lg border-2 text-xs font-semibold transition-all duration-300",
                              !seat?.isAvailable && "bg-muted cursor-not-allowed opacity-50",
                              seat?.isAvailable && !isSelected && "border-border hover:border-primary hover:scale-110 hover:shadow-md",
                              isSelected && "gradient-primary text-primary-foreground border-primary scale-110 shadow-glow animate-scale-in"
                            )}
                          >
                            {column}
                          </button>
                        );
                      })}
                      <div className="w-4" />
                      {["D", "E", "F"].map((column) => {
                        const seat = seats.find((s) => s.row === row && s.column === column);
                        const isSelected = selectedSeats.find((s) => s.id === seat?.id);
                        
                        return (
                          <button
                            key={column}
                            onClick={() => seat && handleSeatClick(seat)}
                            disabled={!seat?.isAvailable}
                            className={cn(
                              "w-10 h-10 rounded-lg border-2 text-xs font-semibold transition-all duration-300",
                              !seat?.isAvailable && "bg-muted cursor-not-allowed opacity-50",
                              seat?.isAvailable && !isSelected && "border-border hover:border-primary hover:scale-110 hover:shadow-md",
                              isSelected && "gradient-primary text-primary-foreground border-primary scale-110 shadow-glow animate-scale-in"
                            )}
                          >
                            {column}
                          </button>
                        );
                      })}
                      <div className="w-8 text-sm font-semibold text-muted-foreground">
                        {row}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-md sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                סיכום הזמנה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">מושבים נבחרים</div>
                  {selectedSeats.length === 0 ? (
                    <div className="text-muted-foreground">לא נבחרו מושבים</div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map((s) => (
                        <Badge key={s.id} variant="secondary" className="text-base px-3 py-1">
                          {s.id}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">מחיר מושבים</span>
                    <span className="font-semibold">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">מחיר טיסה</span>
                    <span className="font-semibold">${flight.price}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-bold">סה״כ</span>
                    <span className="text-3xl font-bold text-primary">
                      ${totalPrice + flight.price}
                    </span>
                  </div>
                </div>
              </div>

              {selectedSeats.length === 0 && (
                <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50 border border-border">
                  <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    אנא בחר לפחות מושב אחד כדי להמשיך
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Button
                  size="lg"
                  className="w-full gradient-primary shadow-md hover:shadow-glow transition-all"
                  disabled={selectedSeats.length === 0}
                  onClick={() => onConfirm(selectedSeats)}
                >
                  המשך לבדיקה
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={onBack}
                >
                  <ChevronLeft className="ml-2 h-4 w-4" />
                  חזרה לבחירת טיסות
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SeatReservation;
