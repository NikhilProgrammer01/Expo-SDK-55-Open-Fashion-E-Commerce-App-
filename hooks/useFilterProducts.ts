// hooks/useFilterProducts.ts
import { EMPTY_FILTERS, FilterState, Product } from '@/types';
import { useState } from 'react';

// ─── Pure filter logic (no UI) ────────────────────────────────────────────────
export function filterProducts(products: Product[], filters: FilterState, query: string): Product[] {
  let result = products;

  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  }

  if (filters.brands.length > 0) {
    result = result.filter(p => filters.brands.includes(p.brand));
  }

  if (filters.priceMin) {
    const min = parseInt(filters.priceMin);
    result = result.filter(p => parseInt(p.price.replace(/[^0-9]/g, '')) >= min);
  }

  if (filters.priceMax) {
    const max = parseInt(filters.priceMax);
    result = result.filter(p => parseInt(p.price.replace(/[^0-9]/g, '')) <= max);
  }

  return result;
}

export function countActiveFilters(f: FilterState): number {
  return (
    f.categories.length +
    f.sizes.length +
    f.colors.length +
    f.brands.length +
    (f.priceMin || f.priceMax ? 1 : 0)
  );
}

export function buildFilterChips(filters: FilterState): string[] {
  return [
    ...filters.categories,
    ...filters.sizes.map(s => `Size ${s}`),
    ...filters.colors,
    ...filters.brands,
    ...(filters.priceMin || filters.priceMax
      ? [`$${filters.priceMin || '0'} – $${filters.priceMax || '∞'}`]
      : []),
  ];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useFilterProducts(
  allProducts: Product[],
  initialChips: string[] = []
) {
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({ ...EMPTY_FILTERS });
  const [activeChips, setActiveChips] = useState<string[]>(initialChips);

  const filteredProducts = filterProducts(allProducts, appliedFilters, searchQuery);
  const filterCount = countActiveFilters(appliedFilters);

  const applyFilters = (filters: FilterState, routeChips: string[]) => {
    setAppliedFilters(filters);
    const filterChips = buildFilterChips(filters);
    setActiveChips([...routeChips, ...filterChips]);
  };

  const removeChip = (chip: string) => {
    setActiveChips(prev => prev.filter(c => c !== chip));
    // If it was a filter chip, reset corresponding filter
    // (simplified: just rebuild from remaining chips)
  };

  const resetFilters = () => {
    setAppliedFilters({ ...EMPTY_FILTERS });
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredProducts,
    filterCount,
    appliedFilters,
    applyFilters,
    activeChips,
    removeChip,
    resetFilters,
  };
}