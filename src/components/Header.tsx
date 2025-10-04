import calfonLogo from "@/assets/calfon-logo.png";

const Header = () => {
  return (
    <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 md:py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <img 
              src={calfonLogo} 
              alt="CalfonAirline Logo" 
              className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
            />
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground">Flight Booking</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs md:text-sm font-medium text-success">Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
