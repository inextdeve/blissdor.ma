import NcInputNumber from '@/components/NcInputNumber'
import Prices from '@/components/Prices'
import { CartProductLine } from '@/modules/cart/types'
import { useTRPC } from '@/trpc/client'
import { PaintBucketIcon, WeightScale01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'

const ProductLine = ({ product }: { product: CartProductLine }) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { name, price, image, size, color, quantity, productId, id } = product

  const updateItemQuantity = useMutation(
    trpc.cart.updateItemQuantity.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(trpc.cart.get.queryOptions())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  )

  const removeItem = useMutation(
    trpc.cart.removeItem.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(trpc.cart.get.queryOptions())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  )
  const onRemoveItem = ({ itemId }: { itemId: string }) => {
    removeItem.mutate({ id: itemId })
  }

  const onUpdateItemQuantity = ({ itemId, quantity }: { itemId: string; quantity: number }) => {
    updateItemQuantity.mutate({ id: itemId, quantity })
  }

  return (
    <div className="flex py-5 last:pb-0">
      <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:w-32">
        {image?.src && (
          <Image
            fill
            src={image.src}
            alt={image.alt || ''}
            sizes="300px"
            className="object-cover object-center"
            priority
          />
        )}
        <Link href={'/products/' + productId} className="absolute inset-0"></Link>
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between gap-3">
            <div>
              <h3 className="text-base font-medium">
                <Link href={'/products/' + productId}>{name}</Link>
              </h3>
              <div className="mt-1.5 flex text-sm text-neutral-600 sm:mt-2.5 dark:text-neutral-300">
                <div className="flex items-center gap-x-2">
                  <HugeiconsIcon icon={PaintBucketIcon} size={16} color="currentColor" strokeWidth={1.5} />
                  <span>{color}</span>
                </div>
                <span className="mx-4 border-l border-neutral-200 dark:border-neutral-700"></span>
                <div className="flex items-center gap-x-2">
                  <HugeiconsIcon icon={WeightScale01Icon} size={16} color="currentColor" strokeWidth={1.5} />
                  <span>{size}</span>
                </div>
              </div>
            </div>
            <Prices price={price || 0} className="mt-0.5" />
          </div>
        </div>
        <div className="mt-auto flex items-end justify-between pt-4 text-sm">
          <div className="hidden sm:block">
            <NcInputNumber
              defaultValue={quantity}
              className="relative z-10"
              onChange={(value) => onUpdateItemQuantity({ itemId: id, quantity: value })}
            />
          </div>

          <div className="relative z-10 mt-3 flex items-center text-sm font-medium text-primary-600 hover:text-primary-500">
            <span className="cursor-pointer" onClick={() => onRemoveItem({ itemId: id })}>
              Remove
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductLine
