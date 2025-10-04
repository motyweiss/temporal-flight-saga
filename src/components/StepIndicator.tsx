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
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="relative">
        {/* Progress Line Background */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-muted/30 rounded-full" />
        
        {/* Active Progress Line with Enhanced Gradient */}
        <div 
          className="absolute top-6 left-0 h-1 rounded-full transition-all duration-700 ease-out shadow-glow"
          style={{ 
            width: `${(currentIndex / (steps.length - 1)) * 100}%`,
            background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 50%, hsl(var(--primary)) 100%)',
            boxShadow: '0 0 10px hsl(var(--primary) / 0.5)'
          }}
        />

        {/* Steps Container */}
        <div className="flex items-start justify-between relative">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                {/* Step Circle */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-background z-10 relative",
                    isCompleted && "bg-success border-success text-white shadow-lg animate-scale-in",
                    isCurrent && "bg-primary border-primary text-white shadow-xl scale-110 animate-pulse-subtle",
                    !isCompleted && !isCurrent && "border-muted text-muted-foreground hover:border-primary/50"
                  )}
                  aria-label={`Step ${index + 1}: ${step.label}`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span className="text-base font-bold">{index + 1}</span>
                  )}
                </div>
                
                {/* Step Label */}
                <div className="mt-3 text-center">
                  <span
                    className={cn(
                      "text-sm transition-all duration-300 block",
                      isCurrent ? "text-foreground font-bold" : "text-muted-foreground font-medium"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
