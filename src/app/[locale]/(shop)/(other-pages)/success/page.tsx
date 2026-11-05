import SuccessView from '@/modules/success-order/ui/views/success-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { redirect } from 'next/navigation'

type PageProps = {
  searchParams: Promise<{ order_id?: string }>
}

const Page = async ({ searchParams }: PageProps) => {
  const orderId = (await searchParams).order_id || 'test-order-id'

  if (!orderId) {
    redirect('/')
  }

  const queryClient = getQueryClient()

  const order = await queryClient.fetchQuery(trpc.order.get.queryOptions({ id: orderId }))

  if (!order) {
    redirect('/404')
  }

  return (
    <SuccessView
      orderId={orderId}
      items={order.items}
      customer={{
        name: order.fullName,
        phone: order.phone,
        address: order.address,
        city: 'Maroc',
        paymentMethod: 'Cash On Delivery',
      }}
      total={order.totalAmount}
      whatsappUrl="https://api.whatsapp.com/send?phone=212720277895"
    />
  )
}

export default Page
