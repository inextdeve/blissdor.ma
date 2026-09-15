import { db } from '@/db'
import { cartItems, carts } from '@/db/schema'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import z from 'zod'
import { cartInsertSchema } from '../schema'

export const cartRouter = createTRPCRouter({
  get: protectedProcedure.input(z.object().optional()).query(async ({ ctx }) => {
    const cart = await db.query.carts.findFirst({
      where: eq(carts.userId, ctx.auth.user.id),
      with: {
        lines: {
          orderBy: (lines, { desc }) => [desc(lines.createdAt)],
        },
      },
    })

    if (!cart) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Cart not found',
      })
    }

    const subtotal = cart.lines.reduce((total, item) => total + item.price * item.quantity, 0)

    const totalQuantity = cart.lines.reduce((total, item) => total + item.quantity, 0)

    return { ...cart, subtotal, totalQuantity }
  }),
  addItem: protectedProcedure.input(cartInsertSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.auth.user.id

    let [cart] = await db.select().from(carts).where(eq(carts.userId, userId))

    if (!cart) {
      const [newCart] = await db
        .insert(carts)
        .values({
          userId,
        })
        .returning()

      cart = newCart
    }
    //   Check if the item is exist increase just the quantity
    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, cart.id),
          eq(cartItems.productId, input.productId),
          eq(cartItems.size, input.size ?? ''),
          eq(cartItems.color, input.color ?? '')
        )
      )

    if (existingItem) {
      await db
        .update(cartItems)
        .set({
          quantity: existingItem.quantity + input.quantity,
        })
        .where(eq(cartItems.id, existingItem.id))
    } else {
      await db.insert(cartItems).values({
        cartId: cart.id,
        ...input,
      })
    }

    return { success: true }
  }),
  removeItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [removedCartItem] = await db.delete(cartItems).where(eq(cartItems.id, input.id)).returning()

      if (!removedCartItem) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })
      }

      return removedCartItem
    }),
  updateItemQuantity: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        quantity: z.number().int().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updatedCartItem] = await db
        .update(cartItems)
        .set({
          quantity: input.quantity,
        })
        .where(eq(cartItems.id, input.id))
        .returning()

      if (!updatedCartItem) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })
      }

      return updatedCartItem
    }),
  //   addItem: baseProcedure
  //     .input(
  //       z.object({
  //         productId: z.string(),
  //         quantity: z.number().int().positive().default(1),
  //       })
  //     )
  //     .mutation(async ({ ctx, input }) => {
  //       return addCartItem(ctx.user.id, input)
  //     }),

  //   updateItem: baseProcedure
  //     .input(
  //       z.object({
  //         productId: z.string(),
  //         quantity: z.number().int().min(0),
  //       })
  //     )
  //     .mutation(async ({ ctx, input }) => {
  //       return updateCartItem(ctx.user.id, input)
  //     }),

  //   clear: baseProcedure.mutation(async ({ ctx }) => {
  //     return clearCart(ctx.user.id)
  //   }),
})
