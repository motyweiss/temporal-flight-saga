import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flight, Seat } from "@/types/booking";
import { Clock, Plane, MapPin } from "lucide-react";

interface OrderReviewProps {
  flight: Flight;
  seats: Seat[];
  onConfirm: () => void;
  onBack: () => void;
}

const REVIEW_TIMEOUT = 15 * 60; // 15 minutes

const OrderReview = ({ flight, seats, onConfirm, onBack }: OrderReviewProps) => {
  const [timeRemaining, setTimeRemaining] = useState(REVIEW_TIMEOUT);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          return REVIEW_TIMEOUT;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const seatTotal = seats.reduce((sum, seat) => sum + seat.price, 0);
  const total = flight.price + seatTotal;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Review Your Order</h2>
        <p className="text-muted-foreground">
          Please review your booking details before payment
        </p>
      </div>

      <Card className="p-6 mb-6 shadow-elegant border-2 border-warning">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Clock className="w-6 h-6 text-warning animate-pulse-glow" />
            <div>
              <div className="font-semibold text-lg">Time to Complete Booking</div>
              <div className="text-sm text-muted-foreground">
                Your seats are reserved
              </div>
            </div>
          </div>
          <div className="text-4xl font-bold text-warning">
            {formatTime(timeRemaining)}
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="p-6 shadow-card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plane className="w-5 h-5 text-primary" />
            Flight Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Flight Number</span>
              <span className="font-semibold">{flight.flightNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Airline</span>
              <span className="font-semibold">{flight.airline}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground">Route</span>
              <div className="text-right">
                <div className="font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {flight.departure}
                </div>
                <div className="text-sm text-muted-foreground my-1">to</div>
                <div className="font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {flight.arrival}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Departure</span>
              <span className="font-semibold">{flight.departureTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Arrival</span>
              <span className="font-semibold">{flight.arrivalTime}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-card">
          <h3 className="text-xl font-bold mb-4">Seat Selection</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Seats</span>
              <span className="font-semibold">
                {seats.map((s) => s.id).join(", ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Number of Passengers</span>
              <span className="font-semibold">{seats.length}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-card">
          <h3 className="text-xl font-bold mb-4">Price Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Flight Price</span>
              <span className="font-semibold">${flight.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Seat Selection ({seats.length} seat{seats.length > 1 ? "s" : ""})
              </span>
              <span className="font-semibold">${seatTotal}</span>
            </div>
            <div className="pt-3 border-t flex justify-between">
              <span className="text-lg font-bold">Total Amount</span>
              <span className="text-2xl font-bold text-primary">${total}</span>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onBack}
            className="flex-1"
          >
            Modify Seats
          </Button>
          <Button
            size="lg"
            onClick={onConfirm}
            className="flex-1 gradient-primary"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;
