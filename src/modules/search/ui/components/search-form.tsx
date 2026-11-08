'use client'
import ButtonCircle from '@/shared/Button/ButtonCircle'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { redirect } from 'next/navigation'
import { useState } from 'react'

const SearchForm = ({ currentValue }: { currentValue: string }) => {
  const [value, setValue] = useState(currentValue)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!!value.trim()) {
          redirect('/search' + (value ? '?q=' + value : ''))
        }
      }}
      className="relative w-full"
    >
      <fieldset className="text-neutral-500 dark:text-neutral-300">
        <label htmlFor="search-input" className="sr-only">
          Search all icons
        </label>
        <HugeiconsIcon
          className="absolute top-1/2 left-3.5 -translate-y-1/2 text-2xl sm:left-5"
          icon={Search01Icon}
          size={24}
        />
        <input
          className="block w-full rounded-full border bg-white py-4 pr-5 pl-12 placeholder:text-zinc-500 focus:border-primary-300 focus:ring-3 focus:ring-primary-200/50 sm:py-5 sm:text-sm md:pl-15 dark:bg-neutral-800 dark:placeholder:text-zinc-400 dark:focus:ring-primary-600/25"
          type="search"
          placeholder="Type your keywords"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <ButtonCircle className="absolute top-1/2 right-2 -translate-y-1/2 sm:right-2.5" size="size-11" type="submit">
          <ArrowRightIcon className="size-5 text-white" />
        </ButtonCircle>
      </fieldset>
    </form>
  )
}

export default SearchForm
