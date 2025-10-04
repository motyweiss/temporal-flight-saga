/**
 * Booking System Constants
 * Central configuration for all timing, limits, and validation rules
 */

// Timeout configurations (in seconds)
export const SEAT_RESERVATION_TIMEOUT = 15 * 60; // 15 minutes for seat selection
export const ORDER_REVIEW_TIMEOUT = 15 * 60; // 15 minutes for order review
export const PAYMENT_VALIDATION_TIMEOUT = 10; // 10 seconds for payment validation

// Timer warning thresholds (in seconds)
export const TIMER_WARNING_THRESHOLD = 60; // Show warning when 60 seconds remaining
export const TIMER_CRITICAL_THRESHOLD = 30; // Show critical alert at 30 seconds

// Payment validation settings
export const MAX_PAYMENT_RETRIES = 3;
export const PAYMENT_FAILURE_RATE = 0.15; // 15% simulated failure rate
export const PAYMENT_CODE_LENGTH = 5;

// Seat configuration
export const SEAT_ROWS = 20;
export const SEAT_COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F'];

// Seat type pricing
export const SEAT_PRICES = {
  economy: 50,
  business: 150,
  first: 300,
} as const;

// Business class rows
export const BUSINESS_CLASS_ROWS = [1, 2, 3];

// Animation delays (in milliseconds)
export const ANIMATION_DELAY = {
  short: 100,
  medium: 200,
  long: 300,
} as const;

// Order ID generation
export const ORDER_ID_PREFIX = 'CF';
export const ORDER_ID_LENGTH = 10;
