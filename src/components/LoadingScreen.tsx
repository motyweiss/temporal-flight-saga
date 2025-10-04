import { useEffect, useState } from "react";
import calfonLogo from "@/assets/calfon-logo.png";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Start fade out after 1.8 seconds
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1800);

    // Call completion callback after 2 seconds
    const completeTimer = setTimeout(() => {
      onLoadingComplete();
    }, 2000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gradient-primary transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Spinning Logo with Pulse Glow */}
      <div className="relative">
        {/* Outer glow circle */}
        <div className="absolute inset-0 -m-8 rounded-full bg-primary/20 blur-2xl animate-pulse-glow" />
        
        {/* Logo container */}
        <div className="relative animate-spin-slow">
          <img
            src={calfonLogo}
            alt="Calfon Airline"
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain drop-shadow-glow"
          />
        </div>
      </div>

      {/* Loading text */}
      <p className="mt-8 text-white/80 text-sm sm:text-base md:text-lg font-light animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default LoadingScreen;
