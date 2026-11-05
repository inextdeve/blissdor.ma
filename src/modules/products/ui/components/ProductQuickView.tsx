'use client'

import AccordionInfo from '@/components/AccordionInfo'
import AddToCardButton from '@/components/AddToCardButton'
import { Divider } from '@/components/Divider'
import IconDiscount from '@/components/IconDiscount'
import LikeButton from '@/components/LikeButton'
import NcInputNumber from '@/components/NcInputNumber'
import Prices from '@/components/Prices'
import ProductColorOptions from '@/components/ProductForm/ProductColorOptions'
import ProductForm from '@/components/ProductForm/ProductForm'
import ProductSizeOptions from '@/components/ProductForm/ProductSizeOptions'
import { useAside } from '@/components/aside'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import { Link } from '@/shared/link'
import { useTRPC } from '@/trpc/client'
import { ClockIcon, NoSymbolIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import { ShoppingBag03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { FC, useState } from 'react'

interface ProductQuickViewProps {
  className?: string
}

const ProductQuickView: FC<ProductQuickViewProps> = ({ className }) => {
  const { productQuickViewHandle: handle } = useAside()
  const trpc = useTRPC()
  const [quantity, setQuantity] = useState(1)

  // const [_, setProduct] = useState<TProductDetail>()
  // Correct the id it need to get id
  const { data: product } = useQuery({
    ...trpc.products.newGetOne.queryOptions({
      handle: handle ?? '',
    }),
    enabled: !!handle,
  })

  if (!product) {
    return null
  }

  const { variants, title, featuredImage, rating, reviewNumber, images } = product

  const status: string = 'limited edition'

  const renderStatus = () => {
    if (!status) {
      return null
    }
    const CLASSES =
      'absolute top-3 start-3 px-2.5 py-1.5 text-xs bg-white dark:bg-neutral-900 nc-shadow-lg rounded-full flex items-center justify-center text-neutral-700 text-neutral-900 dark:text-neutral-300'
    if (status === 'New in') {
      return (
        <div className={CLASSES}>
          <SparklesIcon className="h-3.5 w-3.5" />
          <span className="ms-1 leading-none">{status}</span>
        </div>
      )
    }
    if (status === '50% Discount') {
      return (
        <div className={CLASSES}>
          <IconDiscount className="h-3.5 w-3.5" />
          <span className="ms-1 leading-none">{status}</span>
        </div>
      )
    }
    if (status === 'Sold Out') {
      return (
        <div className={CLASSES}>
          <NoSymbolIcon className="h-3.5 w-3.5" />
          <span className="ms-1 leading-none">{status}</span>
        </div>
      )
    }
    if (status === 'limited edition') {
      return (
        <div className={CLASSES}>
          <ClockIcon className="h-3.5 w-3.5" />
          <span className="ms-1 leading-none">{status}</span>
        </div>
      )
    }
    return null
  }

  const renderSectionContent = () => {
    return (
      <div className="space-y-8">
        {/* ---------- 1 HEADING ----------  */}
        <div>
          <h2 className="text-3xl font-semibold">
            <Link href={`/products/${handle}`}>{title}</Link>
          </h2>

          <div className="mt-5 flex flex-wrap items-center justify-start gap-x-4 gap-y-1.5 sm:gap-x-5 rtl:justify-end">
            <Prices contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold" price={variants?.[0].price || 1} />
            <div className="h-6 border-s border-neutral-300 dark:border-neutral-700"></div>
            <div className="flex items-center">
              <Link href={'/products/' + handle} className="flex items-center text-sm font-medium">
                <StarIcon className="h-5 w-5 pb-px text-yellow-400" />
                <div className="ms-1.5 flex">
                  <span>{rating}</span>
                  <span className="mx-2 block">·</span>
                  <span className="text-neutral-600 underline dark:text-neutral-400">{reviewNumber} reviews</span>
                </div>
              </Link>
              <span className="mx-2.5 hidden sm:block">·</span>
              <div className="hidden items-center text-sm sm:flex">
                <SparklesIcon className="h-3.5 w-3.5" />
                <span className="ms-1 leading-none">{status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
        <ProductForm product={product}>
          <fieldset className="flex flex-col gap-y-10">
            {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
            <div className="flex flex-col gap-y-8">
              <ProductColorOptions
                options={variants?.map((v) => ({
                  name: 'Color',
                  optionValues: [
                    {
                      name: v.color!,
                      swatch: {
                        color: v.color!,
                        image: null,
                      },
                    },
                  ],
                }))}
                defaultColor={variants?.[0].color!}
              />
              <ProductSizeOptions
                options={variants.map((v) => ({
                  name: 'Size',
                  optionValues: [
                    {
                      name: v.size!,
                      swatch: null,
                    },
                  ],
                }))}
                defaultSize={variants?.[0].size!}
              />
            </div>

            {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
            <div className="flex gap-x-3.5">
              <div className="flex items-center justify-center rounded-full bg-neutral-100/70 px-2 py-3 sm:p-3.5 dark:bg-neutral-800/70">
                <NcInputNumber
                  name="quantity"
                  defaultValue={1}
                  max={variants?.[0].inventory || 1}
                  onChange={setQuantity}
                />
              </div>

              <AddToCardButton
                as={ButtonPrimary}
                className="flex-1 cursor-pointer"
                productId={product.id}
                title={title || ''}
                imageUrl={featuredImage?.src || ''}
                // You can change it later with the legal quantity
                quantity={quantity}
                price={variants?.[0].price || 0}
                size={variants?.[0].size || undefined}
                color={variants?.[0].color || undefined}
                handle={product.handle || undefined}
                variantId={variants?.[0].id || undefined}
              >
                <HugeiconsIcon
                  icon={ShoppingBag03Icon}
                  size={20}
                  color="currentColor"
                  className="hidden sm:block"
                  strokeWidth={1.5}
                />
                <span className="text-base/6 font-normal sm:ml-2.5">Add to cart</span>
              </AddToCardButton>
            </div>
          </fieldset>
        </ProductForm>

        <Divider />

        {/* ---------- 5 ----------  */}
        <AccordionInfo product={product} />

        <div className="mt-6 flex text-sm text-neutral-500">
          <p className="text-xs">
            or{' '}
            <Link href={'/products/' + handle} className="text-xs font-medium text-neutral-900 uppercase">
              Go to product detail page <span aria-hidden="true"> →</span>
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="lg:flex">
        <div className="w-full lg:w-[50%]">
          <div className="relative">
            <div className="aspect-w-16 aspect-h-16">
              {images?.[0] && (
                <Image
                  src={images[0].src}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="w-full rounded-xl object-cover"
                  alt={images[0].alt!}
                />
              )}
            </div>

            {renderStatus()}
            <LikeButton className="absolute end-3 top-3" />
          </div>
          <div className="mt-3 hidden grid-cols-2 gap-3 sm:mt-6 sm:gap-6 lg:grid xl:mt-5 xl:gap-5">
            {[images?.[1], images?.[2]].map((image, index) => {
              if (!image?.src) {
                return null
              }
              return (
                <div key={index} className="aspect-w-3 aspect-h-4">
                  <Image
                    fill
                    src={image.src}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="w-full rounded-xl object-cover"
                    alt={image.alt || ''}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-full pt-6 lg:w-[50%] lg:ps-7 lg:pt-0 xl:ps-8">{renderSectionContent()}</div>
      </div>
    </div>
  )
}

export default ProductQuickView
