import type { AppRouter } from '@/trpc/routers/_app'
import { inferRouterOutputs } from '@trpc/server'

export type CartType = inferRouterOutputs<AppRouter>['cart']['get']
export type CartProductLine = CartType['lines'][number]
