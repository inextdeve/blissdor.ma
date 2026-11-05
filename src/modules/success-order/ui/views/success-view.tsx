import { CheckCircle, ShoppingBag } from 'lucide-react'

import { useTranslations } from 'next-intl'
import OrderSummary from '../components/order-summary'
import OrderTimeline from '../components/order-timeline'
import ShippingInfo from '../components/shipping-info'
import SupportCard from '../components/support-card'

type SuccessPageProps = {
  orderId: string
  items: any[]
  customer: {
    name: string
    phone: string
    address: string
    city: string
    paymentMethod?: string
  }
  total: number
  whatsappUrl: string
}

export default function SuccessView({ orderId, items, customer, total, whatsappUrl }: SuccessPageProps) {
  const t = useTranslations('successPage')
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-xl space-y-6">
        {/* Hero */}
        <section className="text-center">
          <div className="mx-auto flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm">
            <CheckCircle size={42} />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900">{t('hero.title')}</h1>

          <p className="mt-3 text-slate-600">{t('hero.description')}</p>

          <div className="mt-5 inline-flex rounded-full bg-white px-5 py-2 text-sm shadow">
            {t('hero.orderNumber')}:<strong className="ml-2">#{orderId}</strong>
          </div>
        </section>

        <OrderSummary items={items} total={total} />

        <ShippingInfo customer={customer} />

        <OrderTimeline />

        <SupportCard whatsappUrl={whatsappUrl} orderId={orderId} />

        <a
          href="/"
          className="flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-4 font-semibold text-white transition hover:bg-slate-800"
        >
          <ShoppingBag size={20} />
          {t('actions.continueShopping')}
        </a>

        <p className="pt-5 text-center text-xs text-slate-400">
          {t('footer.thankYou')}
          <strong className="text-slate-600"> Blissdor ❤️</strong>
        </p>
      </div>
    </div>
  )
}
