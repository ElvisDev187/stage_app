'use client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useCallback, useEffect, useRef, useState } from 'react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'
import { useOnClickOutside } from '../hooks/use-click-outside'
import { Users } from 'lucide-react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'



const SearchBar= ({}) => {
  const [input, setInput] = useState('')
  const pathname = usePathname()
  const commandRef = useRef(null)
  const router = useRouter()
  const supabase = useSupabaseClient()

  useOnClickOutside(commandRef, () => {
    setInput('')
  })

  const request = debounce(async () => {
    refetch()
  }, 300)

  const debounceRequest = useCallback(() => {
    request()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    isFetching,
    data: queryResults,
    refetch,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      if (!input) return []
      const { data } = await supabase.from("profiles").select('name,id').ilike('name', `%${input}%`)
      return data 
    },
    queryKey: ['search-query'],
    enabled: false,
  })

  useEffect(() => {
    setInput('')
  }, [pathname])

  return (
    <Command
      ref={commandRef}
      className='relative rounded-lg border max-w-lg z-50 overflow-visible'>
      <CommandInput
        onValueChange={(text) => {
          setInput(text)
          debounceRequest()
        }}
        value={input}
        className='outline-none border-none focus:border-none focus:outline-none ring-0'
        placeholder='Search users...'
      />

      {input.length > 0 && (
        <CommandList className='absolute bg-white top-full inset-x-0 shadow rounded-b-md'>
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading='users'>
              {queryResults?.map((user) => (
                <CommandItem
                  onSelect={(e) => {
                    // router.push(`/profile/${user.id}`)
                    // router.refresh()
                  }}
                  key={user.id}
                  value={user.name}>
                  <Users className='mr-2 h-4 w-4' />
                  <span>{user.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      )}
    </Command>
  )
}

export default SearchBar