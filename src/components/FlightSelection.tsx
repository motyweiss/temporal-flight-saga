import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flight } from "@/types/booking";
import { Plane, Clock, Calendar } from "lucide-react";

interface FlightSelectionProps {
  onSelectFlight: (flight: Flight) => void;
}

const mockFlights: Flight[] = [
  {
    id: "FL001",
    flightNumber: "SK-301",
    departure: "New York (JFK)",
    arrival: "London (LHR)",
    departureTime: "14:30",
    arrivalTime: "02:45+1",
    price: 599,
    airline: "SkyBooker Airlines",
  },
  {
    id: "FL002",
    flightNumber: "SK-425",
    departure: "New York (JFK)",
    arrival: "London (LHR)",
    departureTime: "18:00",
    arrivalTime: "06:15+1",
    price: 499,
    airline: "SkyBooker Airlines",
  },
];

const FlightSelection = ({ onSelectFlight }: FlightSelectionProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Select Your Flight</h2>
        <p className="text-muted-foreground">
          Choose from available flights to start your booking
        </p>
      </div>

      <div className="space-y-4">
        {mockFlights.map((flight) => (
          <Card
            key={flight.id}
            className="p-6 shadow-card hover:shadow-elegant transition-all duration-300 border-2 hover:border-primary cursor-pointer"
            onClick={() => onSelectFlight(flight)}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Plane className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-lg">{flight.flightNumber}</span>
                  <span className="text-sm text-muted-foreground">
                    {flight.airline}
                  </span>
                </div>

                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-2xl font-bold">{flight.departureTime}</div>
                    <div className="text-sm text-muted-foreground">
                      {flight.departure}
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-border relative">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-2xl font-bold">{flight.arrivalTime}</div>
                    <div className="text-sm text-muted-foreground">
                      {flight.arrival}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    ${flight.price}
                  </div>
                  <div className="text-sm text-muted-foreground">per person</div>
                </div>
                <Button
                  size="lg"
                  className="gradient-primary"
                  onClick={() => onSelectFlight(flight)}
                >
                  Select Flight
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FlightSelection;
