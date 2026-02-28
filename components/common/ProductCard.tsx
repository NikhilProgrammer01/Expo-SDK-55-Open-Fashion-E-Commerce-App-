// components/common/ProductCard.tsx
import { Colors, Radius } from '@/constants/theme';
import { Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_GAP = 8;

interface ProductCardProps {
  item: Product;
  onPress: () => void;
  /** 'grid' = vertical 2-col card, 'list' = horizontal full-width, 'featured' = wider card for JustForYou */
  variant?: 'grid' | 'list' | 'featured';
  cardWidth?: number;
}

export default function ProductCard({
  item,
  onPress,
  variant = 'grid',
  cardWidth,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);

  const toggleWishlist = (e: any) => {
    e.stopPropagation();
    setWishlisted(p => !p);
  };

  const WishlistBtn = () => (
    <TouchableOpacity style={styles.wishlistBtn} onPress={toggleWishlist} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      <Ionicons name={wishlisted ? 'heart' : 'heart-outline'} size={18} color={wishlisted ? Colors.accent : '#aaa'} />
    </TouchableOpacity>
  );

  if (variant === 'list') {
    return (
      <Pressable style={styles.listCard} onPress={onPress}>
        <View style={styles.listImageWrapper}>
          <Image source={item.image} style={styles.image} contentFit="cover" transition={400} />
          <WishlistBtn />
        </View>
        <View style={styles.listInfo}>
          <Text style={styles.brand}>{item.brand}</Text>
          <Text style={styles.name} numberOfLines={3}>{item.name}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      </Pressable>
    );
  }

  const computedWidth = cardWidth ?? (width - 32 - CARD_GAP) / 2;

  return (
    <Pressable style={[styles.gridCard, { width: computedWidth }]} onPress={onPress}>
      <View style={styles.gridImageWrapper}>
        <Image source={item.image} style={styles.image} contentFit="cover" transition={400} />
        <WishlistBtn />
      </View>
      <Text style={styles.brand}>{item.brand}</Text>
      <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.price}>{item.price}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Grid
  gridCard: { marginBottom: 20 },
  gridImageWrapper: {
    width: '100%',
    aspectRatio: 0.75,
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    marginBottom: 10,
    position: 'relative',
  },

  // List
  listCard: { width: '100%', flexDirection: 'row', gap: 14, marginBottom: 16 },
  listImageWrapper: {
    width: 130,
    aspectRatio: 0.75,
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    flexShrink: 0,
    position: 'relative',
  },
  listInfo: { flex: 1, justifyContent: 'center', paddingVertical: 8 },

  // Shared
  image: { width: '100%', height: '100%' },
  wishlistBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 14,
    padding: 5,
  },
  brand: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  name: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginBottom: 4,
    fontWeight: '300',
  },
  price: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: '400',
  },
});