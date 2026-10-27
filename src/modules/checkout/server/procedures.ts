import { db } from '@/db'
import { orderItems, orders, products, productVariants } from '@/db/schema'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { eq, inArray } from 'drizzle-orm'
import { createOrderSchema } from '../schema'

export const checkoutRouter = createTRPCRouter({
  createOrder: protectedProcedure.input(createOrderSchema).mutation(async ({ ctx, input }) => {
    return await db.transaction(async (tx) => {
      const variantIds = [...new Set(input.items.map((item) => item.variantId))]

      // Get variants + their products
      const variants = await tx
        .select({
          variantId: productVariants.id,
          productId: products.id,
          productName: products.title,
          price: productVariants.price,
          inventory: productVariants.inventory,
          color: productVariants.color,
          size: productVariants.size,
        })
        .from(productVariants)
        .innerJoin(products, eq(productVariants.productId, products.id))
        .where(inArray(productVariants.id, variantIds))

      if (variants.length !== variantIds.length) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'One or more product variants do not exist',
        })
      }

      const variantMap = new Map(variants.map((variant) => [variant.variantId, variant]))

      // Validate inventory
      for (const item of input.items) {
        const variant = variantMap.get(item.variantId)

        if (!variant) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Product variant not found',
          })
        }

        if (variant.inventory < item.quantity) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `${variant.productName} is out of stock`,
          })
        }
      }

      // Calculate total using DB prices
      const totalAmount = input.items.reduce((total, item) => {
        const variant = variantMap.get(item.variantId)!

        return total + variant.price * item.quantity
      }, 0)

      // Create order
      const [order] = await tx
        .insert(orders)
        .values({
          userId: ctx.auth.user.id,
          totalAmount,
          // status = pending from DB default
        })
        .returning()

      // Create order items
      await tx.insert(orderItems).values(
        input.items.map((item) => {
          const variant = variantMap.get(item.variantId)!

          return {
            orderId: order.id,

            variantId: variant.variantId,

            productId: variant.productId,

            name: variant.productName,

            // Snapshot current price
            price: variant.price,

            quantity: item.quantity,

            color: variant.color,

            size: variant.size,
          }
        })
      )

      // Decrease inventory
      for (const item of input.items) {
        const variant = variantMap.get(item.variantId)!

        await tx
          .update(productVariants)
          .set({
            inventory: variant.inventory - item.quantity,
          })
          .where(eq(productVariants.id, item.variantId))
      }

      return order
    })
  }),
})
