'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Navbar from '@/components/layout/Navbar'
import { productsAPI } from '@/lib/api'
import { ShoppingCart, Star, User } from 'lucide-react'
import { Product } from '@/types/api.types'
import Image from 'next/image'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getFeatured(8)
      setFeaturedProducts(response.data)
    } catch (error) {
      console.error('Error fetching featured products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      {/* Hero Section */}
      <section className='bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h1 className='text-4xl md:text-6xl font-bold mb-6'>
              Welcome to E-Store
            </h1>
            <p className='text-xl md:text-2xl mb-8'>
              Discover amazing products at unbeatable prices
            </p>
            <div className='space-x-4'>
              <Link href='/products'>
                <Button size='lg' variant='secondary'>
                  Shop Now
                </Button>
              </Link>
              <Link href='/categories'>
                <Button size='lg' variant='outline'>
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className='py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Featured Products
            </h2>
            <p className='text-gray-600'>Check out our most popular items</p>
          </div>

          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {[...Array(8)].map((_, i) => (
                <Card key={i} className='animate-pulse'>
                  <div className='w-full h-48 bg-gray-200 rounded-t-lg'></div>
                  <CardContent className='p-4'>
                    <div className='h-4 bg-gray-200 rounded mb-2'></div>
                    <div className='h-4 bg-gray-200 rounded mb-2'></div>
                    <div className='h-8 bg-gray-200 rounded'></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {featuredProducts.map((product) => (
                <Card
                  key={product.id}
                  className='group hover:shadow-lg transition-shadow'
                >
                  <div className='relative overflow-hidden rounded-t-lg'>
                    <Image
                      src={product.images?.[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      width={500}
                      height={500}
                      className='w-full h-48 object-cover group-hover:scale-105 transition-transform'
                    />
                  </div>
                  <CardContent className='p-4'>
                    <h3 className='font-semibold text-gray-900 mb-2 line-clamp-2'>
                      {product.name}
                    </h3>

                    <div className='flex items-center mb-2'>
                      <div className='flex items-center'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.averageRating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className='text-sm text-gray-500 ml-2'>
                        ({product.reviewCount})
                      </span>
                    </div>

                    <div className='flex items-center justify-between'>
                      <span className='text-lg font-bold text-gray-900'>
                        ${product.price}
                      </span>
                      <Button size='sm'>
                        <ShoppingCart className='w-4 h-4 mr-2' />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className='text-center mt-12'>
            <Link href='/products'>
              <Button size='lg'>View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <ShoppingCart className='w-8 h-8 text-blue-600' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>Free Shipping</h3>
              <p className='text-gray-600'>Free shipping on orders over $50</p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Star className='w-8 h-8 text-green-600' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>Quality Guarantee</h3>
              <p className='text-gray-600'>30-day money back guarantee</p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <User className='w-8 h-8 text-purple-600' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>24/7 Support</h3>
              <p className='text-gray-600'>Round the clock customer support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
