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
  duration: "12h 00m",
  price: 450,
  airline: "CalfonAirline"
}, {
  id: "2",
  flightNumber: "CF202",
  departure: "Los Angeles (LAX)",
  arrival: "Tokyo (NRT)",
  departureTime: "2:30 PM",
  arrivalTime: "6:00 PM +1",
  duration: "15h 30m",
  price: 720,
  airline: "CalfonAirline"
}, {
  id: "3",
  flightNumber: "CF303",
  departure: "San Francisco (SFO)",
  arrival: "Paris (CDG)",
  departureTime: "6:45 PM",
  arrivalTime: "2:30 PM +1",
  duration: "11h 45m",
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
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:gap-6">
                
                {/* Flight Number Badge */}
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                    {flight.flightNumber}
                  </Badge>
                  <div className="sm:hidden">
                    <div className="text-xl sm:text-3xl font-bold text-primary">
                      ${flight.price}
                    </div>
                  </div>
                </div>
                
                {/* Flight Route Info */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  {/* Departure */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">Departure</div>
                    <div className="font-bold text-base sm:text-lg">{flight.departureTime}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{flight.departure}</div>
                  </div>
                  
                  {/* Duration & Arrow */}
                  <div className="flex flex-col items-center justify-center px-2">
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-primary mb-1" />
                    <div className="flex items-center gap-1.5 bg-primary/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                      <span className="text-[10px] sm:text-xs font-semibold text-primary">{flight.duration}</span>
                    </div>
                  </div>
                  
                  {/* Arrival */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">Arrival</div>
                    <div className="font-bold text-base sm:text-lg">{flight.arrivalTime}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{flight.arrival}</div>
                  </div>
                </div>

                {/* Price & Action - Desktop */}
                <div className="hidden sm:flex items-center justify-between gap-4 pt-2 border-t">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Price</div>
                    <div className="text-2xl sm:text-3xl font-bold text-primary">
                      ${flight.price}
                    </div>
                  </div>
                  
                  <Button onClick={() => onSelectFlight(flight)} className="gradient-primary shadow-md hover:shadow-glow whitespace-nowrap touch-target" size="lg" aria-label={`Book flight ${flight.flightNumber}`}>
                    Book Now
                    <Plane className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
                
                {/* Action Button - Mobile Full Width */}
                <Button onClick={() => onSelectFlight(flight)} className="sm:hidden w-full gradient-primary shadow-md hover:shadow-glow touch-target" size="lg" aria-label={`Book flight ${flight.flightNumber}`}>
                  Book Now
                  <Plane className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>)}
      </div>
    </div>;
};
export default FlightSelection;