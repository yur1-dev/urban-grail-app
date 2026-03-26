import { useEffect } from 'react';
import { useProductStore } from '@store/useProductStore';
import { useUIStore } from '@store/useUIStore';
import { SearchFilters } from '@types/index';

/**
 * Custom hook for products management
 */
export const useProducts = (autoFetch: boolean = true) => {
  const productStore = useProductStore();
  const { showToast } = useUIStore();

  // Auto-fetch products on mount
  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, []);

  const fetchProducts = async (page: number = 1, limit: number = 10) => {
    try {
      await productStore.fetchProducts(page, limit);
    } catch (error: any) {
      showToast(error.message || 'Failed to fetch products', 'error');
    }
  };

  const fetchCategories = async () => {
    try {
      await productStore.fetchCategories();
    } catch (error: any) {
      showToast(error.message || 'Failed to fetch categories', 'error');
    }
  };

  const selectCategory = (categoryId: string | null) => {
    productStore.setSelectedCategory(categoryId);
  };

  const search = async (query: string, page: number = 1) => {
    try {
      if (!query.trim()) {
        productStore.setSearchQuery('');
        return;
      }
      await productStore.searchProducts(query, page);
    } catch (error: any) {
      showToast(error.message || 'Search failed', 'error');
    }
  };

  const applyFilters = (filters: Partial<SearchFilters>) => {
    productStore.setFilters(filters);
  };

  const clearFilters = () => {
    productStore.clearFilters();
  };

  return {
    // State
    products: productStore.products,
    categories: productStore.categories,
    selectedCategory: productStore.selectedCategory,
    searchQuery: productStore.searchQuery,
    filters: productStore.filters,
    pagination: productStore.pagination,
    isLoading: productStore.isLoading,
    error: productStore.error,

    // Actions
    fetchProducts,
    fetchCategories,
    selectCategory,
    search,
    applyFilters,
    clearFilters,
    clearError: productStore.clearError,
  };
};
