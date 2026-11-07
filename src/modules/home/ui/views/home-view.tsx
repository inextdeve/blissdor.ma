'use client'
import { Divider } from '@/components/Divider'
import SectionClientSay from '@/components/SectionClientSay'
import SectionSliderLargeProduct from '@/components/SectionSliderLargeProduct'
import SectionSliderProductCard from '@/components/SectionSliderProductCard'
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'

const HomeView = () => {
  const trpc = useTRPC()

  const { data: newProducts } = useQuery(trpc.products.newGetMany.queryOptions({ page: 1, pageSize: 10 }))

  return (
    <div className="relative container my-24 flex flex-col gap-y-24 lg:my-32 lg:gap-y-32">
      {newProducts?.items && <SectionSliderProductCard data={newProducts.items} />}
      <SectionClientSay />
      <Divider />
      {newProducts?.items && <SectionSliderLargeProduct products={newProducts.items} />}
      {newProducts?.items && (
        <SectionSliderProductCard data={newProducts.items} heading="Best Selling Products" subHeading="Organic Soaps" />
      )}
    </div>
  )
}

export default HomeView
