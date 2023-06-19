import React from 'react'
import SearchBar from '../SearchBar'

export default function Header() {
  return (
    <div className='flex justify-between px-4 pt-4'>
        <h2>Dashboard</h2>
        <SearchBar/>
        <h2>Welcome Back, Clint</h2>

    </div>
  )
}

