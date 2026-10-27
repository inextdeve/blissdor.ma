import z from 'zod'

export const cartInsertSchema = z.object({
  productId: z.string(),
  productHandle: z.string(),
  name: z.string(),
  quantity: z.number(),
  size: z.string().nullish(),
  color: z.string().nullish(),
  price: z.number(),
  image: z.object({
    src: z.string(),
    alt: z.string().optional(),
  }),
})
