'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, ShoppingBag, Heart, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Navbar />
        <div className='flex items-center justify-center py-20'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Welcome back, {user.firstName}!
          </h1>
          <p className='text-gray-600 mt-2'>
            Manage your account and track your orders
          </p>
        </div>

        {/* Quick Stats */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Card>
            <CardContent className='p-6 flex items-center'>
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4'>
                <ShoppingBag className='w-6 h-6 text-blue-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Total Orders</p>
                <p className='text-2xl font-bold'>0</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6 flex items-center'>
              <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4'>
                <Heart className='w-6 h-6 text-green-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Wishlist Items</p>
                <p className='text-2xl font-bold'>0</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6 flex items-center'>
              <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4'>
                <MapPin className='w-6 h-6 text-purple-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Addresses</p>
                <p className='text-2xl font-bold'>0</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6 flex items-center'>
              <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4'>
                <User className='w-6 h-6 text-orange-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Account Status</p>
                <p className='text-sm font-semibold capitalize text-green-600'>
                  {user.status}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Profile Overview */}
          <div className='lg:col-span-1'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <User className='w-5 h-5 mr-2' />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Full Name
                  </label>
                  <p className='text-gray-900'>
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Email
                  </label>
                  <p className='text-gray-900'>{user.email}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Phone
                  </label>
                  <p className='text-gray-900'>
                    {user.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Member Since
                  </label>
                  <p className='text-gray-900'>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button className='w-full mt-4' variant='outline'>
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-4'>
                  <Link href='/orders'>
                    <Button variant='outline' className='w-full h-20 flex-col'>
                      <ShoppingBag className='w-6 h-6 mb-2' />
                      View Orders
                    </Button>
                  </Link>

                  <Link href='/wishlist'>
                    <Button variant='outline' className='w-full h-20 flex-col'>
                      <Heart className='w-6 h-6 mb-2' />
                      Wishlist
                    </Button>
                  </Link>

                  <Link href='/addresses'>
                    <Button variant='outline' className='w-full h-20 flex-col'>
                      <MapPin className='w-6 h-6 mb-2' />
                      Addresses
                    </Button>
                  </Link>

                  <Link href='/products'>
                    <Button variant='outline' className='w-full h-20 flex-col'>
                      <ShoppingBag className='w-6 h-6 mb-2' />
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className='mt-6'>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-center py-8'>
                  <ShoppingBag className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-500'>No orders yet</p>
                  <Link href='/products'>
                    <Button className='mt-4'>Start Shopping</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
