import SectionCollectionSlider from '@/components/SectionCollectionSlider'
import SectionHero2 from '@/components/SectionHero/SectionHero2'
import SectionHowItWork from '@/components/SectionHowItWork/SectionHowItWork'
import HomeView from '@/modules/home/ui/views/home-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Handmade Natural Soaps & Artisan Skincare',
}

async function PageHome() {
  const queryClient = getQueryClient()
  const { items: featuredCollections } = await queryClient.fetchQuery(
    trpc.collections.getMany.queryOptions({ featured: true })
  )

  console.log('featuredCollections', featuredCollections)

  return (
    <div className="nc-PageHome relative overflow-hidden">
      <SectionHero2 />
      <SectionCollectionSlider className="mt-24 lg:mt-32" collections={featuredCollections} />
      <HomeView />
      <div className="pb-16">
        <SectionHowItWork />
      </div>
    </div>
  )
}

export default PageHome
