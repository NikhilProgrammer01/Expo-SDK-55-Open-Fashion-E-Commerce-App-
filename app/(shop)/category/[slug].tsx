// app/(shop)/category/[slug].tsx
import CategoryHeader from '@/components/category/CategoryHeader';
import FilterSheet from '@/components/category/FilterSheet';
import BrandFooter from '@/components/common/BrandFooter';
import ProductCard from '@/components/common/ProductCard';
import { IMAGES } from '@/constants/images';
import { useFilterProducts } from '@/hooks/useFilterProducts';
import { GridMode, Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_GAP = 8;

// In a real app this comes from an API call using the slug param
const ALL_PRODUCTS: Product[] = [
  { id: '1', brand: '21WN', name: 'Reversible Angora Cardigan', price: '$120', image: IMAGES.justForYou1 },
  { id: '2', brand: 'Lame', name: 'Boucle Knit Oversized Coat', price: '$220', image: IMAGES.justForYou2 },
  { id: '3', brand: '21WN', name: 'Silk Wrap Midi Dress', price: '$180', image: IMAGES.justForYou1 },
  { id: '4', brand: 'Lame', name: 'Harris Tweed Blazer', price: '$340', image: IMAGES.justForYou2 },
  { id: '5', brand: 'Mohan', name: 'Cashmere Turtleneck Sweater', price: '$160', image: IMAGES.newArrival1 },
  { id: '6', brand: 'Lame', name: 'Wide Leg Linen Trousers', price: '$140', image: IMAGES.newArrival2 },
  { id: '7', brand: '21WN', name: 'Reversible Puffer Jacket', price: '$280', image: IMAGES.newArrival3 },
  { id: '8', brand: 'Mohan', name: 'Pleated Chiffon Maxi Skirt', price: '$195', image: IMAGES.newArrival4 },
];

export default function CategoryPage() {
  const { slug, tab } = useLocalSearchParams<{ slug: string; tab?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [gridMode, setGridMode] = useState<GridMode>('two');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [sortBy, setSortBy] = useState('New');

  const title = slug
    ? String(slug).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Apparel';

  const routeChips = [
    tab ?? 'Women',
    slug ? String(slug).replace(/-/g, ' ') : 'All apparel',
  ];

  const {
    filteredProducts,
    filterCount,
    appliedFilters,
    applyFilters,
    activeChips,
    removeChip,
    setSearchQuery,
  } = useFilterProducts(ALL_PRODUCTS, routeChips);

  const isListMode = gridMode === 'one';
  const cardWidth = (width - 32 - CARD_GAP) / 2;
  const headerHeight = insets.top + 60 + 52 + (activeChips.length > 0 ? 48 : 0);

  return (
    <View style={styles.container}>
      <CategoryHeader
        title={title}
        count={filteredProducts.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
        gridMode={gridMode}
        onGridToggle={() => setGridMode(m => m === 'two' ? 'one' : 'two')}
        activeChips={activeChips}
        onRemoveChip={removeChip}
        onBack={() => router.back()}
        onSearch={setSearchQuery}
        onFilterOpen={() => setFilterSheetOpen(true)}
        filterCount={filterCount}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        numColumns={isListMode ? 1 : 2}
        key={gridMode}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.listContent, { paddingTop: headerHeight }]}
        columnWrapperStyle={!isListMode ? styles.columnWrapper : undefined}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            variant={isListMode ? 'list' : 'grid'}
            cardWidth={isListMode ? undefined : cardWidth}
            onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color="#ddd" />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
          </View>
        }
        ListFooterComponent={filteredProducts.length > 0 ? <BrandFooter showBenefits={false} /> : null}
      />

      <FilterSheet
        visible={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        onApply={(filters, chips) => applyFilters(filters, routeChips)}
        allProducts={ALL_PRODUCTS}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
  columnWrapper: { gap: CARD_GAP, marginBottom: CARD_GAP },
  emptyState: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 16, color: '#888', fontWeight: '300' },
  emptySubtitle: { fontSize: 13, color: '#bbb', fontWeight: '300' },
});