import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: string;
}

const steps = [
  { id: "flight", label: "Select Flight" },
  { id: "seats", label: "Choose Seats" },
  { id: "review", label: "Review Order" },
  { id: "payment", label: "Payment" },
  { id: "confirmation", label: "Confirmation" },
];

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border -z-10" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-gradient-primary -z-10 transition-all duration-500 ease-out"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1 relative">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-card z-10",
                  isCompleted && "bg-success border-success text-success-foreground shadow-md animate-scale-in",
                  isCurrent && "bg-primary border-primary text-primary-foreground shadow-glow animate-pulse-glow",
                  !isCompleted && !isCurrent && "border-border text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs mt-3 text-center transition-all duration-300 hidden sm:block absolute top-full whitespace-nowrap",
                  isCurrent ? "text-foreground font-semibold scale-105" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
