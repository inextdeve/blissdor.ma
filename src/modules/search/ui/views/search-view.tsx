import { Divider } from '@/components/Divider'
import ProductCard from '@/components/ProductCard'
import SectionSliderLargeProduct from '@/components/SectionSliderLargeProduct'
import PaginationComponent from '@/modules/collections/ui/components/Pagination'
import { getQueryClient, trpc } from '@/trpc/server'
import { Metadata } from 'next'
import SearchForm from '../components/search-form'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search page for soaps',
}

const SearchView = async ({ q, page }: { q?: string; page?: string }) => {
  const queryClient = getQueryClient()

  const products = await queryClient.fetchQuery(
    trpc.products.newGetMany.queryOptions({ search: q, page: Number(page), pageSize: 12 })
  )

  const featuredProducts = products.items

  return (
    <div>
      <div className={'h-24 w-full bg-primary-50 2xl:h-28 dark:bg-white/10'} />
      <div className="container">
        <header className="mx-auto -mt-10 flex max-w-2xl flex-col lg:-mt-7">
          <SearchForm currentValue={q || ''} />
        </header>
      </div>

      <div className="container flex flex-col gap-y-16 py-16 lg:gap-y-28 lg:pt-20 lg:pb-28">
        <main>
          {/* FILTER */}
          {/* <HeaderFilterSection /> */}

          {/* LOOP ITEMS */}
          <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 xl:grid-cols-4">
            {products.items.map((item) => (
              <ProductCard data={item} key={item.id} />
            ))}
          </div>

          {/* PAGINATION */}
          <div className="mt-20 flex justify-center lg:mt-24">
            <PaginationComponent currentPage={Number(page)} totalPages={products.totalPages} searchParams={{ q: q }} />
          </div>
        </main>

        <Divider />
        <SectionSliderLargeProduct products={featuredProducts} />
        {/* <Divider /> */}
        {/* <SectionPromo1 /> */}
      </div>
    </div>
  )
}

export default SearchView
