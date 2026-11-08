import { db } from '@/db'
import { cartItems, carts, orderItems, orders, products, productVariants, user } from '@/db/schema'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { and, eq, sql } from 'drizzle-orm'
import z from 'zod'

export const orderRouter = createTRPCRouter({
  get: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, input.id), eq(orders.userId, ctx.auth.user.id)),
      with: {
        items: {
          with: {
            product: true,
            variant: true,
          },
        },
      },
    })

    if (!order) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Order not found',
      })
    }

    return order
  }),
  createOrder: protectedProcedure.input(z.object({})).mutation(async ({ ctx }) => {
    const userId = ctx.auth.user.id

    return db.transaction(async (tx) => {
      // 0. Get the authenticated user data
      const [userData] = await tx
        .select({ id: user.id, email: user.email, name: user.name, phone: user.phone, address: user.address })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1)
      // 1. Get the authenticated user's cart
      const [cart] = await tx.select({ id: carts.id }).from(carts).where(eq(carts.userId, userId)).limit(1)

      if (!cart) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Your cart is empty',
        })
      }

      // 2. Load cart items and current product/variant data
      const items = await tx
        .select({
          variantId: productVariants.id,
          productId: products.id,
          productName: products.title,
          price: productVariants.price,
          inventory: productVariants.inventory,
          color: productVariants.color,
          size: productVariants.size,
          quantity: cartItems.quantity,
        })
        .from(cartItems)
        .innerJoin(productVariants, eq(cartItems.variant_id, productVariants.id))
        .innerJoin(products, eq(productVariants.productId, products.id))
        .where(eq(cartItems.cartId, cart.id))

      if (items.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Your cart is empty',
        })
      }

      // 3. Validate stock and aggregate quantities by variant.
      // This also handles duplicate cart rows for the same variant.
      const quantities = new Map<string, number>()

      for (const item of items) {
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid cart quantity',
          })
        }

        quantities.set(item.variantId, (quantities.get(item.variantId) ?? 0) + item.quantity)
      }

      // Atomically decrement stock. If any update fails,
      // throwing rolls back the transaction.
      for (const [variantId, quantity] of quantities) {
        const [updatedVariant] = await tx
          .update(productVariants)
          .set({
            inventory: sql`${productVariants.inventory} - ${quantity}`,
          })
          .where(and(eq(productVariants.id, variantId), sql`${productVariants.inventory} >= ${quantity}`))
          .returning({ id: productVariants.id })

        if (!updatedVariant) {
          const item = items.find((i) => i.variantId === variantId)

          throw new TRPCError({
            code: 'CONFLICT',
            message: `${item?.productName ?? 'A product'} is out of stock or has insufficient inventory`,
          })
        }
      }

      // 4. Calculate total using database prices
      const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0)

      // 5. Create the order
      const [order] = await tx
        .insert(orders)
        .values({
          userId,
          totalAmount,
          fullName: userData.name,
          phone: userData.phone!,
          address: userData.address!,
          // status defaults to pending in the database
        })
        .returning()

      // 6. Save purchase-time snapshots
      await tx.insert(orderItems).values(
        items.map((item) => ({
          orderId: order.id,
          variantId: item.variantId,
          productId: item.productId,
          name: item.productName,
          price: item.price,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        }))
      )

      // 7. Clear the cart only after all order operations succeed
      await tx.delete(cartItems).where(eq(cartItems.cartId, cart.id))

      return order
    })
  }),
})
