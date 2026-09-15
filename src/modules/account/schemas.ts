import { z } from 'zod'

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  address: z.string().optional(),
  gender: z.enum(['male', 'female', 'not set']).optional(),
  phone: z.string().min(1, 'Phone number is required').optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>
