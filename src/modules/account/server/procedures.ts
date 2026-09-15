import { db } from '@/db'
import { account, user } from '@/db/schema'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { updateUserSchema } from '../schemas'

export const accountRouter = createTRPCRouter({
  getSessionProvider: protectedProcedure.query(async ({ ctx }) => {
    const [accountProvider] = await db
      .select({ provider: account.providerId })
      .from(account)
      .where(eq(account.userId, ctx.auth.user.id))
    return accountProvider
  }),
})

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const [userData] = await db.select().from(user).where(eq(user.id, ctx.auth.user.id))
    if (!userData) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }
    return userData
  }),
  update: protectedProcedure.input(updateUserSchema).mutation(async ({ ctx, input }) => {
    const [updatedUser] = await db.update(user).set(input).where(eq(user.id, ctx.auth.user.id)).returning()

    if (!updatedUser) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }

    return updatedUser
  }),
})
