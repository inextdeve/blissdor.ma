import SPPSucessView from '@/modules/single-product/ui/views/spp-success-view'
import { getQueryClient } from '@/trpc/server'

type PageProps = {
  searchParams: Promise<{ order_id?: string }>
}

const Page = async ({ searchParams }: PageProps) => {
  const orderId = (await searchParams).order_id || 'test-order-id'

  // if (!orderId) {
  //   redirect('/')
  // }

  const queryClient = getQueryClient()

  // const order = await queryClient.fetchQuery(trpc.sppOrders.get.queryOptions({ id: orderId }))

  // if (!order) {
  //   redirect('/404')
  // }

  const order = {
    id: 'test-order-id',
    productName: 'Test Product',
    productPrice: 100,
    fullName: 'John Doe',
    phone: '1234567890',
    address: '123 Test Street',
  }

  return (
    <SPPSucessView
      orderId={orderId}
      items={[{ name: order?.productName, sku: '23', quantity: 2, price: order.productPrice }]}
      customer={{
        name: order.fullName,
        phone: order.phone,
        address: order.address,
        city: 'Maroc',
        paymentMethod: 'Cash On Delivery',
      }}
      total={order.productPrice}
      whatsappUrl="https://api.whatsapp.com/send?phone=212720277895"
    />
  )
}

export default Page
