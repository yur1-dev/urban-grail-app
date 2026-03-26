import { create } from 'zustand';
import { Product, Category, SearchFilters, Pagination } from '@types/index';
import { productsApi } from '@api/products.api';
import { errorHandler } from '@utils/errorHandler';

interface ProductState {
  // State
  products: Product[];
  categories: Category[];
  selectedCategory: string | null;
  searchQuery: string;
  filters: SearchFilters;
  pagination: Pagination;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProducts: (page?: number, limit?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  setSelectedCategory: (categoryId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  searchProducts: (query: string, page?: number) => Promise<void>;
  clearFilters: () => void;
  clearError: () => void;
}

const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  pages: 0,
};

export const useProductStore = create<ProductState>((set, get) => ({
  // Initial state
  products: [],
  categories: [],
  selectedCategory: null,
  searchQuery: '',
  filters: {},
  pagination: DEFAULT_PAGINATION,
  isLoading: false,
  error: null,

  // Fetch products with filters
  fetchProducts: async (page = 1, limit = 10) => {
    try {
      set({ isLoading: true, error: null });

      const { selectedCategory, filters } = get();

      const filtersToApply: SearchFilters = {
        ...filters,
        ...(selectedCategory && { category: selectedCategory }),
      };

      const response = await productsApi.getProducts(page, limit, filtersToApply);

      set({
        products: response.data!.data,
        pagination: response.data!.pagination,
        isLoading: false,
      });
    } catch (err) {
      const error = errorHandler.parseError(err);
      errorHandler.logError(error, 'fetchProducts');
      set({
        isLoading: false,
        error: error.message,
      });
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await productsApi.getCategories();

      set({
        categories: response.data || [],
        isLoading: false,
      });
    } catch (err) {
      const error = errorHandler.parseError(err);
      errorHandler.logError(error, 'fetchCategories');
      set({
        isLoading: false,
        error: error.message,
      });
    }
  },

  // Set selected category
  setSelectedCategory: (categoryId: string | null) => {
    set({ selectedCategory: categoryId, pagination: { ...DEFAULT_PAGINATION } });
    // Refetch products with new category
    if (categoryId) {
      get().fetchProducts(1, 10);
    }
  },

  // Set search query
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  // Set filters
  setFilters: (filters: Partial<SearchFilters>) => {
    set({
      filters: {
        ...get().filters,
        ...filters,
      },
      pagination: { ...DEFAULT_PAGINATION },
    });
    // Refetch products with new filters
    get().fetchProducts(1, 10);
  },

  // Search products
  searchProducts: async (query: string, page = 1) => {
    try {
      if (!query.trim()) {
        set({ searchQuery: '', products: [], error: null });
        return;
      }

      set({ isLoading: true, error: null, searchQuery: query });

      const response = await productsApi.searchProducts(query, page, 10);

      set({
        products: response.data!.data,
        pagination: response.data!.pagination,
        isLoading: false,
      });
    } catch (err) {
      const error = errorHandler.parseError(err);
      errorHandler.logError(error, 'searchProducts');
      set({
        isLoading: false,
        error: error.message,
      });
    }
  },

  // Clear filters
  clearFilters: () => {
    set({
      filters: {},
      selectedCategory: null,
      searchQuery: '',
      pagination: DEFAULT_PAGINATION,
    });
    get().fetchProducts(1, 10);
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
