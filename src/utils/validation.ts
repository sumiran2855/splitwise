import { z } from 'zod';
import { AppError } from '@/src/utils/errors/AppError';

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new AppError(`Validation error: ${errorMessage}`, 400);
    }
    throw new AppError('Validation failed', 400);
  }
}
