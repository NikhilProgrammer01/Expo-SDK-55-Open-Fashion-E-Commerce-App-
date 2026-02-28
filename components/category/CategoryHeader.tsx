// components/category/CategoryHeader.tsx
import SortDropdown from '@/components/common/SortDropdown';
import { Colors, Radius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  title: string;
  count: number;
  sortBy: string;
  onSortChange: (v: string) => void;
  gridMode: 'two' | 'one';
  onGridToggle: () => void;
  activeChips: string[];
  onRemoveChip: (chip: string) => void;
  onBack: () => void;
  onSearch: (q: string) => void;
  onFilterOpen: () => void;
  filterCount: number;
}

export default function CategoryHeader({
  title, count, sortBy, onSortChange, gridMode, onGridToggle,
  activeChips, onRemoveChip, onBack, onSearch, onFilterOpen, filterCount,
}: Props) {
  const insets = useSafeAreaInsets();
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<TextInput>(null);

  const defaultRowOpacity = useRef(new Animated.Value(1)).current;
  const searchRowOpacity = useRef(new Animated.Value(0)).current;

  const enterSearch = () => {
    setSearchMode(true);
    Animated.parallel([
      Animated.timing(defaultRowOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(searchRowOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start(() => inputRef.current?.focus());
  };

  const exitSearch = () => {
    Keyboard.dismiss();
    setSearchQuery('');
    onSearch('');
    Animated.parallel([
      Animated.timing(searchRowOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(defaultRowOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start(() => setSearchMode(false));
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    onSearch(text);
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      {/* Nav bar */}
      <BlurView
        intensity={Platform.OS === 'ios' ? 60 : 80}
        tint="extraLight"
        style={[styles.navBar, { backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.95)' : 'transparent' }]}
      >
        {/* Default row */}
        <Animated.View style={[styles.navRow, { opacity: defaultRowOpacity }]} pointerEvents={searchMode ? 'none' : 'auto'}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="chevron-back-outline" size={22} color="#222" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle} numberOfLines={1}>{title}</Text>
          <View style={styles.navRight}>
            <TouchableOpacity onPress={enterSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="search-outline" size={20} color="#222" />
            </TouchableOpacity>
            <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="bag-handle-outline" size={20} color="#222" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Search row */}
        <Animated.View style={[styles.navRow, styles.navRowAbsolute, { opacity: searchRowOpacity }]} pointerEvents={searchMode ? 'auto' : 'none'}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search-outline" size={16} color="#aaa" />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Search brand, name..."
              placeholderTextColor="#bbb"
              value={searchQuery}
              onChangeText={handleSearchChange}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearchChange('')} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                <Ionicons name="close-circle" size={17} color="#ccc" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={exitSearch} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </BlurView>

      {/* Controls */}
      <View style={styles.controlsRow}>
        <Text style={styles.countText}>
          <Text style={styles.countNumber}>{count}</Text>{' items'}
        </Text>
        <View style={styles.controlsRight}>
          <SortDropdown value={sortBy} onChange={onSortChange} />

          <TouchableOpacity style={styles.controlBtn} onPress={onGridToggle}>
            <Ionicons name={gridMode === 'two' ? 'grid-outline' : 'list-outline'} size={16} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.controlBtn, filterCount > 0 && styles.controlBtnActive]} onPress={onFilterOpen}>
            <Ionicons name="options-outline" size={16} color={filterCount > 0 ? '#fff' : '#555'} />
            {filterCount > 0 && <Text style={styles.filterBadge}>{filterCount}</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* Active chips */}
      {activeChips.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsContent}>
          {activeChips.map(chip => (
            <TouchableOpacity key={chip} style={styles.chip} onPress={() => onRemoveChip(chip)}>
              <Text style={styles.chipText}>{chip}</Text>
              <Ionicons name="close-outline" size={13} color="#777" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  navBar: { height: 60, paddingHorizontal: 16, justifyContent: 'center' },
  navRow: { flexDirection: 'row', alignItems: 'center', height: 60, justifyContent: 'space-between' },
  navRowAbsolute: { position: 'absolute', left: 16, right: 16 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, minWidth: 70 },
  backText: { fontSize: 15, color: '#222', fontWeight: '300' },
  navTitle: { fontSize: 13, letterSpacing: 3, fontWeight: '500', color: '#111', textTransform: 'uppercase', flex: 1, textAlign: 'center' },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 12, minWidth: 70, justifyContent: 'flex-end' },
  searchInputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.inputBg, borderRadius: Radius.lg, paddingHorizontal: 12, height: 42, gap: 8 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.textPrimary, fontWeight: '300', paddingVertical: 0 },
  cancelBtn: { marginLeft: 12, paddingVertical: 6 },
  cancelText: { fontSize: 15, color: Colors.accent, fontWeight: '400' },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: Colors.white },
  countText: { fontSize: 13, color: '#888', fontWeight: '300' },
  countNumber: { fontSize: 13, color: '#111', fontWeight: '500' },
  controlsRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  controlBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: Colors.borderMedium, paddingHorizontal: 10, paddingVertical: 7, borderRadius: Radius.md, backgroundColor: Colors.white },
  controlBtnActive: { backgroundColor: Colors.black, borderColor: Colors.black },
  filterBadge: { fontSize: 11, color: Colors.white, fontWeight: '600' },
  chipsScroll: { backgroundColor: Colors.white },
  chipsContent: { gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: Colors.borderStrong, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.pill, backgroundColor: Colors.chipBg },
  chipText: { fontSize: 12, color: '#444', fontWeight: '300' },
});