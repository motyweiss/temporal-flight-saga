import calfonLogo from "@/assets/calfon-logo.png";
const Header = () => {
  return <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 py-2 sm:py-2.5 md:py-3 max-w-7xl">
        <div className="flex items-center justify-between">
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 sm:gap-3 group cursor-pointer hover:opacity-80 transition-opacity" aria-label="חזרה לדף הראשי">
            <img src={calfonLogo} alt="CalfonAirline Logo" className="h-12 sm:h-14 md:h-18 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            <div className="hidden sm:block">
              
            </div>
          </button>
        </div>
      </div>
    </header>;
};
export default Header;