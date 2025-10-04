import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Clock, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PaymentValidationProps {
  onSuccess: (orderId: string) => void;
  onFailure: () => void;
}

const VALIDATION_TIMEOUT = 10;
const MAX_RETRIES = 3;
const FAILURE_RATE = 0.15;

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
    return `CF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const validatePaymentCode = async () => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const isSuccess = Math.random() > FAILURE_RATE;
        resolve(isSuccess);
      }, 2000);
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
        title: "התשלום נכשל",
        description: `הגעת למקסימום ניסיונות (${MAX_RETRIES}). ההזמנה בוטלה.`,
        variant: "destructive",
      });
      setTimeout(() => onFailure(), 2000);
    } else {
      setRetryCount(retryCount + 1);
      toast({
        title: "אימות נכשל",
        description: `ניסיון ${retryCount + 1} מתוך ${MAX_RETRIES} נכשל. נסה שוב.`,
        variant: "destructive",
      });
      setPaymentCode("");
    }
  };

  const handleSubmit = async () => {
    if (paymentCode.length !== 5) {
      toast({
        title: "קוד לא תקין",
        description: "קוד התשלום חייב להכיל בדיוק 5 ספרות",
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
          title: "תשלום אושר!",
          description: "התשלום שלך אומת בהצלחה",
        });

        const orderId = generateOrderId();
        setTimeout(() => onSuccess(orderId), 1500);
      } else {
        handleValidationFailure();
      }
    }
  };

  const handleCodeChange = (value: string) => {
    const filtered = value.replace(/\D/g, "").slice(0, 5);
    setPaymentCode(filtered);
  };

  const progress = timeRemaining !== null ? ((VALIDATION_TIMEOUT - timeRemaining) / VALIDATION_TIMEOUT) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-3 animate-slide-up">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-magic flex items-center justify-center shadow-glow animate-float">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-4xl font-bold">אימות תשלום</h2>
        <p className="text-muted-foreground text-lg">
          הזן את קוד התשלום בן 5 הספרות להשלמת ההזמנה
        </p>
      </div>

      {timeRemaining !== null && (
        <Card className="border-2 border-warning/50 shadow-lg animate-scale-in">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Clock className="w-6 h-6 text-warning animate-pulse" />
                  <div>
                    <div className="font-bold text-lg">טיימר אימות</div>
                    <div className="text-sm text-muted-foreground">
                      התשלום חייב להיות מאומת בזמן
                    </div>
                  </div>
                </div>
                <div className="text-5xl font-bold text-warning tabular-nums">
                  {timeRemaining}s
                </div>
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
            קוד תשלום
          </CardTitle>
          <CardDescription>הזן את קוד בן 5 הספרות שקיבלת</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              value={paymentCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="● ● ● ● ●"
              className="text-center text-4xl font-mono tracking-[1em] h-20 border-2 focus:border-primary transition-colors"
              maxLength={5}
              disabled={isValidating}
              dir="ltr"
            />
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i < paymentCode.length ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>

          {retryCount > 0 && (
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="text-sm space-y-1">
                    <p className="font-semibold text-destructive">
                      ניסיון {retryCount} מתוך {MAX_RETRIES}
                    </p>
                    <p className="text-muted-foreground">
                      {MAX_RETRIES - retryCount} ניסיונות נותרו לפני ביטול ההזמנה
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {validationHistory.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">היסטוריית אימותים</h4>
              <div className="space-y-2">
                {validationHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                  >
                    <span className="text-sm">ניסיון {item.attempt}</span>
                    <Badge
                      variant={item.result === "success" ? "default" : "destructive"}
                      className="gap-1"
                    >
                      {item.result === "success" ? "✓ הצליח" : "✗ נכשל"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            size="lg"
            className="w-full gradient-primary shadow-md hover:shadow-glow transition-all text-lg h-14"
            onClick={handleSubmit}
            disabled={paymentCode.length !== 5 || isValidating}
          >
            {isValidating ? (
              <>
                <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                מאמת תשלום...
              </>
            ) : (
              <>
                אמת תשלום
                <ShieldCheck className="mr-2 h-5 w-5" />
              </>
            )}
          </Button>

          <div className="text-xs text-center text-muted-foreground space-y-1 pt-4 border-t">
            <p>• זמן אימות: {VALIDATION_TIMEOUT} שניות</p>
            <p>• מקסימום ניסיונות: {MAX_RETRIES}</p>
            <p>• אחוז כשלון מדומה: {FAILURE_RATE * 100}%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentValidation;
