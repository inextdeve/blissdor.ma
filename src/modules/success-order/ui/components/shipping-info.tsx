import { MapPin, User, Wallet } from 'lucide-react'

import { useTranslations } from 'next-intl'
import { CustomerInfo } from '../../../types'

export default function ShippingInfo({ customer }: { customer: CustomerInfo }) {
  const t = useTranslations('successPage.shipping')
  const rows = [
    {
      icon: <User />,
      title: customer.name,
      sub: customer.phone,
    },
    {
      icon: <MapPin />,
      title: customer.address,
      sub: t('country'),
    },
    {
      icon: <Wallet />,
      title: t('cashOnDelivery'),
      sub: t('cashOnDeliveryDescription'),
    },
  ]

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-lg font-bold">{t('title')}</h3>

      <div className="space-y-5">
        {rows.map((row, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              {row.icon}
            </div>

            <div>
              <p className="font-medium">{row.title}</p>

              <p className="text-sm text-slate-500">{row.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
