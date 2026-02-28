// components/common/SortDropdown.tsx
import { SORT_OPTIONS } from '@/constants/filters';
import { Colors, Radius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  value: string;
  onChange: (v: string) => void;
  options?: string[];
}

export default function SortDropdown({ value, onChange, options = SORT_OPTIONS }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.btn} onPress={() => setOpen(p => !p)} activeOpacity={0.7}>
        <Text style={styles.btnText}>{value}</Text>
        <Ionicons name={open ? 'chevron-up-outline' : 'chevron-down-outline'} size={13} color="#555" />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          {options.map(opt => (
            <TouchableOpacity
              key={opt}
              style={[styles.item, value === opt && styles.itemActive]}
              onPress={() => { onChange(opt); setOpen(false); }}
            >
              {value === opt && <View style={styles.activeDot} />}
              <Text style={[styles.itemText, value === opt && styles.itemTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative', zIndex: 999 },
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, borderColor: Colors.borderMedium,
    paddingHorizontal: 10, paddingVertical: 7,
    borderRadius: Radius.md, backgroundColor: Colors.white,
  },
  btnText: { fontSize: 12, color: Colors.textPrimary, fontWeight: '300' },
  dropdown: {
    position: 'absolute', top: 40, right: 0,
    backgroundColor: Colors.white,
    borderWidth: 1, borderColor: Colors.borderLight,
    borderRadius: Radius.lg, minWidth: 180,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1, shadowRadius: 16,
    elevation: 999, zIndex: 999,
  },
  item: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 13, gap: 10,
    borderBottomWidth: 1, borderBottomColor: '#F8F8F8',
  },
  itemActive: { backgroundColor: Colors.chipBg },
  activeDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.accent },
  itemText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '300' },
  itemTextActive: { color: Colors.textPrimary, fontWeight: '500' },
});