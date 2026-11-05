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
}

const PaginationComponent = ({ currentPage, totalPages }: PaginationProps) => {
  if (totalPages <= 1) return null

  const pages =
    totalPages <= 4
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : currentPage <= 3
        ? [1, 2, 3, '...', totalPages]
        : [1, currentPage, currentPage + 1, '...', totalPages]

  return (
    <Pagination className="mx-auto">
      <PaginationPrevious href={currentPage > 1 ? `?page=${currentPage - 1}` : undefined} />

      <PaginationList>
        {pages.map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3">
              ...
            </span>
          ) : (
            <PaginationPage key={page} href={`?page=${page}`} current={page === currentPage}>
              {page}
            </PaginationPage>
          )
        )}
      </PaginationList>

      <PaginationNext href={currentPage < totalPages ? `?page=${currentPage + 1}` : undefined} />
    </Pagination>
  )
}

export default PaginationComponent
