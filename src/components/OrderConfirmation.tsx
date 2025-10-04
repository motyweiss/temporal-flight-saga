import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Flight, Seat, OrderStatus } from "@/types/booking";
import { CheckCircle2, XCircle, Plane, Ticket, MapPin, Users, DollarSign, Sparkles, RefreshCcw } from "lucide-react";

interface OrderConfirmationProps {
  orderId: string;
  status: OrderStatus;
  flight: Flight | null;
  seats: Seat[];
  onStartOver: () => void;
}

const OrderConfirmation = ({
  orderId,
  status,
  flight,
  seats,
  onStartOver,
}: OrderConfirmationProps) => {
  const isSuccess = status === "confirmed";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-6 animate-slide-up">
        {isSuccess ? (
          <>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center animate-scale-in">
                  <CheckCircle2 className="w-14 h-14 text-success" />
                </div>
                <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-5xl font-bold text-success">Booking Confirmed!</h2>
              <p className="text-muted-foreground text-xl">
                Your flight has been successfully booked
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center animate-scale-in">
                  <XCircle className="w-14 h-14 text-destructive" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-5xl font-bold text-destructive">Booking Failed</h2>
              <p className="text-muted-foreground text-xl">
                Unfortunately, we couldn't complete your booking
              </p>
            </div>
          </>
        )}
      </div>

      {isSuccess && flight && (
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Card className="shadow-xl border-2 border-success/20 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-magic" />
            
            <CardHeader className="bg-gradient-to-b from-success/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Ticket className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">מספר הזמנה</div>
                    <div className="font-mono font-bold text-2xl">{orderId}</div>
                  </div>
                </div>
                <Badge className="bg-success text-success-foreground px-4 py-2 text-base">
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                  אושר
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 p-8">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Plane className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold">פרטי טיסה</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground">מספר טיסה</div>
                      <div className="font-bold text-xl">{flight.flightNumber}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">חברת תעופה</div>
                      <div className="font-bold text-xl">{flight.airline}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">המראה</span>
                      </div>
                      <div className="font-semibold">{flight.departure}</div>
                      <div className="text-2xl font-bold text-primary">{flight.departureTime}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">נחיתה</span>
                      </div>
                      <div className="font-semibold">{flight.arrival}</div>
                      <div className="text-2xl font-bold text-primary">{flight.arrivalTime}</div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold">מושבים</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {seats.map((seat) => (
                    <Badge
                      key={seat.id}
                      variant="secondary"
                      className="px-4 py-2 text-lg font-semibold hover:scale-110 transition-transform"
                    >
                      {seat.id}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold">סיכום תשלום</h3>
                </div>
                <div className="bg-muted/30 p-6 rounded-lg space-y-3">
                  <div className="flex justify-between text-lg">
                    <span className="text-muted-foreground">מחיר טיסה</span>
                    <span className="font-semibold">${flight.price}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-muted-foreground">מושבים ({seats.length})</span>
                    <span className="font-semibold">${seats.reduce((sum, s) => sum + s.price, 0)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xl font-bold">סה״כ ששולם</span>
                    <span className="text-4xl font-bold gradient-magic bg-clip-text text-transparent">
                      ${flight.price + seats.reduce((sum, s) => sum + s.price, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-dashed border-2">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="space-y-3">
                  <h4 className="font-bold text-lg">השלבים הבאים</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      אימייל אישור נשלח לכתובת המייל שלך
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      כרטיס אלקטרוני זמין בדף ההזמנות
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      הגע לשדה התעופה 2 שעות לפני ההמראה
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      צ׳ק-אין נפתח 24 שעות לפני ההמראה
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!isSuccess && (
        <Card className="shadow-lg border-2 border-destructive/20 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-8">
            <div className="space-y-6 text-center">
              <div>
                <h3 className="text-2xl font-bold mb-3">מה קרה?</h3>
                <p className="text-muted-foreground text-lg">
                  אימות התשלום נכשל לאחר מספר ניסיונות. המושבים ששמרת שוחררו.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-3 text-lg">סיבות אפשריות:</h4>
                <ul className="text-muted-foreground space-y-2 text-right inline-block">
                  <li>• תם הזמן לאימות קוד התשלום (מגבלת 10 שניות)</li>
                  <li>• קוד תשלום שגוי</li>
                  <li>• הגעת למקסימום ניסיונות (3 ניסיונות)</li>
                  <li>• כשל סימולטיבי בשער התשלום (שיעור 15%)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <Button
          size="lg"
          onClick={onStartOver}
          className={isSuccess ? "gradient-primary shadow-md hover:shadow-glow" : ""}
          variant={isSuccess ? "default" : "outline"}
        >
          {isSuccess ? (
            <>
              הזמן טיסה נוספת
              <Plane className="mr-2 h-5 w-5" />
            </>
          ) : (
            <>
              <RefreshCcw className="ml-2 h-5 w-5" />
              נסה שוב
            </>
          )}
        </Button>
      </div>

      {isSuccess && (
        <Card className="bg-muted/30 border-dashed animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-6">
            <h4 className="font-bold text-center mb-4 text-lg">
              סיכום Temporal Workflows
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <div className="font-semibold">שמירת מושבים</div>
                <div className="text-sm text-muted-foreground">טיימר 15 דקות מנוהל</div>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <div className="font-semibold">אימות תשלום</div>
                <div className="text-sm text-muted-foreground">טיימר 10 שניות מנוהל</div>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <div className="font-semibold">ניהול הזמנה</div>
                <div className="text-sm text-muted-foreground">מעקב סטטוס מקצה לקצה</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderConfirmation;
