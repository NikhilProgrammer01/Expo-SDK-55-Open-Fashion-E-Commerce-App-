// components/common/OrnamentDivider.tsx
import { Colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { DimensionValue } from 'react-native';

interface Props {
  width?: DimensionValue;
  color?: string;
}

export default function OrnamentDivider({ width = '60%', color = Colors.borderStrong }: Props) {
  return (
    <View style={[styles.container, { width }]}>
      <View style={[styles.line, { backgroundColor: color }]} />
      <View style={[styles.diamond, { borderColor: color }]} />
      <View style={[styles.line, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  line: { flex: 1, height: 1 },
  diamond: {
    width: 8,
    height: 8,
    borderWidth: 1,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 10,
  },
});