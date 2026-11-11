import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from '@/shared/Pagination/Pagination'

interface PaginationProps {
  currentPage: number
  totalPages: number
  searchParams?: Record<string, string | string[] | undefined>
}

const PaginationComponent = ({ currentPage, totalPages, searchParams = {} }: PaginationProps) => {
  if (totalPages <= 1) return null

  const createHref = (page: number) => {
    const params = new URLSearchParams()

    Object.entries(searchParams).forEach(([key, value]) => {
      if (key === 'page' || value === undefined) return

      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v))
      } else {
        params.set(key, value)
      }
    })

    params.set('page', String(page))

    return `?${params.toString()}`
  }

  const pages =
    totalPages <= 4
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : currentPage <= 3
        ? [1, 2, 3, '...', totalPages]
        : [1, currentPage, currentPage + 1, '...', totalPages]

  return (
    <Pagination className="mx-auto">
      <PaginationPrevious href={currentPage > 1 ? createHref(currentPage - 1) : undefined} />

      <PaginationList>
        {pages.map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3">
              ...
            </span>
          ) : (
            <PaginationPage key={page} href={createHref(Number(page))} current={page === currentPage}>
              {page}
            </PaginationPage>
          )
        )}
      </PaginationList>

      <PaginationNext href={currentPage < totalPages ? createHref(currentPage + 1) : undefined} />
    </Pagination>
  )
}

export default PaginationComponent
