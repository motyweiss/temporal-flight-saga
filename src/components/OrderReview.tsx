import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Flight, Seat } from "@/types/booking";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Plane, MapPin, Users, DollarSign, Clock, AlertTriangle, ShieldCheck } from "lucide-react";
import { ORDER_REVIEW_TIMEOUT, TIMER_WARNING_THRESHOLD, TIMER_CRITICAL_THRESHOLD } from "@/constants/booking";

interface OrderReviewProps {
  flight: Flight;
  seats: Seat[];
  onConfirm: () => void;
  onBack: () => void;
}

const OrderReview = ({ flight, seats, onConfirm, onBack }: OrderReviewProps) => {
  const [timeRemaining, setTimeRemaining] = useState(ORDER_REVIEW_TIMEOUT);
  const [hasShownWarning, setHasShownWarning] = useState(false);
  const [hasShownCritical, setHasShownCritical] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast({
            title: "Time Expired",
            description: "Review time has expired. Please select your seats again.",
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

  useEffect(() => {
    if (timeRemaining === TIMER_WARNING_THRESHOLD && !hasShownWarning) {
      setHasShownWarning(true);
      toast({ title: "Time Warning", description: "Only 1 minute remaining to review your order!" });
    }
    if (timeRemaining === TIMER_CRITICAL_THRESHOLD && !hasShownCritical) {
      setHasShownCritical(true);
      toast({ title: "Critical: Time Running Out!", description: "Only 30 seconds left! Please proceed to payment now.", variant: "destructive" });
    }
  }, [timeRemaining, hasShownWarning, hasShownCritical]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (timeRemaining / ORDER_REVIEW_TIMEOUT) * 100;
  const isWarning = timeRemaining <= TIMER_WARNING_THRESHOLD;
  const isCritical = timeRemaining <= TIMER_CRITICAL_THRESHOLD;
  const totalPrice = flight.price + seats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-3 animate-slide-up">
        <h2 className="text-4xl font-bold bg-gradient-magic bg-clip-text text-transparent">Review Your Order</h2>
        <p className="text-muted-foreground text-lg">Please review your booking details before proceeding to payment</p>
      </div>

      <Card className={cn("shadow-lg border-2 transition-all duration-300 animate-slide-up", isCritical && "border-destructive bg-destructive/5 animate-pulse", isWarning && !isCritical && "border-warning bg-warning/5")}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", isCritical && "bg-destructive/20 animate-pulse", isWarning && !isCritical && "bg-warning/20", !isWarning && "bg-primary/20")}>
                <Clock className={cn("w-6 h-6", isCritical && "text-destructive", isWarning && !isCritical && "text-warning", !isWarning && "text-primary")} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Review Time Remaining</div>
                <div className={cn("text-3xl font-bold font-mono transition-colors", isCritical && "text-destructive", isWarning && !isCritical && "text-warning", !isWarning && "text-primary")}>{formatTime(timeRemaining)}</div>
              </div>
            </div>
            {isWarning && <Badge variant={isCritical ? "destructive" : "default"} className="flex items-center gap-2 text-base px-4 py-2"><AlertTriangle className="w-4 h-4" />{isCritical ? "Critical!" : "Hurry Up!"}</Badge>}
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <Card className="shadow-lg animate-slide-up" style={{ animationDelay: '100ms' }}>
        <CardHeader><CardTitle className="flex items-center gap-2"><Plane className="w-6 h-6 text-primary" />Flight Details</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div><div className="text-sm text-muted-foreground">Flight Number</div><div className="font-bold text-xl">{flight.flightNumber}</div></div>
              <div><div className="text-sm text-muted-foreground">Airline</div><div className="font-bold text-xl">{flight.airline}</div></div>
            </div>
            <div className="space-y-4">
              <div><div className="flex items-center gap-2 mb-2"><MapPin className="w-4 h-4 text-primary" /><span className="text-sm text-muted-foreground">Departure</span></div><div className="font-semibold">{flight.departure}</div><div className="text-2xl font-bold text-primary">{flight.departureTime}</div></div>
              <div><div className="flex items-center gap-2 mb-2"><MapPin className="w-4 h-4 text-primary" /><span className="text-sm text-muted-foreground">Arrival</span></div><div className="font-semibold">{flight.arrival}</div><div className="text-2xl font-bold text-primary">{flight.arrivalTime}</div></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg animate-slide-up" style={{ animationDelay: '150ms' }}>
        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-6 h-6 text-primary" />Selected Seats</CardTitle></CardHeader>
        <CardContent><div className="flex flex-wrap gap-3">{seats.map((seat) => <Badge key={seat.id} variant="secondary" className="px-4 py-2 text-lg font-semibold">{seat.id}</Badge>)}</div></CardContent>
      </Card>

      <Card className="shadow-lg animate-slide-up" style={{ animationDelay: '200ms' }}>
        <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="w-6 h-6 text-primary" />Price Breakdown</CardTitle></CardHeader>
        <CardContent><div className="space-y-4">
          <div className="flex justify-between text-lg"><span className="text-muted-foreground">Base Flight Price</span><span className="font-semibold">${flight.price}</span></div>
          <div className="flex justify-between text-lg"><span className="text-muted-foreground">Seat Selection ({seats.length} seats)</span><span className="font-semibold">${seats.reduce((sum, s) => sum + s.price, 0)}</span></div>
          <Separator />
          <div className="flex justify-between items-center pt-2"><span className="text-2xl font-bold">Total Amount</span><span className="text-5xl font-bold bg-gradient-magic bg-clip-text text-transparent">${totalPrice}</span></div>
        </div></CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1">Back to Seats</Button>
        <Button onClick={onConfirm} className="flex-1 gradient-primary shadow-md hover:shadow-glow" size="lg">Proceed to Payment<DollarSign className="ml-2 h-5 w-5" /></Button>
      </div>
    </div>
  );
};

export default OrderReview;
