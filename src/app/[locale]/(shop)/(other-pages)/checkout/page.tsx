import CheckoutView from '@/modules/checkout/ui/views/checkout-view'
import Breadcrumb from '@/shared/Breadcrumb'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout Page',
  description: 'Checkout',
}

export const dynamic = 'force-dynamic'

const CheckoutPage = async () => {
  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(trpc.cart.get.queryOptions({}))

  return (
    <main className="container py-16 lg:pt-20 lg:pb-28">
      <div className="mb-16">
        <h1 className="mb-5 block text-3xl font-semibold lg:text-4xl">Checkout</h1>
        <Breadcrumb
          breadcrumbs={[
            { id: 1, name: 'Home', href: '/' },
            { id: 2, name: 'Cart', href: '/cart' },
          ]}
          currentPage="Checkout"
        />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CheckoutView />
      </HydrationBoundary>
    </main>
  )
}

export default CheckoutPage
