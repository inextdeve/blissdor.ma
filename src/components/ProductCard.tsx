'use client'

import { ProductNewGetMany } from '@/modules/products/types'
import { WishListButton } from '@/modules/wishlists/ui/components/wishlist-button'
import NcImage from '@/shared/NcImage/NcImage'
import { Link } from '@/shared/link'
import { ArrowsPointingOutIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import { FC } from 'react'
import AddToCardButton from './AddToCardButton'
import Prices from './Prices'
import ProductStatus from './ProductStatus'
import { useAside } from './aside'

interface Props {
  className?: string
  data: ProductNewGetMany[number]
  isLiked?: boolean
}

const ProductCard: FC<Props> = ({ className = '', data, isLiked }) => {
  const { id, variants, title, rating, handle, reviewNumber, images, featuredImage } = data

  const { open: openAside, setProductQuickViewHandle } = useAside()

  const renderColorOptions = () => {
    const optionColorValues = Array.from(new Set(variants?.map((variant) => variant.color)))

    if (!optionColorValues?.length) {
      return null
    }

    return (
      <div className="flex gap-2">
        {optionColorValues.map((color) => (
          <div key={color} className="relative size-4 cursor-pointer overflow-hidden rounded-full">
            <div
              className="absolute inset-0 z-0 rounded-full bg-cover ring-1 ring-neutral-900/20 dark:ring-white/20"
              style={{
                backgroundColor: color!,
                // backgroundImage: color.swatch?.image ? `url(${color.swatch.image})` : undefined,
              }}
            />
          </div>
        ))}
      </div>
    )
  }

  const renderGroupButtons = () => {
    return (
      <div className="invisible absolute inset-x-1 bottom-0 flex justify-center gap-1.5 opacity-0 transition-all group-hover:visible group-hover:bottom-4 group-hover:opacity-100">
        <AddToCardButton
          // disabled={variants?.length === 0}
          as={'button'}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-xs/normal text-white shadow-lg hover:bg-neutral-800"
          productId={data.id!}
          title={title || ''}
          imageUrl={featuredImage?.src || ''}
          price={variants?.[0]?.price || 1}
          quantity={1}
          size={variants?.[0].size || undefined}
          color={variants?.[0].color || undefined}
          handle={handle}
          variantId={variants?.[0].id || undefined}
        >
          <ShoppingBagIcon className="-ml-1 size-3.5" />
          <span>Add to bag</span>
        </AddToCardButton>

        <button
          className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-xs/normal text-neutral-950 shadow-lg hover:bg-neutral-50"
          type="button"
          onClick={() => {
            setProductQuickViewHandle(handle || '')
            openAside('product-quick-view')
          }}
        >
          <ArrowsPointingOutIcon className="-ml-1 size-3.5" />
          <span>Quick view</span>
        </button>
      </div>
    )
  }

  return (
    <>
      <div className={`product-card relative flex flex-col bg-transparent ${className}`}>
        <Link href={'/products/' + handle} className="absolute inset-0"></Link>
        <div className="group relative z-1 shrink-0 overflow-hidden rounded-3xl bg-neutral-50 dark:bg-neutral-300">
          <Link href={'/products/' + handle} className="block">
            {featuredImage?.src && (
              <NcImage
                containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0"
                src={featuredImage.src}
                className="h-full w-full object-cover"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 40vw"
                alt={handle}
              />
            )}
          </Link>
          <ProductStatus status={'limited edition'} />
          <WishListButton productId={data.id!} className="absolute end-3 top-3 z-10" />
          {renderGroupButtons()}
        </div>
        <div className="space-y-4 px-2.5 pt-5 pb-2.5">
          {renderColorOptions()}
          <div>
            <h2 className="nc-ProductCard__title text-base font-semibold transition-colors">{title}</h2>
            <p className={`mt-1 text-sm text-neutral-500 dark:text-neutral-400`}>{variants?.[0]?.color}</p>
          </div>

          <div className="flex items-end justify-between">
            <Prices price={variants?.[0]?.price || 1} />
            <div className="mb-0.5 flex items-center">
              <StarIcon className="h-5 w-5 pb-px text-amber-400" />
              <span className="ms-1 text-sm text-neutral-500 dark:text-neutral-400">
                {rating || ''} ({reviewNumber || 0} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductCard
