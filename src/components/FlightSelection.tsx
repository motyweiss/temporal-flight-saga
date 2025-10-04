import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flight } from "@/types/booking";
import { Plane, Clock, MapPin, ArrowRight } from "lucide-react";
interface FlightSelectionProps {
  onSelectFlight: (flight: Flight) => void;
}
const mockFlights: Flight[] = [{
  id: "1",
  flightNumber: "CF101",
  departure: "New York (JFK)",
  arrival: "London (LHR)",
  departureTime: "10:00 AM",
  arrivalTime: "10:00 PM",
  price: 450,
  airline: "CalfonAirline"
}, {
  id: "2",
  flightNumber: "CF202",
  departure: "Los Angeles (LAX)",
  arrival: "Tokyo (NRT)",
  departureTime: "2:30 PM",
  arrivalTime: "6:00 PM +1",
  price: 720,
  airline: "CalfonAirline"
}, {
  id: "3",
  flightNumber: "CF303",
  departure: "San Francisco (SFO)",
  arrival: "Paris (CDG)",
  departureTime: "6:45 PM",
  arrivalTime: "2:30 PM +1",
  price: 580,
  airline: "CalfonAirline"
}];
const FlightSelection = ({
  onSelectFlight
}: FlightSelectionProps) => {
  return <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-3 animate-slide-up">
        <h2 className="text-4xl font-bold bg-gradient-magic bg-clip-text text-transparent">
          Choose Your Flight
        </h2>
        
      </div>

      <div className="space-y-4">
        {mockFlights.map((flight, index) => <Card key={flight.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border hover:border-primary/50 animate-slide-up" style={{
        animationDelay: `${index * 100}ms`
      }} onClick={() => onSelectFlight(flight)}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Flight Info */}
                <div className="flex items-center gap-6 flex-1">
                  <Badge variant="secondary" className="text-sm font-semibold whitespace-nowrap">
                    {flight.flightNumber}
                  </Badge>
                  
                  <div className="flex items-center gap-4 flex-1">
                    {/* Departure */}
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-1">Departure</div>
                      <div className="font-bold text-lg">{flight.departureTime}</div>
                      <div className="text-sm text-muted-foreground">{flight.departure}</div>
                    </div>
                    
                    {/* Arrow */}
                    <div className="flex items-center justify-center px-2">
                      <ArrowRight className="w-6 h-6 text-primary" />
                    </div>
                    
                    {/* Arrival */}
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-1">Arrival</div>
                      <div className="font-bold text-lg">{flight.arrivalTime}</div>
                      <div className="text-sm text-muted-foreground">{flight.arrival}</div>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center gap-6 md:border-l md:pl-6">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Price</div>
                    <div className="text-3xl font-bold text-primary">
                      ${flight.price}
                    </div>
                  </div>
                  
                  <Button onClick={() => onSelectFlight(flight)} className="gradient-primary shadow-md hover:shadow-glow whitespace-nowrap" size="lg" aria-label={`Select flight ${flight.flightNumber}`}>
                    Select Flight
                    <Plane className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>
    </div>;
};
export default FlightSelection;