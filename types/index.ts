// types/index.ts

export interface Product {
  id: string;
  brand: string;
  name: string;
  price: string;
  image: string;
}

export interface FilterState {
  categories: string[];
  sizes: string[];
  colors: string[];
  brands: string[];
  priceMin: string;
  priceMax: string;
}

export const EMPTY_FILTERS: FilterState = {
  categories: [],
  sizes: [],
  colors: [],
  brands: [],
  priceMin: '',
  priceMax: '',
};

export type Tab = 'WOMEN' | 'MAN' | 'KIDS';

export type GridMode = 'two' | 'one';