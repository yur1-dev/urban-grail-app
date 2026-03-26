import { apiClient } from './client';
import { endpoints, buildUrl } from './endpoints';
import {
  Product,
  Category,
  ProductFilters,
  PaginatedResponse,
  Review,
  CreateReviewRequest,
} from '../types/api';

/**
 * Products API Service
 */

export const productsApi = {
  /**
   * Get list of products with optional filters
   */
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get(endpoints.products.list, {
      params: filters,
    });
    return response.data.data || response.data;
  },

  /**
   * Get product by ID
   */
  async getProductDetail(productId: string): Promise<Product> {
    const response = await apiClient.get(
      buildUrl(endpoints.products.detail, { id: productId })
    );
    return response.data.data || response.data;
  },

  /**
   * Search products by query
   */
  async searchProducts(
    query: string,
    filters?: Partial<ProductFilters>
  ): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get(endpoints.products.search, {
      params: {
        ...filters,
        search: query,
      },
    });
    return response.data.data || response.data;
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(
    category: string,
    filters?: Partial<ProductFilters>
  ): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get(
      buildUrl(endpoints.products.category, { category }),
      { params: filters }
    );
    return response.data.data || response.data;
  },

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit?: number): Promise<Product[]> {
    const response = await apiClient.get(endpoints.products.featured, {
      params: limit ? { limit } : {},
    });
    return response.data.data || response.data;
  },

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get(endpoints.categories.list);
    return response.data.data || response.data;
  },

  /**
   * Get category by ID
   */
  async getCategoryDetail(categoryId: string): Promise<Category> {
    const response = await apiClient.get(
      buildUrl(endpoints.categories.detail, { id: categoryId })
    );
    return response.data.data || response.data;
  },

  /**
   * Get reviews for a product
   */
  async getProductReviews(
    productId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<Review>> {
    const response = await apiClient.get(
      buildUrl(endpoints.products.reviews, { id: productId }),
      {
        params: {
          page,
          limit,
        },
      }
    );
    return response.data.data || response.data;
  },

  /**
   * Add review to product
   */
  async addReview(
    productId: string,
    reviewData: CreateReviewRequest
  ): Promise<Review> {
    const response = await apiClient.post(
      buildUrl(endpoints.products.addReview, { id: productId }),
      reviewData
    );
    return response.data.data || response.data;
  },
};

export default productsApi;
