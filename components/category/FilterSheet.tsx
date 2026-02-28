// components/category/FilterSheet.tsx
import { FILTER_OPTIONS } from '@/constants/filters';
import { Colors, Radius } from '@/constants/theme';
import { buildFilterChips, countActiveFilters, filterProducts } from '@/hooks/useFilterProducts';
import { EMPTY_FILTERS, FilterState, Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');
const SHEET_HEIGHT = height * 0.82;

function toggleItem(arr: string[], item: string): string[] {
  return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
}

// ─── FilterSection accordion ──────────────────────────────────────────────────
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const rotateAnim = useRef(new Animated.Value(1)).current;

  const toggle = () => {
    Animated.timing(rotateAnim, { toValue: open ? 0 : 1, duration: 200, useNativeDriver: true }).start();
    setOpen(p => !p);
  };

  const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.sectionHeader} onPress={toggle} activeOpacity={0.7}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="chevron-down-outline" size={16} color="#888" />
        </Animated.View>
      </TouchableOpacity>
      {open && <View style={styles.sectionBody}>{children}</View>}
    </View>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState, chips: string[]) => void;
  allProducts: Product[];
}

export default function FilterSheet({ visible, onClose, onApply, allProducts }: FilterSheetProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);
  const [draft, setDraft] = useState<FilterState>({ ...EMPTY_FILTERS });

  const previewCount = filterProducts(allProducts, draft, '').length;
  const activeCount = countActiveFilters(draft);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 0, speed: 16 }),
          Animated.timing(backdropAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
      }, 10);
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: SHEET_HEIGHT, duration: 280, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start(({ finished }) => { if (finished) setMounted(false); });
    }
  }, [visible]);

  const handleApply = () => {
    onApply(draft, buildFilterChips(draft));
    onClose();
  };

  const handleReset = () => setDraft({ ...EMPTY_FILTERS });

  const toggle = (key: keyof Pick<FilterState, 'categories' | 'sizes' | 'colors' | 'brands'>, val: string) => {
    setDraft(prev => ({ ...prev, [key]: toggleItem(prev[key], val) }));
  };

  return (
    <Modal transparent visible={mounted} animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }], paddingBottom: insets.bottom }]}>
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Filter{activeCount > 0 ? ` (${activeCount})` : ''}</Text>
          <TouchableOpacity onPress={handleReset} disabled={activeCount === 0}>
            <Text style={[styles.resetText, activeCount === 0 && styles.resetDisabled]}>Reset All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

          {/* CATEGORY */}
          <FilterSection title="Category">
            <View style={styles.chipRow}>
              {FILTER_OPTIONS.categories.map(cat => {
                const active = draft.categories.includes(cat);
                return (
                  <TouchableOpacity key={cat} style={[styles.chip, active && styles.chipActive]} onPress={() => toggle('categories', cat)}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </FilterSection>

          {/* SIZE */}
          <FilterSection title="Size">
            <View style={styles.chipRow}>
              {FILTER_OPTIONS.sizes.map(size => {
                const active = draft.sizes.includes(size);
                return (
                  <TouchableOpacity key={size} style={[styles.sizeChip, active && styles.chipActive]} onPress={() => toggle('sizes', size)}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{size}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </FilterSection>

          {/* COLOR */}
          <FilterSection title="Color">
            <View style={styles.colorRow}>
              {FILTER_OPTIONS.colors.map(color => {
                const active = draft.colors.includes(color.label);
                return (
                  <TouchableOpacity key={color.label} style={styles.colorItem} onPress={() => toggle('colors', color.label)}>
                    <View style={[styles.swatch, { backgroundColor: color.hex }, active && styles.swatchActive]}>
                      {active && <Ionicons name="checkmark" size={13} color={color.hex === '#f5f5f5' ? '#333' : '#fff'} />}
                    </View>
                    <Text style={[styles.colorLabel, active && { color: Colors.black, fontWeight: '500' }]}>{color.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </FilterSection>

          {/* PRICE */}
          <FilterSection title="Price Range">
            <View style={styles.priceRow}>
              <View style={styles.priceInputWrapper}>
                <Text style={styles.priceLabel}>Min</Text>
                <View style={styles.priceInputBox}>
                  <Text style={styles.priceCurrency}>$</Text>
                  <TextInput style={styles.priceInput} placeholder="0" placeholderTextColor="#ccc" keyboardType="numeric" value={draft.priceMin} onChangeText={v => setDraft(p => ({ ...p, priceMin: v }))} />
                </View>
              </View>
              <View style={styles.priceDivider} />
              <View style={styles.priceInputWrapper}>
                <Text style={styles.priceLabel}>Max</Text>
                <View style={styles.priceInputBox}>
                  <Text style={styles.priceCurrency}>$</Text>
                  <TextInput style={styles.priceInput} placeholder="999" placeholderTextColor="#ccc" keyboardType="numeric" value={draft.priceMax} onChangeText={v => setDraft(p => ({ ...p, priceMax: v }))} />
                </View>
              </View>
            </View>
            <View style={[styles.chipRow, { marginTop: 12 }]}>
              {FILTER_OPTIONS.pricePresets.map(({ label, min, max }) => {
                const active = draft.priceMin === min && draft.priceMax === max;
                return (
                  <TouchableOpacity key={label} style={[styles.chip, active && styles.chipActive]} onPress={() => setDraft(p => ({ ...p, priceMin: min, priceMax: max }))}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </FilterSection>

          {/* BRAND */}
          <FilterSection title="Brand">
            <View style={styles.chipRow}>
              {FILTER_OPTIONS.brands.map(brand => {
                const active = draft.brands.includes(brand);
                return (
                  <TouchableOpacity key={brand} style={[styles.chip, active && styles.chipActive]} onPress={() => toggle('brands', brand)}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{brand}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </FilterSection>

        </ScrollView>

        {/* Apply */}
        <View style={styles.applyContainer}>
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply} activeOpacity={0.85}>
            <Text style={styles.applyText}>SHOW {previewCount} RESULT{previewCount !== 1 ? 'S' : ''}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: SHEET_HEIGHT,
    backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 30,
  },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  sheetTitle: { fontSize: 16, fontWeight: '500', color: Colors.black, letterSpacing: 0.5 },
  resetText: { fontSize: 14, color: Colors.accent, fontWeight: '400' },
  resetDisabled: { color: '#ccc' },
  section: { borderBottomWidth: 1, borderBottomColor: '#F5F5F5', paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  sectionTitle: { fontSize: 13, letterSpacing: 1.5, fontWeight: '500', color: Colors.black, textTransform: 'uppercase' },
  sectionBody: { paddingBottom: 20 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.borderMedium, backgroundColor: Colors.white },
  chipActive: { backgroundColor: Colors.black, borderColor: Colors.black },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '300' },
  chipTextActive: { color: Colors.white, fontWeight: '400' },
  sizeChip: { width: 48, height: 48, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.borderMedium, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  colorItem: { alignItems: 'center', gap: 6, width: 44 },
  swatch: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  swatchActive: { borderWidth: 2.5, borderColor: Colors.black },
  colorLabel: { fontSize: 10, color: Colors.textLight, fontWeight: '300', textAlign: 'center' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  priceInputWrapper: { flex: 1, gap: 6 },
  priceLabel: { fontSize: 11, color: '#aaa', letterSpacing: 1, textTransform: 'uppercase' },
  priceInputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.borderMedium, borderRadius: Radius.md, paddingHorizontal: 12, height: 44, gap: 4 },
  priceCurrency: { fontSize: 14, color: Colors.textMuted, fontWeight: '300' },
  priceInput: { flex: 1, fontSize: 15, color: Colors.textPrimary, fontWeight: '300' },
  priceDivider: { width: 16, height: 1, backgroundColor: Colors.borderStrong, marginTop: 20 },
  applyContainer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, borderTopWidth: 1, borderTopColor: '#F5F5F5' },
  applyBtn: { backgroundColor: Colors.black, height: 54, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  applyText: { color: Colors.white, fontSize: 14, letterSpacing: 3, fontWeight: '400' },
});