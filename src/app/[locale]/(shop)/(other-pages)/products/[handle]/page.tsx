import AccordionInfo from '@/components/AccordionInfo'
import AddToCardButton from '@/components/AddToCardButton'
import { Divider } from '@/components/Divider'
import LikeButton from '@/components/LikeButton'
import NcInputNumber from '@/components/NcInputNumber'
import Prices from '@/components/Prices'
import ProductColorOptions from '@/components/ProductForm/ProductColorOptions'
import ProductForm from '@/components/ProductForm/ProductForm'
import ProductSizeOptions from '@/components/ProductForm/ProductSizeOptions'
import SectionSliderProductCard from '@/components/SectionSliderProductCard'
import { getProductDetailByHandle, getProducts } from '@/data/data'
import Breadcrumb from '@/shared/Breadcrumb'
import { getQueryClient, trpc } from '@/trpc/server'
import { StarIcon } from '@heroicons/react/24/solid'
import { ShoppingBag03Icon, WhatsappFreeIcons } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Markdown, { Components } from 'react-markdown'
import GalleryImages from '../GalleryImages'
import Policy from '../Policy'
import ProductStatus from '../ProductStatus'

export async function generateStaticParams() {
  const queryClient = getQueryClient()

  const products = await queryClient.fetchQuery(trpc.products.getMany.queryOptions({}))

  return products.items.map((p) => ({
    handle: p.handle,
  }))
}

const markdownComponents: Components = {
  h1: (props) => <h1 className="mb-6 text-2xl font-medium" {...props} />,
  h2: (props) => <h2 className="mb-6 text-xl font-medium" {...props} />,
  h3: (props) => <h3 className="mb-6 text-lg font-medium" {...props} />,
  h4: (props) => <h4 className="mb-6 text-base font-medium" {...props} />,
  p: (props) => <p className="mb-6 leading-relaxed" {...props} />,
  ul: (props) => <ul className="mb-6 list-inside list-disc" {...props} />,
  ol: (props) => <ol className="mb-6 list-inside list-decimal" {...props} />,
  li: (props) => <li className="mb-1" {...props} />,
  strong: (props) => <strong className="font-semibold" {...props} />,
  code: (props) => <code className="rounded bg-gray-100 px-1 py-0.5" {...props} />,
  blockquote: (props) => <blockquote className="my-4 border-l-4 pl-4 italic" {...props} />,
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const product = await getProductDetailByHandle(handle)
  const title = product?.title || 'product detail'
  const description = product?.description || 'product detail page'
  return {
    title,
    description,
  }
}

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  const queryClient = getQueryClient()
  const { handle } = await params
  // const product = await getProductDetailByHandle(handle)
  // const product = await queryClient.fetchQuery(trpc.products.getProductDetails.queryOptions({ id: handle }))
  const relatedProducts = (await getProducts()).slice(2, 8)

  const product = await queryClient.fetchQuery(trpc.products.newGetOne.queryOptions({ handle: handle! }))

  const products = await queryClient.fetchQuery(trpc.products.newGetMany.queryOptions({ pageSize: 4 }))

  if (!product.id) {
    return notFound()
  }
  const status: string = 'limited edition'

  const { variants, title, featuredImage, rating, reviewNumber, images } = product

  // const sizeSelected = selectedOptions?.find((option) => option.name === 'Size')?.value || ''
  // const colorSelected = selectedOptions?.find((option) => option.name === 'Color')?.value || ''

  const renderRightSide = () => {
    return (
      <div className="w-full pt-10 lg:w-[45%] lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">
        <div className="sticky top-8 flex flex-col gap-y-10">
          {/* ---------- 1 HEADING ----------  */}
          <div>
            <Breadcrumb
              breadcrumbs={[
                { id: 1, name: 'Home', href: '/' },
                {
                  id: 2,
                  name: product.collections[0]?.name || 'Collection',
                  href: `/collections/${product.collections[0]?.slug}`,
                },
              ]}
              currentPage={product.title}
            />
            <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">{title}</h1>
            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2.5 sm:gap-x-6">
              <Prices
                contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold"
                price={variants[0]?.price || 0}
              />
              <div className="hidden h-7 border-l border-neutral-300 sm:block dark:border-neutral-700"></div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <a href="#reviews" className="flex items-center text-sm font-medium">
                  <StarIcon className="size-5 pb-px text-yellow-400" />
                  <div className="ms-1.5 flex">
                    <span>{rating}</span>
                    <span className="mx-2 block">·</span>
                    <span className="text-neutral-600 underline dark:text-neutral-400">{reviewNumber} reviews</span>
                  </div>
                </a>
                <span>·</span>
                <ProductStatus status={status} />
              </div>
            </div>
          </div>

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
              <Link
                target="_blank"
                href={`https://api.whatsapp.com/send?phone=212720277895&text=${product.title}`}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#25d366] px-4 py-4 text-xs/normal text-white shadow-lg"
              >
                <HugeiconsIcon
                  icon={WhatsappFreeIcons}
                  size={20}
                  color="currentColor"
                  className="hidden sm:block"
                  strokeWidth={1.5}
                />
                <span className="text-base/6 font-normal sm:ml-2.5">Order via WhatsApp</span>
              </Link>
              <div className="flex gap-x-3.5">
                <div className="flex items-center justify-center rounded-full bg-neutral-100/70 px-2 py-3 sm:p-3.5 dark:bg-neutral-800/70">
                  <NcInputNumber name="quantity" defaultValue={1} />
                </div>

                <AddToCardButton
                  as={'button'}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-xs/normal text-white shadow-lg hover:bg-neutral-800"
                  productId={product.id}
                  title={title || ''}
                  imageUrl={featuredImage?.src || ''}
                  // You can change it later with the legal quantity
                  quantity={1}
                  price={variants?.[0].price || 0}
                  size={variants?.[0].size || undefined}
                  color={variants?.[0].color || undefined}
                  handle={product.handle || undefined}
                  variantId={variants?.[0].id || undefined}
                  type="button"
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

          {/*  */}
          <Divider />
          {/*  */}

          {/* ---------- 5 ----------  */}
          <AccordionInfo product={product} />

          {/* ---------- 6 ----------  */}
          <div className="hidden xl:block">
            <Policy />
          </div>
        </div>
      </div>
    )
  }

  const renderDetailSection = (productDetails: string) => {
    return (
      <div className="">
        <h2 className="text-2xl font-semibold">Product Details</h2>
        <div className="prose prose-sm mt-7 sm:prose sm:max-w-4xl dark:prose-invert">
          <Markdown components={markdownComponents}>{productDetails}</Markdown>
        </div>
      </div>
    )
  }

  const renderLeftSide = () => {
    const galleryImages = [featuredImage, ...(images || [])].map((item) => item?.src).filter(Boolean) as string[]

    return (
      <div className="w-full lg:w-[55%]">
        <div className="relative">
          <GalleryImages images={galleryImages} gridType="grid5" />
          <LikeButton className="absolute top-3 left-3" />
        </div>
      </div>
    )
  }

  return (
    <main className="container mt-5 lg:mt-11">
      <div className="lg:flex">
        {renderLeftSide()}
        {renderRightSide()}
      </div>

      {/* DETAIL AND REVIEW */}
      <div className="mt-12 flex flex-col gap-y-10 sm:mt-16 sm:gap-y-16">
        <div className="block xl:hidden">
          <Policy />
        </div>
        {renderDetailSection(product.description)}
        {/* <Divider />
        <ProductReviews reviewNumber={reviewNumber || 0} rating={rating || 1} reviews={reviews} /> */}
        <Divider />
        {/* OTHER SECTION */}
        <SectionSliderProductCard
          data={products.items}
          heading="Customers also purchased"
          subHeading=""
          headingFontClassName="text-3xl font-semibold"
          headingClassName="mb-12 text-neutral-900 dark:text-neutral-50"
        />
        {/* SECTION */}
        <div className="pb-20 lg:pt-16 xl:pb-28">{/* <SectionPromo2 /> */}</div>
      </div>
    </main>
  )
}
