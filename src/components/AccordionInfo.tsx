'use client'

import { ProductNewGetOne } from '@/modules/products/types'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { FC } from 'react'

interface Props {
  panelClassName?: string
  product: ProductNewGetOne
}
interface CustomDiscloserProps {
  name: string
  content: string
  defaultOpen?: boolean
  panelClassName?: string
}
const CustomDiscloser = ({
  name,
  content,
  defaultOpen,
  panelClassName = 'p-4 pt-3 last:pb-0 text-neutral-600 text-sm dark:text-neutral-300 leading-6',
}: CustomDiscloserProps) => {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div>
          <DisclosureButton className="flex w-full items-center justify-between rounded-lg bg-neutral-100/80 px-4 py-2 text-left font-medium hover:bg-neutral-200/60 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-neutral-500/75 dark:bg-neutral-800 dark:hover:bg-neutral-700">
            <span>{name}</span>
            {!open ? (
              <PlusIcon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            ) : (
              <MinusIcon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            )}
          </DisclosureButton>
          <DisclosurePanel className={panelClassName} as="div">
            <div>{content}</div>
          </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  )
}

const AccordionInfo: FC<Props> = ({ product }) => {
  return (
    <div className="w-full space-y-2.5 rounded-2xl">
      {/* ============ */}
      <CustomDiscloser name={'Description'} content={product.description} defaultOpen={true} />
      <CustomDiscloser name={'Ingredients'} content={product.materials.join(' - ')} />
      <CustomDiscloser
        name={'How to use'}
        content={'Wet your skin, lather the soap, gently massage, then rinse thoroughly. Pat dry and moisturize. 🤍'}
      />

      {/* ============ */}
    </div>
  )
}

export default AccordionInfo
