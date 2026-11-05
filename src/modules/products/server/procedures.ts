import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from '@/constants'
import { getProductDetailByHandle, getProducts } from '@/data/data'
import { db } from '@/db'
import { collections, productCollections, products, productVariants } from '@/db/schema'
import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { and, desc, eq, ilike, inArray, or, sql } from 'drizzle-orm'
import z from 'zod'

export const productsRouter = createTRPCRouter({
  getProductDetails: baseProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const product = await getProductDetailByHandle(input.id)

    if (!product) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })
    }

    return product
  }),
  getOne: baseProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const product = getProductDetailByHandle(input.id)

    if (!product) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })
    }

    return product
  }),
  getMany: baseProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(DEFAULT_PAGE),
        pageSize: z.number().int().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        collection: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      // TODO: Implement pagination and search logic
      const { page, pageSize, search, collection } = input

      const products = await getProducts()

      const data = products.filter((product) =>
        search ? product.title.toLowerCase().includes(search.toLowerCase()) : true
      )

      const total = { count: data.length }
      const totalPages = Math.ceil(total.count / pageSize)

      return { items: data, total: total.count, totalPages }
    }),
  newGetOne: baseProcedure.input(z.object({ handle: z.string() })).query(async ({ input }) => {
    const product = await db.select().from(products).where(eq(products.handle, input.handle)).limit(1)

    if (!product || product.length === 0) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })
    }

    const productData = product[0]

    // Fetch variants for the product
    const variants = await db.select().from(productVariants).where(eq(productVariants.productId, productData.id))

    // Fetch collections for the product
    const collectionsData = await db
      .select()
      .from(collections)
      .where(
        inArray(
          collections.id,
          db
            .select({
              collectionId: productCollections.collectionId,
            })
            .from(productCollections)
            .where(eq(productCollections.productId, productData.id))
        )
      )

    return {
      ...productData,
      collections: collectionsData,
      variants,
    }
  }),
  newGetMany: baseProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(DEFAULT_PAGE),

        pageSize: z.number().int().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),

        search: z.string().nullish(),

        collection: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize, search, collection } = input

      const offset = (page - 1) * pageSize

      const conditions = []

      // Search products
      if (search) {
        conditions.push(or(ilike(products.title, `%${search}%`), ilike(products.description, `%${search}%`)))
      }

      // Filter by collection slug
      if (collection) {
        const collectionResult = await db
          .select({
            id: collections.id,
          })
          .from(collections)
          .where(eq(collections.slug, collection))
          .limit(1)

        if (collectionResult.length === 0) {
          return {
            items: [],
            total: 0,
            totalPages: 0,
          }
        }

        const collectionId = collectionResult[0].id

        conditions.push(
          inArray(
            products.id,
            db
              .select({
                productId: productCollections.productId,
              })
              .from(productCollections)
              .where(eq(productCollections.collectionId, collectionId))
          )
        )
      }

      const where = conditions.length ? and(...conditions) : undefined

      const [totalResult] = await db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(products)

      const total = Number(totalResult?.count ?? 0)

      // Products
      const productRows = await db
        .select()
        .from(products)
        .where(where)
        .orderBy(desc(products.createdAt))
        .limit(pageSize)
        .offset(offset)

      // Variants
      const productIds = productRows.map((product) => product.id)

      const variants =
        productIds.length > 0
          ? await db.select().from(productVariants).where(inArray(productVariants.productId, productIds))
          : []

      // Attach variants to products
      const variantsByProduct = new Map<string, typeof variants>()

      for (const variant of variants) {
        const existing = variantsByProduct.get(variant.productId) ?? []

        existing.push(variant)

        variantsByProduct.set(variant.productId, existing)
      }

      const items = productRows.map((product) => ({
        ...product,

        variants: variantsByProduct.get(product.id) ?? [],
      }))

      const totalPages = Math.ceil(total / pageSize)

      return {
        items,
        total,
        totalPages,
      }
    }),
})
