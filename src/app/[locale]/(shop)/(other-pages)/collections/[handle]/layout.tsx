import { Divider } from '@/components/Divider'
import SectionSliderLargeProduct from '@/components/SectionSliderLargeProduct'
import { getQueryClient, trpc } from '@/trpc/server'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params

  const queryClient = getQueryClient()

  const collection = await queryClient.fetchQuery(trpc.collections.getOne.queryOptions({ slug: handle }))
  const title = collection?.name || 'Collection'
  const description =
    'Discover our handcrafted soaps, made by hand with high-quality natural ingredients. Gentle, moisturizing, and delicately scented, they provide care suitable for all skin types.'
  return {
    title,
    description,
  }
}

const Layout = async ({ children, params }: { children: React.ReactNode; params: Promise<{ handle: string }> }) => {
  const { handle } = await params
  const queryClient = getQueryClient()
  let collection

  try {
    collection = await queryClient.fetchQuery(
      trpc.collections.getOne.queryOptions({
        slug: handle,
      })
    )
  } catch (error) {
    notFound()
  }

  const { name } = collection

  const description =
    'Discover our handcrafted soaps, made by hand with high-quality natural ingredients. Gentle, moisturizing, and delicately scented, they provide care suitable for all skin types.'

  const { items: products } = await queryClient.fetchQuery(
    trpc.products.newGetMany.queryOptions({ collection: handle })
  )

  return (
    <div className="container flex flex-col gap-y-20 py-20 sm:gap-y-20 lg:gap-y-28 lg:py-28">
      <div>
        {/* HEADING */}
        <div className="max-w-3xl text-left">
          <h1 className="mt-2 block text-4xl font-semibold tracking-tight sm:text-[2.5rem]">{name}</h1>
          <p
            className="mt-6 block text-base text-neutral-500 dark:text-neutral-400"
            dangerouslySetInnerHTML={{ __html: description || '' }}
          />
        </div>

        {/* content */}
        <div className="mt-16 lg:mt-24">{children}</div>
      </div>

      <Divider />
      <SectionSliderLargeProduct products={products.slice(0, 4)} />
      {/* <Divider /> */}
      {/* <SectionPromo1 /> */}
    </div>
  )
}

export default Layout
