// Common response wrapper
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

// Pagination
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}

// User types
export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'customer' | 'admin' | 'moderator'
  status: 'active' | 'inactive' | 'banned'
  isEmailVerified: boolean
  createdAt: string
  lastLogin?: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  token: string
  newPassword: string
}

// Product types
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
  sortOrder: number
  parentId?: number
  parent?: Category
  children?: Category[]
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  comparePrice?: number
  costPrice?: number
  sku: string
  inventory: number
  lowStockThreshold: number
  trackInventory: boolean
  weight: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  images?: string[]
  status: 'draft' | 'active' | 'inactive' | 'out_of_stock'
  isFeatured: boolean
  viewCount: number
  salesCount: number
  averageRating: number
  reviewCount: number
  attributes?: Record<string, unknown>
  tags?: string[]
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  categoryId: number
  category: Category
  createdAt: string
  updatedAt: string
}

export interface CreateProductData {
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  comparePrice?: number
  costPrice?: number
  sku: string
  inventory?: number
  lowStockThreshold?: number
  trackInventory?: boolean
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  images?: string[]
  status?: 'draft' | 'active' | 'inactive' | 'out_of_stock'
  isFeatured?: boolean
  attributes?: Record<string, unknown>
  tags?: string[]
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  categoryId: number
}

export type UpdateProductData = Partial<CreateProductData>

export interface ProductsQueryParams {
  page?: number
  limit?: number
  search?: string
  categoryId?: number
  status?: string
  isFeatured?: boolean
  minPrice?: number
  maxPrice?: number
  tags?: string[]
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  inStock?: boolean
}

// Category types
export interface CreateCategoryData {
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: number
  isActive?: boolean
  sortOrder?: number
}

export type UpdateCategoryData = Partial<CreateCategoryData>

// Cart types
export interface CartItem {
  id: number
  cartId: number
  productId: number
  quantity: number
  price: number
  total: number
  selectedVariant?: Record<string, unknown>
  product: Product
  createdAt: string
  updatedAt: string
}

export interface Cart {
  id: number
  userId: number
  sessionId?: string
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  couponCode?: string
  expiresAt?: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

export interface AddToCartData {
  productId: number
  quantity: number
}

// Order types
export interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: number
  total: number
  productSnapshot: {
    name: string
    description: string
    image: string
    sku: string
    attributes?: Record<string, unknown>
  }
  product: Product
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: number
  orderNumber: string
  userId: number
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  couponCode?: string
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded'
  paymentStatus:
    | 'pending'
    | 'paid'
    | 'failed'
    | 'refunded'
    | 'partially_refunded'
  shippingAddress?: {
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone?: string
  }
  billingAddress?: {
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone?: string
  }
  trackingNumber?: string
  shippingCarrier?: string
  shippedAt?: string
  deliveredAt?: string
  notes?: string
  user: User
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface CreateOrderData {
  items: {
    productId: number
    quantity: number
    price: number
  }[]
  shippingAddress: {
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone?: string
  }
  billingAddress?: {
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone?: string
  }
  couponCode?: string
  notes?: string
}

export interface UpdateOrderStatusData {
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded'
}

// Wishlist types
export interface WishlistItem {
  id: number
  userId: number
  productId: number
  notes?: string
  product: Product
  createdAt: string
  updatedAt: string
}

export interface AddToWishlistData {
  productId: number
}

// Address types
export interface Address {
  id: number
  userId: number
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  type: 'shipping' | 'billing' | 'both'
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateAddressData {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  type?: 'shipping' | 'billing' | 'both'
  isDefault?: boolean
}

export type UpdateAddressData = Partial<CreateAddressData>

// Payment types
export interface Payment {
  id: number
  orderId: number
  transactionId: string
  method:
    | 'credit_card'
    | 'debit_card'
    | 'paypal'
    | 'stripe'
    | 'bank_transfer'
    | 'cash_on_delivery'
  status:
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'cancelled'
    | 'refunded'
    | 'partially_refunded'
  amount: number
  refundedAmount: number
  currency: string
  failureReason?: string
  processedAt?: string
  refundedAt?: string
  metadata?: Record<string, unknown>
  order: Order
  createdAt: string
  updatedAt: string
}

export interface CreatePaymentData {
  orderId: number
  method:
    | 'credit_card'
    | 'debit_card'
    | 'paypal'
    | 'stripe'
    | 'bank_transfer'
    | 'cash_on_delivery'
  amount: number
  currency?: string
  metadata?: Record<string, unknown>
}

// Coupon types
export interface Coupon {
  id: number
  code: string
  name: string
  description?: string
  type: 'percentage' | 'fixed_amount' | 'free_shipping'
  value: number
  minimumAmount?: number
  maximumDiscount?: number
  usageLimit?: number
  usageCount: number
  userUsageLimit?: number
  validFrom?: string
  validUntil?: string
  status: 'active' | 'inactive' | 'expired'
  applicableCategories?: number[]
  applicableProducts?: number[]
  excludedCategories?: number[]
  excludedProducts?: number[]
  isFirstTimeOnly: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCouponData {
  code: string
  name: string
  description?: string
  type: 'percentage' | 'fixed_amount' | 'free_shipping'
  value: number
  minimumAmount?: number
  maximumDiscount?: number
  usageLimit?: number
  userUsageLimit?: number
  validFrom?: string
  validUntil?: string
  status?: 'active' | 'inactive' | 'expired'
  applicableCategories?: number[]
  applicableProducts?: number[]
  excludedCategories?: number[]
  excludedProducts?: number[]
  isFirstTimeOnly?: boolean
}

export type UpdateCouponData = Partial<CreateCouponData>

// Review types
export interface Review {
  id: number
  userId: number
  productId: number
  rating: number
  title: string
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  isVerifiedPurchase: boolean
  images?: string[]
  helpfulCount: number
  unhelpfulCount: number
  moderatorNote?: string
  user: User
  product: Product
  createdAt: string
  updatedAt: string
}

export interface CreateReviewData {
  productId: number
  rating: number
  title: string
  comment: string
  images?: string[]
}
