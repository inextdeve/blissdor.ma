import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Blissdor Collection',
  description:
    'Discover our handcrafted soaps, made by hand with high-quality natural ingredients. Gentle, moisturizing, and delicately scented, they provide care suitable for all skin types.',
}

const Layout = async ({ children }: { children: React.ReactNode; params: Promise<{ handle: string }> }) => {
  const description =
    'Discover our handcrafted soaps, made by hand with high-quality natural ingredients. Gentle, moisturizing, and delicately scented, they provide care suitable for all skin types.'

  return (
    <div className="container flex flex-col gap-y-20 py-20 sm:gap-y-20 lg:gap-y-28 lg:py-28">
      <div>
        {/* HEADING */}
        <div className="max-w-3xl text-left">
          <h1 className="mt-2 block text-4xl font-semibold tracking-tight sm:text-[2.5rem]">
            Explore our handcrafted soaps
          </h1>
          <p
            className="mt-6 block text-base text-neutral-500 dark:text-neutral-400"
            dangerouslySetInnerHTML={{ __html: description || '' }}
          />
        </div>

        {/* content */}
        <div className="mt-16 lg:mt-24">{children}</div>
      </div>
    </div>
  )
}

export default Layout
