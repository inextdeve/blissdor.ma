import CartView from '@/modules/cart/ui/views/cart-view'
import Breadcrumb from '@/shared/Breadcrumb'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

export const metadata: Metadata = {
  title: 'Cart Page',
  description: 'Your cart for your best soaps',
}

export const dynamic = 'force-dynamic'

const CartPage = async () => {
  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(trpc.cart.get.queryOptions({}))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="nc-CartPage">
        <main className="container py-16 lg:pt-20 lg:pb-28">
          <div className="mb-12 sm:mb-16">
            <h2 className="block text-2xl font-semibold sm:text-3xl lg:text-4xl">Shopping Cart</h2>
            <Breadcrumb
              breadcrumbs={[{ id: 1, name: 'Home', href: '/' }]}
              currentPage="Shopping Cart"
              className="mt-5"
            />
          </div>

          <hr className="my-10 border-neutral-200 xl:my-12 dark:border-neutral-700" />

          <Suspense fallback={<div>Loading...</div>}>
            <ErrorBoundary fallback={<div>Failed to load cart</div>}>
              <CartView />
            </ErrorBoundary>
          </Suspense>
        </main>
      </div>
    </HydrationBoundary>
  )
}
export default CartPage
