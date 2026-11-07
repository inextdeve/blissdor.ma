import { db } from '@/db'
import { wishlistItems } from '@/db/schema'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'
import { and, count, desc, eq } from 'drizzle-orm'
import { z } from 'zod'

export const wishlistRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id

    const productIds = await db
      .select({ productId: wishlistItems.productId })
      .from(wishlistItems)
      .where(eq(wishlistItems.userId, userId))
      .orderBy(desc(wishlistItems.createdAt))

    const wishlistProducts = await db.query.wishlistItems.findMany({
      where: eq(wishlistItems.userId, ctx.auth.user.id),
      orderBy: [desc(wishlistItems.createdAt)],
      with: {
        product: {
          with: {
            variants: true,
          },
        },
      },
    })

    return wishlistProducts.map((item) => item.product).filter(Boolean)
  }),
  toggle: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id

      const [existingItem] = await db
        .select({ id: wishlistItems.id })
        .from(wishlistItems)
        .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, input.productId)))

      // Remove from wishlist
      if (existingItem) {
        await db
          .delete(wishlistItems)
          .where(and(eq(wishlistItems.id, existingItem.id), eq(wishlistItems.userId, userId)))

        return {
          added: false,
          message: 'Removed from wishlist',
        }
      }

      // Add to wishlist
      await db.insert(wishlistItems).values({
        userId,
        productId: input.productId,
      })

      return {
        added: true,
        message: 'Added to wishlist',
      }
    }),

  isInWishlist: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id

      const [item] = await db
        .select({ count: count() })
        .from(wishlistItems)
        .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, input.productId)))
        .limit(1)

      return Boolean(item.count)
    }),
})
