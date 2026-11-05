import z from 'zod'

export const cartInsertSchema = z.object({
  product_id: z.string(),
  product_handle: z.string(),
  variant_id: z.string(),
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
