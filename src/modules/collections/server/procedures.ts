import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from '@/constants'
import { db } from '@/db'
import { collections } from '@/db/schema'
import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import z from 'zod'

export const collectionsRouter = createTRPCRouter({
  getOne: baseProcedure.input(z.object({ slug: z.string() })).query(async ({ input, ctx }) => {
    const [collection] = await db.select().from(collections).where(eq(collections.slug, input.slug)).limit(1)

    if (!collection) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Collection not found' })
    }

    return collection
  }),
  getMany: baseProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(DEFAULT_PAGE),
        pageSize: z.number().int().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        featured: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, featured } = input

      const offset = (page - 1) * pageSize

      const collectionsData = await db
        .select()
        .from(collections)
        .where(featured !== undefined ? eq(collections.featured, featured) : undefined)
        .offset(offset)
        .limit(pageSize)

      const totalResult = collectionsData.length

      const total = Number(totalResult ?? 0)

      const totalPages = Math.ceil(total / pageSize)

      return {
        items: collectionsData,
        total,
        totalPages,
      }
    }),
})
