import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Clock, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PaymentValidationProps {
  onSuccess: (orderId: string) => void;
  onFailure: () => void;
}

const VALIDATION_TIMEOUT = 10; // 10 seconds
const MAX_RETRIES = 3;
const FAILURE_RATE = 0.15; // 15% failure rate

const PaymentValidation = ({ onSuccess, onFailure }: PaymentValidationProps) => {
  const [paymentCode, setPaymentCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [validationHistory, setValidationHistory] = useState<
    { attempt: number; result: "success" | "failed"; timestamp: Date }[]
  >([]);

  useEffect(() => {
    if (timeRemaining === null) return;

    if (timeRemaining <= 0) {
      handleValidationFailure();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const validatePaymentCode = async () => {
    // Simulate payment validation with 15% failure rate
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const isSuccess = Math.random() > FAILURE_RATE;
        resolve(isSuccess);
      }, 2000); // 2 second validation delay
    });
  };

  const handleValidationFailure = () => {
    setIsValidating(false);
    setTimeRemaining(null);

    const newAttempt = {
      attempt: retryCount + 1,
      result: "failed" as const,
      timestamp: new Date(),
    };
    setValidationHistory([...validationHistory, newAttempt]);

    if (retryCount >= MAX_RETRIES - 1) {
      toast({
        title: "Payment Failed",
        description: `Maximum retry attempts (${MAX_RETRIES}) exceeded. Order has been cancelled.`,
        variant: "destructive",
      });
      setTimeout(() => onFailure(), 2000);
    } else {
      setRetryCount(retryCount + 1);
      toast({
        title: "Payment Validation Failed",
        description: `Attempt ${retryCount + 1} of ${MAX_RETRIES} failed. Please try again.`,
        variant: "destructive",
      });
      setPaymentCode("");
    }
  };

  const handleSubmit = async () => {
    if (paymentCode.length !== 5) {
      toast({
        title: "Invalid Code",
        description: "Payment code must be exactly 5 digits",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    setTimeRemaining(VALIDATION_TIMEOUT);

    const isValid = await validatePaymentCode();

    if (timeRemaining !== null && timeRemaining > 0) {
      if (isValid) {
        const newAttempt = {
          attempt: retryCount + 1,
          result: "success" as const,
          timestamp: new Date(),
        };
        setValidationHistory([...validationHistory, newAttempt]);

        toast({
          title: "Payment Successful",
          description: "Your payment has been validated successfully!",
        });

        const orderId = generateOrderId();
        setTimeout(() => onSuccess(orderId), 1500);
      } else {
        handleValidationFailure();
      }
    }
  };

  const handleCodeChange = (value: string) => {
    // Only allow digits and max 5 characters
    const filtered = value.replace(/\D/g, "").slice(0, 5);
    setPaymentCode(filtered);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Payment Validation</h2>
        <p className="text-muted-foreground">
          Enter your 5-digit payment code to complete the booking
        </p>
      </div>

      {timeRemaining !== null && (
        <Card className="p-6 mb-6 shadow-elegant border-2 border-warning">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Clock className="w-6 h-6 text-warning animate-pulse-glow" />
              <div>
                <div className="font-semibold text-lg">Validation Timeout</div>
                <div className="text-sm text-muted-foreground">
                  Payment must be validated within time limit
                </div>
              </div>
            </div>
            <div className="text-4xl font-bold text-warning">{timeRemaining}s</div>
          </div>
        </Card>
      )}

      <Card className="p-8 shadow-card">
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            <CreditCard className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">Payment Code</h3>
          </div>

          <div className="space-y-2">
            <Input
              type="text"
              value={paymentCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="12345"
              className="text-center text-2xl font-mono tracking-widest h-16"
              maxLength={5}
              disabled={isValidating}
            />
            <p className="text-sm text-muted-foreground text-center">
              Enter 5-digit payment code
            </p>
          </div>

          {retryCount > 0 && (
            <div className="flex items-start gap-2 p-4 rounded bg-destructive/10 border border-destructive/20">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-destructive">
                  Attempt {retryCount} of {MAX_RETRIES}
                </p>
                <p className="text-muted-foreground mt-1">
                  {MAX_RETRIES - retryCount} attempt{MAX_RETRIES - retryCount !== 1 ? "s" : ""}{" "}
                  remaining before order cancellation
                </p>
              </div>
            </div>
          )}

          {validationHistory.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Validation History</h4>
              <div className="space-y-1">
                {validationHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm p-2 rounded bg-muted"
                  >
                    <span>Attempt {item.attempt}</span>
                    <span
                      className={
                        item.result === "success"
                          ? "text-success font-semibold"
                          : "text-destructive"
                      }
                    >
                      {item.result === "success" ? "✓ Success" : "✗ Failed"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            className="w-full gradient-primary"
            size="lg"
            onClick={handleSubmit}
            disabled={paymentCode.length !== 5 || isValidating}
          >
            {isValidating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Validating Payment...
              </>
            ) : (
              "Validate Payment"
            )}
          </Button>

          <div className="text-xs text-center text-muted-foreground space-y-1">
            <p>• Validation timeout: {VALIDATION_TIMEOUT} seconds</p>
            <p>• Maximum retry attempts: {MAX_RETRIES}</p>
            <p>• Simulated failure rate: {FAILURE_RATE * 100}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentValidation;
