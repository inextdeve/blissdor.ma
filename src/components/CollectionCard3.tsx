import { CollectionGetMany } from '@/modules/collections/types'
import { Button } from '@/shared/Button/Button'
import clsx from 'clsx'
import { FC } from 'react'
import { Link } from './Link'

interface Props {
  className?: string
  collection: CollectionGetMany[number]
}

const CollectionCard3: FC<Props> = ({ className = '', collection }) => {
  if (!collection.slug) {
    return null
  }

  return (
    <div className={`group/CollectionCard3 relative block ${className}`}>
      <div className={clsx(`aspect-w-16 relative h-0 w-full overflow-hidden rounded-2xl aspect-h-11 sm:aspect-h-9`)}>
        <div
          className="absolute inset-0 transition-transform duration-500 ease-in-out group-hover/CollectionCard3:scale-[1.05]"
          style={{
            backgroundColor: collection.color,
            backgroundImage: collection.image ? `url(${collection.image.src})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div>
            <div className="absolute inset-5 flex flex-col sm:inset-8">
              <div className="max-w-xs">
                <span
                  className={`mb-2 block w-fit rounded-full bg-[#ef5958] px-2 py-[2px] text-sm font-semibold text-white`}
                >
                  {collection.name}
                </span>
                {collection.description && (
                  <h2
                    className={`text-2xl font-semibold text-white md:text-4xl`}
                    dangerouslySetInnerHTML={{ __html: collection.sortDescription || '' }}
                  ></h2>
                )}
              </div>
              <div className="mt-auto">
                <Button color="light" className="[--btn-border:white]/0">
                  Show me all
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Link href={'/collections/' + collection.slug} className="absolute inset-0" />
      </div>
    </div>
  )
}

export default CollectionCard3
