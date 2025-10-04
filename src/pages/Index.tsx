import { useState } from "react";
import FlightSelection from "@/components/FlightSelection";
import SeatReservation from "@/components/SeatReservation";
import OrderReview from "@/components/OrderReview";
import PaymentValidation from "@/components/PaymentValidation";
import OrderConfirmation from "@/components/OrderConfirmation";
import StepIndicator from "@/components/StepIndicator";
import Header from "@/components/Header";
import { Flight, Seat } from "@/types/booking";

type BookingStep = "flight" | "seats" | "review" | "payment" | "confirmation";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>("flight");
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [orderId, setOrderId] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<"pending" | "confirmed" | "failed">("pending");

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
    setCurrentStep("seats");
  };

  const handleSeatsConfirm = (seats: Seat[]) => {
    setSelectedSeats(seats);
    setCurrentStep("review");
  };

  const handleReviewConfirm = () => {
    setCurrentStep("payment");
  };

  const handlePaymentSuccess = (orderIdGenerated: string) => {
    setOrderId(orderIdGenerated);
    setOrderStatus("confirmed");
    setCurrentStep("confirmation");
  };

  const handlePaymentFailure = () => {
    setOrderStatus("failed");
    setCurrentStep("confirmation");
  };

  const handleStartOver = () => {
    setCurrentStep("flight");
    setSelectedFlight(null);
    setSelectedSeats([]);
    setOrderId("");
    setOrderStatus("pending");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 max-w-7xl flex-1">
        <StepIndicator currentStep={currentStep} />

        <div className="mt-8 sm:mt-10 md:mt-12 animate-slide-up">
          {currentStep === "flight" && (
            <FlightSelection onSelectFlight={handleFlightSelect} />
          )}

          {currentStep === "seats" && selectedFlight && (
            <SeatReservation
              flight={selectedFlight}
              onConfirm={handleSeatsConfirm}
              onBack={() => setCurrentStep("flight")}
            />
          )}

          {currentStep === "review" && selectedFlight && (
            <OrderReview
              flight={selectedFlight}
              seats={selectedSeats}
              onConfirm={handleReviewConfirm}
              onBack={() => setCurrentStep("seats")}
            />
          )}

          {currentStep === "payment" && (
            <PaymentValidation
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
            />
          )}

          {currentStep === "confirmation" && (
            <OrderConfirmation
              orderId={orderId}
              status={orderStatus}
              flight={selectedFlight}
              seats={selectedSeats}
              onStartOver={handleStartOver}
            />
          )}
        </div>
      </div>

      <footer className="border-t bg-background/50 backdrop-blur-sm py-4 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Designed with love by MotyAI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
