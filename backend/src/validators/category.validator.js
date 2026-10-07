import { z } from 'zod';

export const createCategorySchema = {
  body: z.object({
    name: z
      .string({ required_error: 'Category name is required' })
      .min(2, 'Category name must be at least 2 characters')
      .max(50, 'Category name cannot exceed 50 characters')
      .trim(),
    image: z
      .string({ required_error: 'Category image URL is required' })
      .url('Invalid category image URL format')
      .trim(),
    sortOrder: z.coerce.number().int().nonnegative().optional().default(0),
    isActive: z.boolean().optional().default(true),
  }),
};

export const updateCategorySchema = {
  body: z.object({
    name: z
      .string()
      .min(2, 'Category name must be at least 2 characters')
      .max(50, 'Category name cannot exceed 50 characters')
      .trim()
      .optional(),
    image: z.string().url('Invalid category image URL format').trim().optional(),
    sortOrder: z.coerce.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
  }),
};
