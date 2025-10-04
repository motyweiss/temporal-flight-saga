import calfonLogo from "@/assets/calfon-logo.png";

const Header = () => {
  return (
    <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 md:py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => window.location.href = '/'} 
            className="flex items-center gap-3 group cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="חזרה לדף הראשי"
          >
            <img 
              src={calfonLogo} 
              alt="CalfonAirline Logo" 
              className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground">Flight Booking</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
