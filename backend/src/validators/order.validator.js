import { z } from 'zod';
import { ORDER_STATUS } from '../constants/orderStatus.js';

export const createOrderSchema = {
  body: z.object({
    customerName: z
      .string({ required_error: 'Customer name is required' })
      .min(2, 'Customer name must be at least 2 characters')
      .max(100, 'Customer name cannot exceed 100 characters')
      .trim(),
    customerPhone: z
      .string({ required_error: 'Customer phone number is required' })
      .min(5, 'Phone number must be at least 5 digits')
      .max(25, 'Phone number cannot exceed 25 characters')
      .trim(),
    deliveryAddress: z
      .string({ required_error: 'Delivery address is required' })
      .min(5, 'Delivery address must be at least 5 characters')
      .max(250, 'Delivery address cannot exceed 250 characters')
      .trim(),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').trim().optional(),
    items: z
      .array(
        z.object({
          foodId: z
            .string({ required_error: 'Food ID is required' })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Food ID format'),
          quantity: z.coerce
            .number({ required_error: 'Quantity is required' })
            .int('Quantity must be an integer')
            .min(1, 'Quantity must be at least 1')
            .max(50, 'Maximum 50 items per line item'),
        }),
        { required_error: 'Order items are required' }
      )
      .min(1, 'Order must contain at least one item'),
  }),
};

export const updateOrderStatusSchema = {
  body: z.object({
    status: z.enum(
      [
        ORDER_STATUS.PENDING,
        ORDER_STATUS.CONFIRMED,
        ORDER_STATUS.PREPARING,
        ORDER_STATUS.READY,
        ORDER_STATUS.OUT_FOR_DELIVERY,
        ORDER_STATUS.DELIVERED,
        ORDER_STATUS.CANCELLED,
      ],
      { required_error: 'Order status is required' }
    ),
  }),
};

export const orderQuerySchema = {
  query: z.object({
    status: z
      .enum([
        ORDER_STATUS.PENDING,
        ORDER_STATUS.CONFIRMED,
        ORDER_STATUS.PREPARING,
        ORDER_STATUS.READY,
        ORDER_STATUS.OUT_FOR_DELIVERY,
        ORDER_STATUS.DELIVERED,
        ORDER_STATUS.CANCELLED,
      ])
      .optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
  }),
};
