import { api, API_ENDPOINTS } from './client';
import {
  Product,
  ProductDetail,
  ProductsResponse,
  ProductDetailResponse,
  CategoriesResponse,
  Category,
  SearchFilters,
  AddReviewRequest,
  AddReviewResponse,
} from '@types/index';

export const productsApi = {
  // Get all products with pagination and filters
  async getProducts(
    page: number = 1,
    limit: number = 10,
    filters?: SearchFilters
  ): Promise<ProductsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.category) {
      params.append('category', filters.category);
    }
    if (filters?.minPrice !== undefined) {
      params.append('minPrice', filters.minPrice.toString());
    }
    if (filters?.maxPrice !== undefined) {
      params.append('maxPrice', filters.maxPrice.toString());
    }
    if (filters?.rating !== undefined) {
      params.append('rating', filters.rating.toString());
    }
    if (filters?.inStock !== undefined) {
      params.append('inStock', filters.inStock.toString());
    }

    return api.get(
      `${API_ENDPOINTS.PRODUCTS.LIST}?${params.toString()}`
    );
  },

  // Get single product details
  async getProductDetail(productId: string): Promise<ProductDetailResponse> {
    return api.get(API_ENDPOINTS.PRODUCTS.DETAIL(productId));
  },

  // Search products
  async searchProducts(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ProductsResponse> {
    return api.get(
      `${API_ENDPOINTS.PRODUCTS.SEARCH}?query=${query}&page=${page}&limit=${limit}`
    );
  },

  // Get all categories
  async getCategories(): Promise<CategoriesResponse> {
    return api.get(API_ENDPOINTS.PRODUCTS.CATEGORIES);
  },

  // Get products by category
  async getProductsByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ProductsResponse> {
    return api.get(
      `${API_ENDPOINTS.PRODUCTS.LIST}?category=${categoryId}&page=${page}&limit=${limit}`
    );
  },

  // Add review to product
  async addReview(request: AddReviewRequest): Promise<AddReviewResponse> {
    return api.post(
      API_ENDPOINTS.REVIEWS.CREATE(request.productId),
      {
        rating: request.rating,
        title: request.title,
        comment: request.comment,
      }
    );
  },

  // Get product reviews
  async getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<any> {
    return api.get(
      `${API_ENDPOINTS.REVIEWS.LIST(productId)}?page=${page}&limit=${limit}`
    );
  },

  // Update review
  async updateReview(
    productId: string,
    reviewId: string,
    data: Partial<AddReviewRequest>
  ): Promise<AddReviewResponse> {
    return api.put(
      API_ENDPOINTS.REVIEWS.UPDATE(productId, reviewId),
      data
    );
  },

  // Delete review
  async deleteReview(productId: string, reviewId: string): Promise<any> {
    return api.delete(
      API_ENDPOINTS.REVIEWS.DELETE(productId, reviewId)
    );
  },
};
