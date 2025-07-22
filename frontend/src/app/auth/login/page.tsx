'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError('')

      await login(data.email, data.password)
      router.push('/dashboard')
    } catch (error: unknown) {
      const err = error as Error
      setError(err.message || 'An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <Card>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl text-center'>Sign In</CardTitle>
            <CardDescription className='text-center'>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              {error && (
                <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded'>
                  {error}
                </div>
              )}

              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='john@example.com'
                  {...register('email')}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className='text-sm text-red-600'>{errors.email.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Enter your password'
                  {...register('password')}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className='text-sm text-red-600'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className='text-center space-y-2'>
                <Link
                  href='/auth/forgot-password'
                  className='text-sm text-blue-600 hover:underline'
                >
                  Forgot your password?
                </Link>

                <p className='text-sm text-gray-600'>
                  Don&apos;t have an account?{' '}
                  <Link
                    href='/auth/register'
                    className='text-blue-600 hover:underline'
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
