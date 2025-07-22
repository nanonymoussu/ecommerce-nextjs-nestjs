'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Navbar from '@/components/layout/Navbar'
import { productsAPI } from '@/lib/api'
import { ShoppingCart, Star, Search } from 'lucide-react'
import { Product } from '@/types/api.types'
import Image from 'next/image'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await productsAPI.getAll({
        page: currentPage,
        limit: 12,
        search: search || undefined,
        status: 'active',
      })
      setProducts(response.data.data)
      setTotalPages(response.data.pagination.pages)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, search])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts()
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            All Products
          </h1>

          {/* Search */}
          <form onSubmit={handleSearch} className='max-w-md'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <Input
                type='text'
                placeholder='Search products...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-10'
              />
            </div>
          </form>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {[...Array(12)].map((_, i) => (
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
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'>
              {products.map((product) => (
                <Card
                  key={product.id}
                  className='group hover:shadow-lg transition-shadow'
                >
                  <Link href={`/products/${product.slug}`}>
                    <div className='relative overflow-hidden rounded-t-lg'>
                      <Image
                        src={product.images?.[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        width={500}
                        height={500}
                        className='w-full h-48 object-cover group-hover:scale-105 transition-transform'
                      />
                    </div>
                  </Link>
                  <CardContent className='p-4'>
                    <div className='mb-2'>
                      <span className='text-xs text-gray-500 uppercase tracking-wide'>
                        {product.category.name}
                      </span>
                    </div>

                    <Link href={`/products/${product.slug}`}>
                      <h3 className='font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600'>
                        {product.name}
                      </h3>
                    </Link>

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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='flex justify-center space-x-2'>
                <Button
                  variant='outline'
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}

                <Button
                  variant='outline'
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {!loading && products.length === 0 && (
          <div className='text-center py-12'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              No products found
            </h3>
            <p className='text-gray-500'>Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
