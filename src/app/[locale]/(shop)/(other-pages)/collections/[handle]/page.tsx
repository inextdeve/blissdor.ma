import { Divider } from '@/components/Divider'
import { FilterSortByMenuListBox } from '@/components/FilterSortByMenu'
import Pagination from '@/modules/collections/ui/components/Pagination'
import CollectionSlugView from '@/modules/collections/ui/views/collectionSlugView'
import { getQueryClient, trpc } from '@/trpc/server'

export async function generateStaticParams() {
  const queryClient = getQueryClient()

  const collections = await queryClient.fetchQuery(trpc.collections.getMany.queryOptions({}))

  return collections.items.map((p) => ({
    handle: p.slug,
  }))
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams

  const currentPage = Number(page) || 1

  const { handle } = await params
  const queryClient = getQueryClient()
  const data = await queryClient.fetchQuery(
    trpc.products.newGetMany.queryOptions({ collection: handle, page: currentPage })
  )

  return (
    <main>
      {/* TABS FILTER */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* <FiltersMenuTabs /> */}
        <FilterSortByMenuListBox className="ml-auto" />
      </div>

      <Divider className="mt-8" />

      {/* LOOP ITEMS */}
      <CollectionSlugView data={data.items} />

      {/* PAGINATION */}
      <div className="mt-20 flex justify-center lg:mt-24">
        <Pagination currentPage={currentPage} totalPages={data.totalPages} />
      </div>
    </main>
  )
}
