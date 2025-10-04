export interface Flight {
  id: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  airline: string;
}

export interface Seat {
  id: string;
  row: number;
  column: string;
  type: "economy" | "business" | "first";
  price: number;
  isAvailable: boolean;
  occupiedBy?: string;
}

export type OrderStatus = "pending" | "confirmed" | "failed";

export interface Order {
  id: string;
  flight: Flight;
  seats: Seat[];
  status: OrderStatus;
  createdAt: Date;
  totalPrice: number;
}
