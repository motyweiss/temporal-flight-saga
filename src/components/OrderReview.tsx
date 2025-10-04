import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Flight, Seat } from "@/types/booking";
import { Clock, Plane, MapPin, Users, CreditCard, ChevronLeft } from "lucide-react";

interface OrderReviewProps {
  flight: Flight;
  seats: Seat[];
  onConfirm: () => void;
  onBack: () => void;
}

const REVIEW_TIMEOUT = 15 * 60;

const OrderReview = ({ flight, seats, onConfirm, onBack }: OrderReviewProps) => {
  const [timeRemaining, setTimeRemaining] = useState(REVIEW_TIMEOUT);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((REVIEW_TIMEOUT - timeRemaining) / REVIEW_TIMEOUT) * 100;
  const seatTotal = seats.reduce((sum, seat) => sum + seat.price, 0);
  const total = flight.price + seatTotal;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-3 animate-slide-up">
        <h2 className="text-4xl font-bold">סקירת הזמנה</h2>
        <p className="text-muted-foreground text-lg">
          אנא בדוק את פרטי ההזמנה לפני התשלום
        </p>
      </div>

      <Card className="border-2 border-warning/50 shadow-lg animate-scale-in">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Clock className="w-6 h-6 text-warning animate-pulse" />
                <div>
                  <div className="font-bold text-lg">זמן להשלמת הזמנה</div>
                  <div className="text-sm text-muted-foreground">
                    המושבים שלך שמורים
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

      <div className="grid gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-primary" />
              פרטי טיסה
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">מספר טיסה</div>
                <div className="font-bold text-lg">{flight.flightNumber}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">חברת תעופה</div>
                <div className="font-bold text-lg">{flight.airline}</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">המראה</span>
                  </div>
                  <div className="font-bold text-xl">{flight.departure}</div>
                  <div className="text-2xl font-bold text-primary">{flight.departureTime}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-2">משך טיסה</div>
                  <Badge variant="secondary">11h 15m</Badge>
                </div>

                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-sm text-muted-foreground">נחיתה</span>
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div className="font-bold text-xl">{flight.arrival}</div>
                  <div className="text-2xl font-bold text-primary">{flight.arrivalTime}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              בחירת מושבים
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">מושבים נבחרים</div>
                <div className="font-semibold">{seats.length} נוסעים</div>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                {seats.map((s) => (
                  <Badge key={s.id} variant="secondary" className="text-base px-3 py-1.5">
                    {s.id}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              פירוט מחיר
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">מחיר טיסה בסיסי</span>
                <span className="font-semibold">${flight.price}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">
                  בחירת מושבים ({seats.length} מושבים)
                </span>
                <span className="font-semibold">${seatTotal}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-xl font-bold">סה״כ לתשלום</span>
                <div className="text-left">
                  <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
                    ${total}
                  </div>
                  <div className="text-xs text-muted-foreground">כולל כל העמלות</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onBack}
            className="flex-1"
          >
            <ChevronLeft className="ml-2 h-5 w-5" />
            שינוי מושבים
          </Button>
          <Button
            size="lg"
            onClick={onConfirm}
            className="flex-1 gradient-primary shadow-md hover:shadow-glow transition-all"
          >
            המשך לתשלום
            <CreditCard className="mr-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;
