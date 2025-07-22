'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { ShoppingCart, User, Search } from 'lucide-react'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <nav className='bg-white shadow-sm border-b'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link href='/' className='text-xl font-bold text-gray-900'>
              E-Store
            </Link>
          </div>

          {/* Search Bar */}
          <div className='flex-1 max-w-lg mx-8'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                placeholder='Search products...'
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className='flex items-center space-x-4'>
            <Link
              href='/products'
              className='text-gray-700 hover:text-gray-900'
            >
              Products
            </Link>
            <Link
              href='/categories'
              className='text-gray-700 hover:text-gray-900'
            >
              Categories
            </Link>

            {/* Shopping Cart */}
            <Link href='/cart' className='text-gray-700 hover:text-gray-900'>
              <ShoppingCart className='w-6 h-6' />
            </Link>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className='flex items-center space-x-2'>
                <Link href='/dashboard'>
                  <Button variant='ghost' size='sm'>
                    <User className='w-4 h-4 mr-2' />
                    {user.firstName}
                  </Button>
                </Link>
                <Button variant='ghost' size='sm' onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className='flex items-center space-x-2'>
                <Link href='/auth/login'>
                  <Button variant='ghost' size='sm'>
                    Login
                  </Button>
                </Link>
                <Link href='/auth/register'>
                  <Button size='sm'>Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
