import { ApiResponse, PaginatedResponse } from './api';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: Category | string;
  images: string[];
  thumbnail: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  stock: number;
  specifications?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetail extends Product {
  relatedProducts?: Product[];
  reviews?: Review[];
}

export interface Review {
  _id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
}

export interface ProductsResponse extends ApiResponse<PaginatedResponse<Product>> {}

export interface ProductDetailResponse extends ApiResponse<ProductDetail> {}

export interface CategoriesResponse extends ApiResponse<Category[]> {}

export interface AddReviewRequest {
  productId: string;
  rating: number;
  title: string;
  comment: string;
}

export interface AddReviewResponse extends ApiResponse<Review> {}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
}
