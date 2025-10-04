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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <StepIndicator currentStep={currentStep} />

        <div className="mt-12 animate-slide-up">
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
    </div>
  );
};

export default Index;
