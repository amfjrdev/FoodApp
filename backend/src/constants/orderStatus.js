export const ORDER_STATUS = Object.freeze({
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
});

/**
 * State machine transition rules:
 * Defines valid status transitions for orders
 */
export const ALLOWED_STATUS_TRANSITIONS = Object.freeze({
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['OUT_FOR_DELIVERY', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
});

export const isValidStatusTransition = (currentStatus, nextStatus) => {
  if (currentStatus === nextStatus) return true;
  const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus];
  return allowed ? allowed.includes(nextStatus) : false;
};
