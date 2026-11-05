import ProductCard from '@/components/ProductCard'
import { ProductNewGetMany } from '@/modules/products/types'

interface Props {
  data: ProductNewGetMany
}

export const CollectionSlugView = ({ data }: Props) => {
  return (
    <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 xl:grid-cols-4">
      {data?.map((product) => (
        <ProductCard data={product} key={product.id} />
      ))}
    </div>
  )
}

export default CollectionSlugView
