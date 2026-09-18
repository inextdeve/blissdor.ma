'use client'

import { CartProductLine } from '@/modules/cart/types'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import { Link } from '@/shared/link'
import { useTRPC } from '@/trpc/client'
import { InformationCircleIcon, ShoppingCart02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useIsFetching, useIsMutating, useSuspenseQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Information from '../components/Information'
import ProductLine from '../components/product-line'

const CheckoutView = () => {
  const trpc = useTRPC()

  const isCartFetching = useIsFetching(trpc.cart.get.queryOptions()) > 0

  const isUpdatingQuantity = useIsMutating(trpc.cart.updateItemQuantity.mutationOptions()) > 0

  const isCartUpdating = isCartFetching || isUpdatingQuantity

  const { data: cart } = useSuspenseQuery(trpc.cart.get.queryOptions({}))

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-1">
        <Information />
      </div>

      <div className="my-10 shrink-0 border-t lg:mx-10 lg:my-0 lg:border-t-0 lg:border-l xl:lg:mx-14 2xl:mx-16" />

      <div className="w-full lg:w-[36%]">
        {cart.lines.length ? (
          <>
            <h3 className="text-lg font-semibold">Order summary</h3>
            <div className="mt-8 divide-y divide-neutral-200/70 dark:divide-neutral-700">
              {cart.lines.map((product: CartProductLine) => (
                <ProductLine key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-10 border-t border-neutral-200/70 pt-6 text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
              {/* <Form action={onSubmitFormDiscountCode}>
            <Field>
              <Label className="text-sm">Discount code</Label>
              <div className="mt-1.5 flex gap-3">
                <Input className="flex-1" />
                <button
                  type="button"
                  className="flex w-24 items-center justify-center rounded-full border bg-neutral-50 font-medium text-neutral-800 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                >
                  Apply
                </button>
              </div>
            </Field>
          </Form> */}

              <div className="mt-4 flex justify-between py-2.5">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-200">
                  MAD {cart.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span>Shipping estimate</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-200">
                  {/* ${cart.cost.shipping.toFixed(2)} */}35 MAD
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span>Tax estimate</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-200">0%</span>
              </div>
              <div className="flex justify-between pt-4 text-base font-semibold text-neutral-900 dark:text-neutral-200">
                <span>Order total</span>
                <span>MAD {(Number(cart.subtotal) + 35).toFixed(2)}</span>
              </div>
            </div>

            <ButtonPrimary className="mt-8 w-full" disabled={isCartUpdating || cart.lines.length === 0}>
              Confirm order {isCartUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            </ButtonPrimary>
            <div className="mt-5 flex items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
              <p className="relative block pl-5">
                <HugeiconsIcon
                  icon={InformationCircleIcon}
                  size={16}
                  color="currentColor"
                  className="absolute top-0.5 -left-1"
                  strokeWidth={1.5}
                />
                Learn more{` `}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="#"
                  className="font-medium text-neutral-900 underline dark:text-neutral-200"
                >
                  Taxes
                </Link>
                <span>
                  {` `}and{` `}
                </span>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="#"
                  className="font-medium text-neutral-900 underline dark:text-neutral-200"
                >
                  Shipping
                </Link>
                {` `} infomation
              </p>
            </div>
          </>
        ) : (
          <div className="flex h-96 items-center justify-center dark:text-neutral-400">
            <div className="flex flex-col items-center gap-3">
              <HugeiconsIcon icon={ShoppingCart02Icon} size={48} />
              <p className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">Your cart is empty</p>
              <Link
                href="/"
                className="rounded-full bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckoutView
