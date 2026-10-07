import crypto from 'crypto';

/**
 * Generates a human-readable, non-sequential order number.
 * Example format: "FD-849201"
 */
export const generateOrderNumber = () => {
  const randomDigits = crypto.randomInt(100000, 999999);
  return `FD-${randomDigits}`;
};
