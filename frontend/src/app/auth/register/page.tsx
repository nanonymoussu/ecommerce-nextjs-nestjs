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

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  phone: z.string().optional(),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { register: registerUser } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError('')

      await registerUser(data)
      router.push('/dashboard')
    } catch (err: unknown) {
      const error = err as Error
      setError(error.message || 'An error occurred during registration')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <Card>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl text-center'>
              Create Account
            </CardTitle>
            <CardDescription className='text-center'>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              {error && (
                <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded'>
                  {error}
                </div>
              )}

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='firstName'>First Name</Label>
                  <Input
                    id='firstName'
                    placeholder='John'
                    {...register('firstName')}
                    disabled={isLoading}
                  />
                  {errors.firstName && (
                    <p className='text-sm text-red-600'>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='lastName'>Last Name</Label>
                  <Input
                    id='lastName'
                    placeholder='Doe'
                    {...register('lastName')}
                    disabled={isLoading}
                  />
                  {errors.lastName && (
                    <p className='text-sm text-red-600'>
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

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
                <Label htmlFor='phone'>Phone (Optional)</Label>
                <Input
                  id='phone'
                  type='tel'
                  placeholder='+1 (555) 123-4567'
                  {...register('phone')}
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className='text-sm text-red-600'>{errors.phone.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Create a strong password'
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
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <p className='text-center text-sm text-gray-600'>
                Already have an account?{' '}
                <Link
                  href='/auth/login'
                  className='text-blue-600 hover:underline'
                >
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
