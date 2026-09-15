'use client'
import { Aside, useAside } from '@/components/aside/aside'
import CartBG from '@/images/cart-bg.png'
import { authClient } from '@/lib/auth-client'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import ButtonSecondary from '@/shared/Button/ButtonSecondary'
import { useTRPC } from '@/trpc/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import Link from 'next/link'
import { CartProduct } from './cart-product'

interface Props {
  className?: string
}

const AsideSidebarCart = ({ className = '' }: Props) => {
  const { close } = useAside()
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const session = authClient.useSession()

  const { data: cart } = useQuery(trpc.cart.get.queryOptions())

  const removeProductLine = useMutation(
    trpc.cart.removeItem.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.cart.get.queryOptions())
      },
      onError: (e) => {
        // toast.error(e.message);
      },
    })
  )

  const handleRemoveProductLine = async (id: string) => {
    removeProductLine.mutate({ id })
  }

  if (!session.data?.user.id) {
    return (
      <Aside openFrom="right" type="cart" heading="Shopping Cart">
        <div className={clsx('flex h-full flex-col', className)}>
          <div className="z-10 mt-20 flex flex-col items-center rounded-sm p-4 text-center">
            <p>Please login to see your cart.</p>
            <Link className="pt-2 text-sm text-blue-300 underline" href={'/login'}>
              {' '}
              Login{' '}
            </Link>
          </div>
        </div>
        <img src={CartBG.src} className="absolute bottom-0 left-0" />
      </Aside>
    )
  } else if (!cart || cart.lines.length === 0) {
    return (
      <Aside openFrom="right" type="cart" heading="Shopping Cart">
        <div className={clsx('flex h-full flex-col', className)}>
          <div className="z-10 mt-20 flex flex-col items-center rounded-sm p-4 text-center">
            <p>Your cart is empty.</p>
            <Link className="pt-2 text-sm text-blue-300 underline" href={'/collections/all'} onClick={close}>
              {' '}
              Continue Shopping{' '}
            </Link>
          </div>
        </div>
        <img src={CartBG.src} className="absolute bottom-0 left-0" />
      </Aside>
    )
  }

  return (
    <Aside openFrom="right" type="cart" heading="Shopping Cart">
      <div className={clsx('flex h-full flex-col', className)}>
        {/* CONTENT */}

        <div className="hidden-scrollbar flex-1 overflow-x-hidden overflow-y-auto py-6">
          <div className="flow-root">
            <ul role="list" className="-my-6 divide-y divide-neutral-900/10 dark:divide-neutral-100/10">
              {cart?.lines.map((product) => (
                <CartProduct key={product.id} product={product} onRemove={() => handleRemoveProductLine(product.id)} />
              ))}
            </ul>
          </div>
        </div>

        {/* FOOTER  */}
        <section
          aria-labelledby="summary-heading"
          className="mt-auto grid shrink-0 gap-4 border-t border-neutral-900/10 py-6 dark:border-neutral-100/10"
        >
          <h2 id="summary-heading" className="sr-only">
            Order summary
          </h2>
          <div>
            <div className="flex justify-between text-base font-medium text-gray-900 dark:text-neutral-100">
              <p className="font-medium">Subtotal</p>
              <p className="font-medium">MAD {cart?.subtotal}</p>
            </div>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <ButtonSecondary href={'/cart'}>View cart</ButtonSecondary>
              <ButtonPrimary href={'/checkout'}>Check out</ButtonPrimary>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-neutral-500 dark:text-neutral-400">
              <p className="text-xs">
                or{' '}
                <Link href={'/collections/all'} className="text-xs font-medium uppercase" onClick={close}>
                  Continue Shopping<span aria-hidden="true"> →</span>
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </Aside>
  )
}

export default AsideSidebarCart
