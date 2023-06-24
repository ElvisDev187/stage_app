import React, { useContext } from 'react'
import SearchBar from '../SearchBar'
import { UserContext } from '@/contexts/UserContext'

export default function Header() {
  const {profile} = useContext(UserContext)
  return (
    <div className='flex justify-between px-4 pt-4'>
        <SearchBar/>
        <h2>Welcome Back, {profile?.name}</h2>

    </div>
  )
}

