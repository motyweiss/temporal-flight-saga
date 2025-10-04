import { Plane } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 transition-smooth">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-magic flex items-center justify-center shadow-md group-hover:shadow-glow transition-smooth group-hover:scale-110">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-magic bg-clip-text text-transparent">
                CalfonAirline
              </h1>
              <p className="text-xs text-muted-foreground">Professional Flight Booking</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span>System Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
