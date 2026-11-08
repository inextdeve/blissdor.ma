import SearchView from '@/modules/search/ui/views/search-view'

type PageSearchProps = {
  searchParams: Promise<{
    q?: string
    page?: string
  }>
}

const Page = async ({ searchParams }: PageSearchProps) => {
  const { q = '', page = '1' } = await searchParams
  return <SearchView q={q} page={page} />
}

export default Page
