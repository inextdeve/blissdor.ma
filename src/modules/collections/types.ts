import { AppRouter } from '@/trpc/routers/_app'
import { inferRouterOutputs } from '@trpc/server'

export type CollectionGetMany = inferRouterOutputs<AppRouter>['collections']['getMany']['items']
