import axios, { AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import {
  RegisterData,
  LoginData,
  ChangePasswordData,
  ForgotPasswordData,
  ResetPasswordData,
  AuthResponse,
  User,
  ProductsQueryParams,
  Product,
  PaginatedResponse,
  Category,
  CreateProductData,
  UpdateProductData,
  CreateCategoryData,
  UpdateCategoryData,
  Cart,
  AddToCartData,
  Order,
  CreateOrderData,
  UpdateOrderStatusData,
  WishlistItem,
  CreateAddressData,
  UpdateAddressData,
  Address,
  Payment,
  CreatePaymentData,
  Coupon,
  CreateCouponData,
  UpdateCouponData,
  CreateReviewData,
  Review,
} from '@/types/api.types'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = Cookies.get('refreshToken')
        if (refreshToken) {
          const response = await axios.post<{ accessToken: string }>(
            `${API_BASE_URL}/v1/auth/refresh`,
            {
              refreshToken,
            }
          )

          const { accessToken } = response.data
          Cookies.set('accessToken', accessToken, {
            expires: 1,
            secure: true,
            sameSite: 'strict',
          })

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        }
      } catch {
        // Refresh failed, redirect to login
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        Cookies.remove('user')

        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

// Auth API endpoints
export const authAPI = {
  register: (data: RegisterData) =>
    api.post<AuthResponse>('/v1/auth/register', data),

  login: (data: LoginData) => api.post<AuthResponse>('/v1/auth/login', data),

  logout: () => api.post<{ message: string }>('/v1/auth/logout'),

  getProfile: () => api.get<User>('/v1/auth/profile'),

  changePassword: (data: ChangePasswordData) =>
    api.patch<{ message: string }>('/v1/auth/change-password', data),

  forgotPassword: (data: ForgotPasswordData) =>
    api.post<{ message: string }>('/v1/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordData) =>
    api.post<{ message: string }>('/v1/auth/reset-password', data),

  verifyToken: () =>
    api.get<{ valid: boolean; user: User }>('/v1/auth/verify-token'),
}

// Products API endpoints
export const productsAPI = {
  getAll: (params?: ProductsQueryParams) =>
    api.get<PaginatedResponse<Product>>('/v1/products', { params }),
  getById: (id: number) => api.get<Product>(`/v1/products/${id}`),
  getBySlug: (slug: string) => api.get<Product>(`/v1/products/slug/${slug}`),
  getFeatured: (limit?: number) =>
    api.get<Product[]>('/v1/products/featured', { params: { limit } }),
  getRelated: (id: number, limit?: number) =>
    api.get<Product[]>(`/v1/products/${id}/related`, { params: { limit } }),
  create: (data: CreateProductData) => api.post<Product>('/v1/products', data),
  update: (id: number, data: UpdateProductData) =>
    api.patch<Product>(`/v1/products/${id}`, data),
  delete: (id: number) => api.delete<void>(`/v1/products/${id}`),
}

// Categories API endpoints
export const categoriesAPI = {
  getAll: () => api.get<Category[]>('/v1/categories'),
  getActive: () => api.get<Category[]>('/v1/categories/active'),
  getHierarchy: () => api.get<Category[]>('/v1/categories/hierarchy'),
  getById: (id: number) => api.get<Category>(`/v1/categories/${id}`),
  getBySlug: (slug: string) => api.get<Category>(`/v1/categories/slug/${slug}`),
  create: (data: CreateCategoryData) =>
    api.post<Category>('/v1/categories', data),
  update: (id: number, data: UpdateCategoryData) =>
    api.patch<Category>(`/v1/categories/${id}`, data),
  delete: (id: number) => api.delete<void>(`/v1/categories/${id}`),
}

// Cart API endpoints
export const cartAPI = {
  get: () => api.get<Cart>('/v1/carts'),
  addItem: (data: AddToCartData) => api.post<Cart>('/v1/carts/items', data),
  removeItem: (itemId: number) => api.delete<void>(`/v1/carts/items/${itemId}`),
  clear: () => api.delete<void>('/v1/carts'),
}

// Orders API endpoints
export const ordersAPI = {
  create: (data: CreateOrderData) => api.post<Order>('/v1/orders', data),
  getAll: () => api.get<Order[]>('/v1/orders'),
  getUserOrders: () => api.get<Order[]>('/v1/orders/my-orders'),
  getById: (id: number) => api.get<Order>(`/v1/orders/${id}`),
  updateStatus: (id: number, data: UpdateOrderStatusData) =>
    api.patch<Order>(`/v1/orders/${id}/status`, data),
  cancel: (id: number) => api.patch<Order>(`/v1/orders/${id}/cancel`),
}

// Wishlist API endpoints
export const wishlistAPI = {
  get: () => api.get<WishlistItem[]>('/v1/wishlists'),
  add: (productId: number) =>
    api.post<WishlistItem>('/v1/wishlists', { productId }),
  remove: (productId: number) => api.delete<void>(`/v1/wishlists/${productId}`),
}

// Address API endpoints
export const addressAPI = {
  getAll: () => api.get<Address[]>('/v1/addresses'),
  create: (data: CreateAddressData) => api.post<Address>('/v1/addresses', data),
  update: (id: number, data: UpdateAddressData) =>
    api.patch<Address>(`/v1/addresses/${id}`, data),
  delete: (id: number) => api.delete<void>(`/v1/addresses/${id}`),
}

// Payment API endpoints
export const paymentAPI = {
  create: (data: CreatePaymentData) => api.post<Payment>('/v1/payments', data),
  getByOrder: (orderId: number) =>
    api.get<Payment[]>(`/v1/payments/order/${orderId}`),
  getAll: () => api.get<Payment[]>('/v1/payments'),
}

// Coupon API endpoints
export const couponAPI = {
  create: (data: CreateCouponData) => api.post<Coupon>('/v1/coupons', data),
  getAll: () => api.get<Coupon[]>('/v1/coupons'),
  validate: (code: string) => api.get<Coupon>(`/v1/coupons/validate/${code}`),
  update: (id: number, data: UpdateCouponData) =>
    api.patch<Coupon>(`/v1/coupons/${id}`, data),
  delete: (id: number) => api.delete<void>(`/v1/coupons/${id}`),
}

// Review API endpoints
export const reviewAPI = {
  create: (data: CreateReviewData) => api.post<Review>('/v1/reviews', data),
  getByProduct: (productId: number) =>
    api.get<Review[]>(`/v1/reviews/product/${productId}`),
}

export default api
