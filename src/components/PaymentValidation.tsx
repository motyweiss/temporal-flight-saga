import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Clock, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PAYMENT_VALIDATION_TIMEOUT, MAX_PAYMENT_RETRIES, PAYMENT_FAILURE_RATE, PAYMENT_CODE_LENGTH, ORDER_ID_PREFIX, ORDER_ID_LENGTH } from "@/constants/booking";

interface PaymentValidationProps {
  onSuccess: (orderId: string) => void;
  onFailure: () => void;
}

const PaymentValidation = ({ onSuccess, onFailure }: PaymentValidationProps) => {
  const [paymentCode, setPaymentCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [validationHistory, setValidationHistory] = useState<{ attempt: number; result: "success" | "failed"; timestamp: Date }[]>([]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;
    const timer = setInterval(() => setTimeRemaining((prev) => (prev !== null ? prev - 1 : null)), 1000);
    return () => clearInterval(timer);
  }, [timeRemaining]);

  const generateOrderId = () => `${ORDER_ID_PREFIX}-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const validatePaymentCode = async () => new Promise<boolean>((resolve) => setTimeout(() => resolve(Math.random() > PAYMENT_FAILURE_RATE), 2000));

  const handleValidationFailure = () => {
    setIsValidating(false);
    setTimeRemaining(null);
    const newAttempt = { attempt: retryCount + 1, result: "failed" as const, timestamp: new Date() };
    setValidationHistory([...validationHistory, newAttempt]);

    if (retryCount >= MAX_PAYMENT_RETRIES - 1) {
      toast({ title: "Payment Failed", description: `Maximum attempts (${MAX_PAYMENT_RETRIES}) reached. Order cancelled.`, variant: "destructive" });
      setTimeout(() => onFailure(), 2000);
    } else {
      setRetryCount(retryCount + 1);
      toast({ title: "Validation Failed", description: `Attempt ${retryCount + 1} of ${MAX_PAYMENT_RETRIES} failed. Try again.`, variant: "destructive" });
      setPaymentCode("");
    }
  };

  const handleSubmit = async () => {
    if (paymentCode.length !== PAYMENT_CODE_LENGTH) {
      toast({ title: "Invalid Code", description: `Payment code must be exactly ${PAYMENT_CODE_LENGTH} digits`, variant: "destructive" });
      return;
    }
    setIsValidating(true);
    setTimeRemaining(PAYMENT_VALIDATION_TIMEOUT);
    const isValid = await validatePaymentCode();
    if (timeRemaining !== null && timeRemaining > 0) {
      if (isValid) {
        setValidationHistory([...validationHistory, { attempt: retryCount + 1, result: "success" as const, timestamp: new Date() }]);
        toast({ title: "Payment Approved!", description: "Your payment has been validated successfully" });
        setTimeout(() => onSuccess(generateOrderId()), 1500);
      } else {
        handleValidationFailure();
      }
    }
  };

  const progress = timeRemaining !== null ? ((PAYMENT_VALIDATION_TIMEOUT - timeRemaining) / PAYMENT_VALIDATION_TIMEOUT) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-3 animate-slide-up">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-magic flex items-center justify-center shadow-glow animate-float">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-4xl font-bold">Payment Validation</h2>
        <p className="text-muted-foreground text-lg">Enter your {PAYMENT_CODE_LENGTH}-digit payment code to complete your booking</p>
      </div>

      {timeRemaining !== null && (
        <Card className="border-2 border-primary/50 shadow-lg animate-scale-in">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Clock className="w-6 h-6 text-primary animate-pulse" />
                  <div>
                    <div className="font-bold text-lg">Validation Timer</div>
                    <div className="text-sm text-muted-foreground">Payment must be validated in time</div>
                  </div>
                </div>
                <div className="text-5xl font-bold text-primary tabular-nums">{timeRemaining}s</div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <CreditCard className="w-6 h-6 text-primary" />
            Payment Code
          </CardTitle>
          <CardDescription>Enter the {PAYMENT_CODE_LENGTH}-digit code you received</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <InputOTP
              maxLength={PAYMENT_CODE_LENGTH}
              value={paymentCode}
              onChange={(value) => setPaymentCode(value)}
              disabled={isValidating}
            >
              <InputOTPGroup>
                {[...Array(PAYMENT_CODE_LENGTH)].map((_, index) => (
                  <InputOTPSlot 
                    key={index} 
                    index={index}
                    className={cn(
                      "w-14 h-14 text-2xl font-mono border-2 transition-all",
                      index < paymentCode.length && "border-primary bg-primary/5"
                    )}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <div className="flex justify-center gap-2">
              {[...Array(PAYMENT_CODE_LENGTH)].map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-3 h-3 rounded-full transition-colors",
                    i < paymentCode.length ? "bg-primary" : "bg-border"
                  )} 
                />
              ))}
            </div>
          </div>

          {retryCount > 0 && <Card className="bg-destructive/5 border-destructive/20"><CardContent className="p-4"><div className="flex items-start gap-2"><AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" /><div className="text-sm space-y-1"><p className="font-semibold text-destructive">Attempt {retryCount} of {MAX_PAYMENT_RETRIES}</p><p className="text-muted-foreground">{MAX_PAYMENT_RETRIES - retryCount} attempts remaining before order cancellation</p></div></div></CardContent></Card>}

          <Button size="lg" className="w-full gradient-primary shadow-md hover:shadow-glow transition-all text-lg h-14" onClick={handleSubmit} disabled={paymentCode.length !== PAYMENT_CODE_LENGTH || isValidating}>{isValidating ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Validating Payment...</> : <>Validate Payment<ShieldCheck className="ml-2 h-5 w-5" /></>}</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentValidation;
