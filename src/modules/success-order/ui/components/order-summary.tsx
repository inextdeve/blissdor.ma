import { ShoppingBag } from 'lucide-react'
import { useTranslations } from 'next-intl'
type OrderItem = any

interface Props {
  items: OrderItem[]
  total: number
}

export default function OrderSummary({ items, total }: Props) {
  const t = useTranslations('successPage.order')
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="flex items-center gap-2 text-lg font-bold">
        <ShoppingBag size={20} />
        {t('title')}
      </h3>

      <div className="mt-5 space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between border-b pb-4">
            <p className="max-w-[80%] truncate font-semibold">{item.name}</p>

            <p className="font-bold">
              {t('currency')} {item.price}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3 text-sm">
        {/* <div className="flex justify-between">
          <span>Subtotal</span>

          <span>DH {total.toFixed(2)}</span>
        </div> */}

        <div className="flex justify-between">
          <span>{t('delivery')}</span>

          <span className="font-semibold text-green-600">
            {total >= 300 ? t('freeDelivery') : `${t('currency')} ${35}`}
          </span>
        </div>

        <div className="flex justify-between border-t pt-3 text-lg font-bold">
          <span>{t('total')}</span>

          <span>
            {t('currency')} {total >= 300 ? total : total + 35}
          </span>
        </div>
      </div>
    </div>
  )
}
