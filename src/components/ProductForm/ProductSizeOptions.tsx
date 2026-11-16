'use client'

import * as Headless from '@headlessui/react'

import clsx from 'clsx'
import { useState } from 'react'

type ProductOption =
  | {
      name: 'Color'
      optionValues: {
        name: string
        swatch: {
          color: string
          image: null
        }
      }[]
    }
  | {
      name: 'Size'
      optionValues: {
        name: string
        swatch: null
      }[]
    }
const ProductSizeOptions = ({
  options,
  className,
  defaultSize,
}: {
  options: ProductOption[]
  className?: string
  defaultSize: string
}) => {
  const [sizeSelected, setSizeSelected] = useState(defaultSize)

  if (!options?.length) {
    return null
  }
  const sizeOptionValues = options?.find((option) => option.name === 'Size')?.optionValues

  if (!sizeOptionValues?.length) {
    return null
  }

  return (
    <>
      <Headless.Field className={clsx(className)}>
        <Headless.RadioGroup value={sizeSelected} onChange={setSizeSelected} aria-label="size" name="size">
          <div className="flex justify-between text-sm font-medium">
            <Headless.Label>Weight</Headless.Label>
          </div>
          <div className="mt-2.5 grid grid-cols-5 gap-2 sm:grid-cols-7">
            {sizeOptionValues.map((size) => {
              const isActive = size.name === sizeSelected
              return (
                <Headless.Radio
                  key={size.name}
                  value={size.name}
                  as="div"
                  className={clsx(
                    'relative flex h-10 items-center justify-center overflow-hidden rounded-lg text-sm font-medium text-neutral-900 uppercase select-none hover:bg-neutral-50 sm:h-11 dark:text-neutral-200 dark:hover:bg-neutral-700',
                    isActive
                      ? 'ring-2 ring-neutral-900 dark:ring-neutral-200'
                      : 'ring-1 ring-neutral-200 dark:ring-neutral-500'
                  )}
                >
                  {size.name}
                </Headless.Radio>
              )
            })}
          </div>
        </Headless.RadioGroup>
      </Headless.Field>
    </>
  )
}

export default ProductSizeOptions
