import { accountRouter, userRouter } from '@/modules/account/server/procedures'
import { cartRouter } from '@/modules/cart/server/procedures'
import { collectionsRouter } from '@/modules/collections/server/procedures'
import { orderRouter } from '@/modules/orders/server/procedures'
import { productsRouter } from '@/modules/products/server/procedures'
import { SPPRouter } from '@/modules/single-product/server/procedures'
import { wishlistRouter } from '@/modules/wishlists/server/procedures'
import { createTRPCRouter } from '../init'

export const appRouter = createTRPCRouter({
  products: productsRouter,
  collections: collectionsRouter,
  cart: cartRouter,
  account: accountRouter,
  user: userRouter,
  wishlist: wishlistRouter,
  sppOrders: SPPRouter,
  order: orderRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter
