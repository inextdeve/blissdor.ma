import Aside from '@/components/aside'
import '@/styles/tailwind.css'
import { TRPCReactProvider } from '@/trpc/client'
import { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Plus_Jakarta_Sans, Tajawal } from 'next/font/google'
import GlobalClient from '../GlobalClient'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  variable: '--font-ar',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Blissdor',
    default: 'Blissdor',
  },
  description:
    'Blissdor creates handmade natural soaps crafted with premium botanical oils and nourishing ingredients. Discover artisan skincare for healthy, radiant, and beautiful skin.',
  keywords: [
    'Blissdor',
    'Blissdor soaps',
    'Blissdor handmade soap',
    'handmade natural soap',
    'handmade soap',
    'natural soap',
    'artisan soap',
    'botanical skincare',
    'natural skincare',
    'premium handmade soap',
    'luxury handmade soap',
    'organic soap',
    'herbal soap',
    'plant-based soap',
    'shea butter soap',
    'olive oil soap',
    'charcoal soap',
    'lavender soap',
    'black seed soap',
    'blue nila soap',
    'sidr soap',
    'essential oil soap',
  ],
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params

  const messages = await getMessages()

  const fontClass = locale === 'ar' ? tajawal.className : plusJakartaSans.className

  return (
    <TRPCReactProvider>
      <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={fontClass}>
        <body className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
          <NextIntlClientProvider messages={messages}>
            <Aside.Provider>
              {children}

              {/* Client component: Toaster, ... */}
              <GlobalClient />
            </Aside.Provider>
          </NextIntlClientProvider>
        </body>
      </html>
    </TRPCReactProvider>
  )
}
