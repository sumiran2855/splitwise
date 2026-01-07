import { z } from 'zod';

export const createProfileSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  fullName: z.string().min(1, 'Full name is required').max(100, 'Full name must be less than 100 characters'),
  phone: z.string().optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional().or(z.literal('')),
  location: z.string().max(200, 'Location must be less than 200 characters').optional(),
  preferences: z.object({
    currency: z.enum(['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'INR']).optional(),
    timezone: z.string().optional(),
    language: z.enum(['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja']).optional(),
    emailNotifications: z.boolean().optional(),
    pushNotifications: z.boolean().optional(),
    weeklyDigest: z.boolean().optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
  }).optional(),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Full name must be less than 100 characters').optional(),
  phone: z.string().optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional().or(z.literal('')),
  location: z.string().max(200, 'Location must be less than 200 characters').optional(),
  preferences: z.object({
    currency: z.enum(['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'INR']).optional(),
    timezone: z.string().optional(),
    language: z.enum(['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja']).optional(),
    emailNotifications: z.boolean().optional(),
    pushNotifications: z.boolean().optional(),
    weeklyDigest: z.boolean().optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
  }).optional(),
});
