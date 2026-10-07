import { z } from 'zod';

export const createFoodSchema = {
  body: z.object({
    categoryId: z
      .string({ required_error: 'Category ID is required' })
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Category ID format'),
    name: z
      .string({ required_error: 'Food name is required' })
      .min(2, 'Food name must be at least 2 characters')
      .max(100, 'Food name cannot exceed 100 characters')
      .trim(),
    description: z
      .string({ required_error: 'Food description is required' })
      .min(5, 'Food description must be at least 5 characters')
      .max(1000, 'Food description cannot exceed 1000 characters')
      .trim(),
    price: z.coerce
      .number({ required_error: 'Price is required' })
      .positive('Price must be greater than 0'),
    image: z
      .string({ required_error: 'Food image URL is required' })
      .url('Invalid food image URL format')
      .trim(),
    isAvailable: z.boolean().optional().default(true),
  }),
};

export const updateFoodSchema = {
  body: z.object({
    categoryId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Category ID format')
      .optional(),
    name: z
      .string()
      .min(2, 'Food name must be at least 2 characters')
      .max(100, 'Food name cannot exceed 100 characters')
      .trim()
      .optional(),
    description: z
      .string()
      .min(5, 'Food description must be at least 5 characters')
      .max(1000, 'Food description cannot exceed 1000 characters')
      .trim()
      .optional(),
    price: z.coerce.number().positive('Price must be greater than 0').optional(),
    image: z.string().url('Invalid food image URL format').trim().optional(),
    isAvailable: z.boolean().optional(),
  }),
};

export const foodQuerySchema = {
  query: z.object({
    categoryId: z.string().optional(),
    search: z.string().optional(),
    isAvailable: z
      .string()
      .optional()
      .transform((val) => (val !== undefined ? val === 'true' : undefined)),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
  }),
};
