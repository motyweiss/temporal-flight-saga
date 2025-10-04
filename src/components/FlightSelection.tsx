import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flight } from "@/types/booking";
import { Plane, Clock, MapPin, ArrowRight } from "lucide-react";

interface FlightSelectionProps {
  onSelectFlight: (flight: Flight) => void;
}

const mockFlights: Flight[] = [
  {
    id: "1",
    flightNumber: "CF101",
    departure: "New York (JFK)",
    arrival: "London (LHR)",
    departureTime: "10:00 AM",
    arrivalTime: "10:00 PM",
    price: 450,
    airline: "CalfonAirline",
  },
  {
    id: "2",
    flightNumber: "CF202",
    departure: "Los Angeles (LAX)",
    arrival: "Tokyo (NRT)",
    departureTime: "2:30 PM",
    arrivalTime: "6:00 PM +1",
    price: 720,
    airline: "CalfonAirline",
  },
  {
    id: "3",
    flightNumber: "CF303",
    departure: "San Francisco (SFO)",
    arrival: "Paris (CDG)",
    departureTime: "6:45 PM",
    arrivalTime: "2:30 PM +1",
    price: 580,
    airline: "CalfonAirline",
  },
];

const FlightSelection = ({ onSelectFlight }: FlightSelectionProps) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-3 animate-slide-up">
        <h2 className="text-4xl font-bold bg-gradient-magic bg-clip-text text-transparent">
          Choose Your Flight
        </h2>
        <p className="text-muted-foreground text-lg">
          Select from our available flights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockFlights.map((flight, index) => (
          <Card
            key={flight.id}
            className="group hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden border-2 hover:border-primary/50 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-magic opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <CardHeader className="space-y-4">
              <Badge variant="secondary" className="font-semibold">
                {flight.airline}
              </Badge>
              <CardTitle className="text-2xl font-bold">
                {flight.flightNumber}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">Departure</div>
                    <div className="font-semibold">{flight.departure}</div>
                    <div className="text-lg font-bold text-primary">{flight.departureTime}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">Arrival</div>
                    <div className="font-semibold">{flight.arrival}</div>
                    <div className="text-lg font-bold text-primary">{flight.arrivalTime}</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="text-3xl font-bold bg-gradient-magic bg-clip-text text-transparent">
                    ${flight.price}
                  </span>
                </div>

                <Button
                  onClick={() => onSelectFlight(flight)}
                  className="w-full gradient-primary shadow-md hover:shadow-glow group-hover:scale-105 transition-all"
                  size="lg"
                  aria-label={`Select flight ${flight.flightNumber}`}
                >
                  Select Flight
                  <Plane className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FlightSelection;
