import { create } from 'zustand';
import { Product, Category, ProductFilters, PaginatedResponse } from '../types/api';
import { productsApi } from '../api/products.api';
import { handleApiError } from '../utils/errorHandler';

interface ProductState {
  // Products
  products: Product[];
  selectedProduct: Product | null;
  featured: Product[];

  // Pagination
  currentPage: number;
  totalPages: number;
  pageSize: number;

  // Filters
  selectedCategory: string | null;
  searchQuery: string;
  sortBy: 'price' | 'rating' | 'newest' | 'popularity' | null;

  // Categories
  categories: Category[];

  // Loading & Error
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchProductDetail: (productId: string) => Promise<void>;
  fetchFeaturedProducts: (limit?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  setSelectedCategory: (category: string | null) => void;
  setSortBy: (sort: 'price' | 'rating' | 'newest' | 'popularity') => void;
  setPage: (page: number) => void;
  clearError: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  selectedProduct: null,
  featured: [],
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  selectedCategory: null,
  searchQuery: '',
  sortBy: null,
  categories: [],
  isLoading: false,
  error: null,

  fetchProducts: async (filters?: ProductFilters) => {
    set({ isLoading: true, error: null });
    try {
      const state = get();
      const response = await productsApi.getProducts({
        category: state.selectedCategory || undefined,
        search: state.searchQuery || undefined,
        sort: state.sortBy || undefined,
        page: state.currentPage,
        limit: state.pageSize,
        ...filters,
      });

      set({
        products: response.data,
        currentPage: response.pagination.page,
        totalPages: response.pagination.pages,
        isLoading: false,
      });

      console.log('[v0] Products loaded:', response.data.length);
    } catch (error: any) {
      const apiError = handleApiError(error);
      set({
        isLoading: false,
        error: apiError.message,
      });
      throw apiError;
    }
  },

  fetchProductDetail: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productsApi.getProductDetail(productId);
      set({
        selectedProduct: product,
        isLoading: false,
      });

      console.log('[v0] Product detail loaded:', product.name);
    } catch (error: any) {
      const apiError = handleApiError(error);
      set({
        isLoading: false,
        error: apiError.message,
      });
      throw apiError;
    }
  },

  fetchFeaturedProducts: async (limit?: number) => {
    set({ isLoading: true, error: null });
    try {
      const products = await productsApi.getFeaturedProducts(limit);
      set({
        featured: products,
        isLoading: false,
      });

      console.log('[v0] Featured products loaded:', products.length);
    } catch (error: any) {
      const apiError = handleApiError(error);
      set({
        isLoading: false,
        error: apiError.message,
      });
      throw apiError;
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await productsApi.getCategories();
      set({
        categories,
        isLoading: false,
      });

      console.log('[v0] Categories loaded:', categories.length);
    } catch (error: any) {
      const apiError = handleApiError(error);
      set({
        isLoading: false,
        error: apiError.message,
      });
      throw apiError;
    }
  },

  searchProducts: async (query: string) => {
    set({ searchQuery: query, currentPage: 1, isLoading: true, error: null });
    try {
      const response = await productsApi.searchProducts(query);
      set({
        products: response.data,
        currentPage: 1,
        totalPages: response.pagination.pages,
        isLoading: false,
      });

      console.log('[v0] Search results loaded:', response.data.length);
    } catch (error: any) {
      const apiError = handleApiError(error);
      set({
        isLoading: false,
        error: apiError.message,
      });
      throw apiError;
    }
  },

  setSelectedCategory: (category: string | null) => {
    set({ selectedCategory: category, currentPage: 1 });
  },

  setSortBy: (sort: 'price' | 'rating' | 'newest' | 'popularity') => {
    set({ sortBy: sort, currentPage: 1 });
  },

  setPage: (page: number) => {
    set({ currentPage: page });
  },

  clearError: () => {
    set({ error: null });
  },
}));
