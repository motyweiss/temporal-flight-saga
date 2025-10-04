import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flight, Seat, OrderStatus } from "@/types/booking";
import { CheckCircle2, XCircle, Plane, Ticket } from "lucide-react";

interface OrderConfirmationProps {
  orderId: string;
  status: OrderStatus;
  flight: Flight | null;
  seats: Seat[];
  onStartOver: () => void;
}

const OrderConfirmation = ({
  orderId,
  status,
  flight,
  seats,
  onStartOver,
}: OrderConfirmationProps) => {
  const isSuccess = status === "confirmed";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        {isSuccess ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-success" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-success">Booking Confirmed!</h2>
            <p className="text-muted-foreground text-lg">
              Your flight has been successfully booked
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-12 h-12 text-destructive" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-destructive">Booking Failed</h2>
            <p className="text-muted-foreground text-lg">
              Unfortunately, your booking could not be completed
            </p>
          </div>
        )}
      </div>

      {isSuccess && flight && (
        <div className="space-y-6">
          <Card className="p-8 shadow-elegant border-2 border-success/20">
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
              <div className="flex items-center gap-3">
                <Ticket className="w-6 h-6 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Order ID</div>
                  <div className="font-mono font-bold text-lg">{orderId}</div>
                </div>
              </div>
              <div className="px-4 py-2 rounded-full bg-success/10 text-success font-semibold">
                Confirmed
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Plane className="w-5 h-5 text-primary" />
                  Flight Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Flight Number</div>
                    <div className="font-semibold">{flight.flightNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Airline</div>
                    <div className="font-semibold">{flight.airline}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Departure</div>
                    <div className="font-semibold">
                      {flight.departure}
                      <div className="text-primary">{flight.departureTime}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Arrival</div>
                    <div className="font-semibold">
                      {flight.arrival}
                      <div className="text-primary">{flight.arrivalTime}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-xl font-bold mb-4">Seat Assignment</h3>
                <div className="flex flex-wrap gap-2">
                  {seats.map((seat) => (
                    <div
                      key={seat.id}
                      className="px-4 py-2 rounded bg-primary/10 border border-primary/20 font-semibold text-primary"
                    >
                      {seat.id}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Paid</span>
                  <span className="text-3xl font-bold text-primary">
                    ${flight.price + seats.reduce((sum, s) => sum + s.price, 0)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/50 border-dashed">
            <h4 className="font-semibold mb-2">Next Steps</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Confirmation email sent to your registered email address</li>
              <li>✓ E-ticket will be available in your booking dashboard</li>
              <li>✓ Please arrive at the airport 2 hours before departure</li>
              <li>✓ Check-in opens 24 hours before departure</li>
            </ul>
          </Card>
        </div>
      )}

      {!isSuccess && (
        <Card className="p-8 shadow-card border-2 border-destructive/20">
          <div className="space-y-4 text-center">
            <h3 className="text-xl font-semibold">What happened?</h3>
            <p className="text-muted-foreground">
              Your payment validation failed after multiple retry attempts. Your
              seat reservations have been released.
            </p>
            <div className="pt-4">
              <h4 className="font-semibold mb-2">Possible reasons:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Payment code validation timed out (10 second limit)</li>
                <li>• Invalid payment code entered</li>
                <li>• Maximum retry attempts exceeded (3 attempts)</li>
                <li>• Simulated payment gateway failure (15% rate)</li>
              </ul>
            </div>
          </div>
        </Card>
      )}

      <div className="mt-8 text-center">
        <Button
          size="lg"
          onClick={onStartOver}
          className={isSuccess ? "gradient-primary" : ""}
          variant={isSuccess ? "default" : "outline"}
        >
          {isSuccess ? "Book Another Flight" : "Try Again"}
        </Button>
      </div>

      {isSuccess && (
        <div className="mt-8 p-6 rounded-lg bg-muted/30 border border-border">
          <h4 className="font-semibold mb-3 text-center">
            Temporal Workflow Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-success">✓ Seat Reservation</div>
              <div className="text-muted-foreground">15-min timeout managed</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-success">✓ Payment Validation</div>
              <div className="text-muted-foreground">10-sec timeout handled</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-success">✓ Order Management</div>
              <div className="text-muted-foreground">Status tracked end-to-end</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
