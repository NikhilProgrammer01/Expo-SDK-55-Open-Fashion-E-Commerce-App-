// constants/filters.ts

export const SORT_OPTIONS = [
  'New',
  'Price: Low to High',
  'Price: High to Low',
  'Best Seller',
];

export const FILTER_OPTIONS = {
  categories: ['Outer', 'Dress', 'Blouse/Shirt', 'T-Shirt', 'Knitwear', 'Skirt', 'Pants', 'Denim'],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  colors: [
    { label: 'Black', hex: '#1a1a1a' },
    { label: 'White', hex: '#f5f5f5' },
    { label: 'Beige', hex: '#e8dcc8' },
    { label: 'Brown', hex: '#8B6352' },
    { label: 'Red', hex: '#c0392b' },
    { label: 'Blue', hex: '#2980b9' },
    { label: 'Green', hex: '#27ae60' },
    { label: 'Pink', hex: '#e891a0' },
  ],
  brands: ['21WN', 'Lame', 'Mohan', 'Prada', 'Burberry'],
  pricePresets: [
    { label: 'Under $150', min: '', max: '150' },
    { label: '$150–$250', min: '150', max: '250' },
    { label: 'Over $250', min: '250', max: '' },
  ],
};