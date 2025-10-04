import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flight } from "@/types/booking";
import { Plane, ArrowRight, Clock } from "lucide-react";

interface FlightSelectionProps {
  onSelectFlight: (flight: Flight) => void;
}

const mockFlights: Flight[] = [
  {
    id: "FL001",
    flightNumber: "CF-301",
    departure: "Tel Aviv (TLV)",
    arrival: "New York (JFK)",
    departureTime: "14:30",
    arrivalTime: "19:45",
    price: 599,
    airline: "CalfonAirline",
  },
  {
    id: "FL002",
    flightNumber: "CF-425",
    departure: "Tel Aviv (TLV)",
    arrival: "New York (JFK)",
    departureTime: "22:00",
    arrivalTime: "03:15+1",
    price: 499,
    airline: "CalfonAirline",
  },
];

const FlightSelection = ({ onSelectFlight }: FlightSelectionProps) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-3 animate-slide-up">
        <h2 className="text-4xl font-bold tracking-tight">בחר את הטיסה שלך</h2>
        <p className="text-muted-foreground text-lg">
          טיסות זמינות מתל אביב לניו יורק
        </p>
      </div>

      <div className="grid gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {mockFlights.map((flight, index) => (
          <Card
            key={flight.id}
            className="group hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/50 cursor-pointer overflow-hidden"
            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
          >
            <div className="absolute inset-0 bg-gradient-magic opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
            
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                      <Plane className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-xl">{flight.flightNumber}</div>
                      <div className="text-sm text-muted-foreground">{flight.airline}</div>
                    </div>
                    <Badge variant="secondary" className="mr-auto">ישיר</Badge>
                  </div>

                  <div className="flex items-center gap-6 justify-around">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{flight.departureTime}</div>
                      <div className="text-sm text-muted-foreground mt-1">{flight.departure}</div>
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-2 px-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">11h 15m</span>
                      </div>
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <ArrowRight className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-3xl font-bold">{flight.arrivalTime}</div>
                      <div className="text-sm text-muted-foreground mt-1">{flight.arrival}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 md:border-r pr-8">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">מחיר למושב</div>
                    <div className="text-4xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                      ${flight.price}
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="gradient-primary w-full shadow-md group-hover:shadow-glow transition-all duration-300"
                    onClick={() => onSelectFlight(flight)}
                  >
                    בחר טיסה
                    <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FlightSelection;
