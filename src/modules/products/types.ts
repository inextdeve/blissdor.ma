import type { AppRouter } from '@/trpc/routers/_app'
import { inferRouterOutputs } from '@trpc/server'

export type ProductGetMany = inferRouterOutputs<AppRouter>['products']['getMany']['items']
export type ProductGetOne = inferRouterOutputs<AppRouter>['products']['getOne']
export type ProductNewGetMany = inferRouterOutputs<AppRouter>['products']['newGetMany']['items']
export type ProductNewGetOne = inferRouterOutputs<AppRouter>['products']['newGetOne']
