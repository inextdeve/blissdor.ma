import { Headset } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Props {
  whatsappUrl: string
  orderId: string
}

export default function SupportCard({ whatsappUrl }: Props) {
  const t = useTranslations('successPage.support')

  return (
    <div className="rounded-2xl bg-blue-50 p-6">
      <h3 className="flex items-center gap-2 font-bold text-blue-900">
        <Headset size={20} />
        {t('title')}
      </h3>

      <p className="mt-3 text-sm text-blue-800">{t('description')}</p>

      <a
        href={whatsappUrl}
        target="_blank"
        className="mt-5 flex justify-center rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
      >
        {t('whatsapp')}
      </a>
    </div>
  )
}
