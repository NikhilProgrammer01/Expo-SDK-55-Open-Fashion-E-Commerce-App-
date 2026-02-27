// app/(shop)/product/[id].tsx
import AppHeader from '@/components/common/AppHeader';
import BrandFooter from '@/components/common/BrandFooter';
import { IMAGES } from '@/constants/images';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  brand: string;
  name: string;
  price: string;
  colors: string[];
  sizes: string[];
  images: string[];
}

interface RelatedProduct {
  id: string;
  brand: string;
  name: string;
  price: string;
  image: string;
}

const PRODUCT: Product = {
  id: '1',
  brand: 'MOHAN',
  name: 'Recycle Boucle Knit Cardigan Pink',
  price: '$120',
  colors: ['#1a1a1a', '#c0392b', '#bdc3c7', '#e8dcc8'],
  sizes: ['S', 'M', 'L'],
  images: [IMAGES.newArrival1, IMAGES.newArrival2, IMAGES.newArrival3, IMAGES.newArrival4],
};

const RELATED: RelatedProduct[] = [
  { id: 'r1', brand: '21WN', name: 'reversible angora cardigan', price: '$120', image: IMAGES.justForYou1 },
  { id: 'r2', brand: 'lame', name: 'reversible angora cardigan', price: '$120', image: IMAGES.justForYou2 },
  { id: 'r3', brand: '21WN', name: 'reversible angora cardigan', price: '$120', image: IMAGES.justForYou1 },
  { id: 'r4', brand: 'lame', name: 'reversible angora cardigan', price: '$120', image: IMAGES.justForYou2 },
];

const CARE_ICONS: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'ban-outline', label: 'Do not use bleach' },
  { icon: 'flash-off-outline', label: 'Do not tumble dry' },
  { icon: 'water-outline', label: 'Dry clean with tetrachloroethylene' },
  { icon: 'thermometer-outline', label: 'Iron at a maximum of 110ºC/230ºF' },
];

// FIX 1: children is now optional with `?`
function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children?: React.ReactNode; // ← was required, now optional
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const rotation = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

  const toggle = () => {
    Animated.timing(rotation, {
      toValue: open ? 0 : 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
    setOpen((p) => !p);
  };

  const rotate = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <View style={styles.accordion}>
      <TouchableOpacity style={styles.accordionHeader} onPress={toggle} activeOpacity={0.7}>
        <Text style={styles.accordionTitle}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="chevron-down-outline" size={18} color="#555" />
        </Animated.View>
      </TouchableOpacity>
      {/* Only render body if open AND children exist */}
      {open && children && (
        <View style={styles.accordionBody}>{children}</View>
      )}
    </View>
  );
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(1);
  const [wishlist, setWishlist] = useState(false);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    if (idx !== activeSlide) setActiveSlide(idx);
  };

  return (
    <View style={styles.container}>
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      >
        {/* IMAGE CAROUSEL */}
        <View style={[styles.carouselContainer, { marginTop: insets.top + 60 }]}>
          <ScrollView
            horizontal
            pagingEnabled
            snapToInterval={width}
            snapToAlignment="start"
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {PRODUCT.images.map((src, i) => (
              <Image key={i} source={src} style={styles.carouselImage} contentFit="cover" transition={400} />
            ))}
          </ScrollView>

          <View style={styles.pagination}>
            {PRODUCT.images.map((_, i) => (
              <View key={i} style={[styles.dot, activeSlide === i && styles.activeDot]} />
            ))}
          </View>

          <TouchableOpacity style={styles.shareBtn}>
            <Ionicons name="share-outline" size={20} color="#555" />
          </TouchableOpacity>
        </View>

        {/* PRODUCT INFO */}
        <View style={styles.infoSection}>
          <View style={styles.brandRow}>
            <Text style={styles.brandText}>{PRODUCT.brand}</Text>
            <TouchableOpacity onPress={() => setWishlist((p) => !p)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name={wishlist ? 'heart' : 'heart-outline'} size={22} color={wishlist ? '#dd8560' : '#aaa'} />
            </TouchableOpacity>
          </View>

          <Text style={styles.productName}>{PRODUCT.name}</Text>
          <Text style={styles.productPrice}>{PRODUCT.price}</Text>
          <View style={styles.divider} />

          {/* COLOR */}
          <View style={styles.selectorRow}>
            <Text style={styles.selectorLabel}>Color</Text>
            <View style={styles.colorRow}>
              {PRODUCT.colors.map((color, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedColor(i)}
                  style={[styles.colorSwatch, { backgroundColor: color }, selectedColor === i && styles.colorSwatchActive]}
                />
              ))}
            </View>
          </View>

          {/* SIZE */}
          <View style={styles.selectorRow}>
            <Text style={styles.selectorLabel}>Size</Text>
            <View style={styles.sizeRow}>
              {PRODUCT.sizes.map((size, i) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => setSelectedSize(i)}
                  style={[styles.sizeBtn, selectedSize === i && styles.sizeBtnActive]}
                >
                  <Text style={[styles.sizeBtnText, selectedSize === i && styles.sizeBtnTextActive]}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* ADD TO BASKET */}
        <View style={styles.addToBasketContainer}>
          <TouchableOpacity style={styles.addToBasketBtn} activeOpacity={0.85}>
            <Ionicons name="add-outline" size={20} color="#fff" />
            <Text style={styles.addToBasketText}>ADD TO BASKET</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setWishlist((p) => !p)} style={styles.wishlistIconBtn}>
            <Ionicons name={wishlist ? 'heart' : 'heart-outline'} size={22} color={wishlist ? '#dd8560' : '#aaa'} />
          </TouchableOpacity>
        </View>

        {/* MATERIALS */}
        <View style={styles.descSection}>
          <Text style={styles.descHeading}>MATERIALS</Text>
          <Text style={styles.descBody}>
            We work with monitoring programmes to ensure compliance with safety, health and quality standards for our products.
          </Text>
        </View>

        {/* CARE */}
        <View style={styles.descSection}>
          <Text style={styles.descHeading}>CARE</Text>
          <Text style={styles.descBody}>
            To keep your jackets and coats clean, you only need to freshen them up and go over them with a cloth or a clothes brush. If you need to dry clean a garment, look for a dry cleaner that uses technologies that are respectful of the environment.
          </Text>
          {CARE_ICONS.map((item, i) => (
            <View key={i} style={styles.careItem}>
              <Ionicons name={item.icon} size={18} color="#777" />
              <Text style={styles.careLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* ACCORDIONS */}
        <View style={styles.accordionSection}>
          {/* Has children → shows content when open */}
          <Accordion title="CARE" defaultOpen>
            <View style={styles.shippingRow}>
              <Ionicons name="cube-outline" size={18} color="#555" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.shippingTitleRow}>
                  <Text style={styles.shippingTitle}>Free Flat Rate Shipping</Text>
                  <Ionicons name="chevron-up-outline" size={16} color="#555" />
                </View>
                <Text style={styles.shippingSubtitle}>Estimated to be delivered on{'\n'}09/11/2021 - 12/11/2021.</Text>
              </View>
            </View>
          </Accordion>

          <Accordion title="COD Policy">
            <View style={styles.policyContent}>
              <View style={styles.policyRow}>
                <Ionicons name="cash-outline" size={18} color="#555" />
                <Text style={styles.policyText}>
                  Cash on Delivery is available for orders up to <Text style={styles.policyBold}>$500</Text>.
                </Text>
              </View>
              <View style={styles.policyRow}>
                <Ionicons name="location-outline" size={18} color="#555" />
                <Text style={styles.policyText}>
                  Available in selected cities. Enter your pincode at checkout to confirm availability.
                </Text>
              </View>
              <View style={styles.policyRow}>
                <Ionicons name="time-outline" size={18} color="#555" />
                <Text style={styles.policyText}>
                  Please keep the exact amount ready at the time of delivery. Our delivery partner does not carry change.
                </Text>
              </View>
            </View>
          </Accordion>

          <Accordion title="Return Policy">
            <View style={styles.policyContent}>
              <View style={styles.policyRow}>
                <Ionicons name="refresh-outline" size={18} color="#555" />
                <Text style={styles.policyText}>
                  Easy <Text style={styles.policyBold}>30-day returns</Text> from the date of delivery. Items must be unused and in original packaging.
                </Text>
              </View>
              <View style={styles.policyRow}>
                <Ionicons name="bag-handle-outline" size={18} color="#555" />
                <Text style={styles.policyText}>
                  Sale items and innerwear are non-returnable. Gift cards cannot be returned or exchanged.
                </Text>
              </View>
              <View style={styles.policyRow}>
                <Ionicons name="card-outline" size={18} color="#555" />
                <Text style={styles.policyText}>
                  Refunds are processed within <Text style={styles.policyBold}>5–7 business days</Text> to your original payment method.
                </Text>
              </View>
              <TouchableOpacity style={styles.policyLink}>
                <Text style={styles.policyLinkText}>View full return policy →</Text>
              </TouchableOpacity>
            </View>
          </Accordion>
        </View>

        {/* YOU MAY ALSO LIKE */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedHeading}>YOU MAY ALSO LIKE</Text>
          <View style={styles.ornamentContainer}>
            <View style={styles.ornamentLine} />
            <View style={styles.ornamentDiamond} />
            <View style={styles.ornamentLine} />
          </View>

          <View style={styles.relatedGrid}>
            {RELATED.map((item) => (
              <Pressable
                key={item.id}
                style={styles.relatedCard}
                onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
              >
                <View style={styles.relatedImageWrapper}>
                  <Image source={item.image} style={styles.relatedImage} contentFit="cover" transition={400} />
                  <TouchableOpacity style={styles.relatedWishlist}>
                    <Ionicons name="heart-outline" size={18} color="#aaa" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.relatedBrand}>{item.brand}</Text>
                <Text style={styles.relatedName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.relatedPrice}>{item.price}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <BrandFooter showBenefits={false} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  carouselContainer: { width, backgroundColor: '#f7f5f2', position: 'relative' },
  carouselImage: { width, height: 460 },
  pagination: { position: 'absolute', bottom: 16, alignSelf: 'center', flexDirection: 'row', gap: 6, left: 0, right: 0, justifyContent: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.2)' },
  activeDot: { backgroundColor: '#000', width: 18, borderRadius: 3 },
  shareBtn: { position: 'absolute', bottom: 12, right: 16, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 20, padding: 8 },
  infoSection: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 10 },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  brandText: { fontSize: 13, letterSpacing: 2, color: '#888', textTransform: 'uppercase', fontWeight: '400' },
  productName: { fontSize: 17, color: '#111', fontWeight: '400', lineHeight: 24, marginBottom: 8 },
  productPrice: { fontSize: 18, color: '#dd8560', fontWeight: '400', marginBottom: 18 },
  divider: { height: 1, backgroundColor: '#EFEFEF', marginBottom: 18 },
  selectorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 16 },
  selectorLabel: { fontSize: 13, color: '#555', width: 40, letterSpacing: 0.5 },
  colorRow: { flexDirection: 'row', gap: 10 },
  colorSwatch: { width: 22, height: 22, borderRadius: 11 },
  colorSwatchActive: { borderWidth: 2, borderColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 3, elevation: 4 },
  sizeRow: { flexDirection: 'row', gap: 8 },
  sizeBtn: { width: 36, height: 36, borderRadius: 4, borderWidth: 1, borderColor: '#DEDEDE', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  sizeBtnActive: { backgroundColor: '#111', borderColor: '#111' },
  sizeBtnText: { fontSize: 13, color: '#555' },
  sizeBtnTextActive: { color: '#fff', fontWeight: '500' },
  addToBasketContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginTop: 4, marginBottom: 28, gap: 12 },
  addToBasketBtn: { flex: 1, height: 52, backgroundColor: '#111', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 2 },
  addToBasketText: { color: '#fff', fontSize: 14, letterSpacing: 2.5, fontWeight: '400' },
  wishlistIconBtn: { width: 52, height: 52, borderWidth: 1, borderColor: '#DEDEDE', borderRadius: 2, justifyContent: 'center', alignItems: 'center' },
  descSection: { paddingHorizontal: 20, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#F2F2F2' },
  descHeading: { fontSize: 12, letterSpacing: 2.5, color: '#111', fontWeight: '600', marginBottom: 12, marginTop: 8 },
  descBody: { fontSize: 14, color: '#555', lineHeight: 22, fontWeight: '300' },
  careItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14 },
  careLabel: { fontSize: 13, color: '#555', fontWeight: '300' },
  accordionSection: { marginHorizontal: 20, marginTop: 4 },
  accordion: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  accordionTitle: { fontSize: 12, letterSpacing: 2, color: '#111', fontWeight: '600' },
  accordionBody: { paddingBottom: 16 },
  shippingRow: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FAFAFA', padding: 14, borderRadius: 4 },
  shippingTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  shippingTitle: { fontSize: 13, fontWeight: '500', color: '#111' },
  shippingSubtitle: { fontSize: 12, color: '#888', lineHeight: 18 },
  relatedSection: { paddingTop: 36, paddingBottom: 10, alignItems: 'center' },
  relatedHeading: { fontSize: 14, letterSpacing: 5, fontWeight: '400', color: '#111', textTransform: 'uppercase', marginBottom: 12 },
  ornamentContainer: { flexDirection: 'row', alignItems: 'center', width: '50%', marginBottom: 24 },
  ornamentLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  ornamentDiamond: { width: 7, height: 7, borderWidth: 1, borderColor: '#CECECE', transform: [{ rotate: '45deg' }], marginHorizontal: 10 },
  relatedGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, width },
  relatedCard: { width: (width - 40) / 2, marginHorizontal: 5, marginBottom: 24 },
  relatedImageWrapper: { width: '100%', height: 200, backgroundColor: '#F7F5F2', position: 'relative', marginBottom: 10 },
  relatedImage: { width: '100%', height: '100%' },
  relatedWishlist: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 14, padding: 5 },
  policyContent: { gap: 14, paddingBottom: 4 },
  policyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  policyText: { flex: 1, fontSize: 13, color: '#555', lineHeight: 20, fontWeight: '300' },
  policyBold: { fontWeight: '500', color: '#333' },
  policyLink: { marginTop: 6, alignSelf: 'flex-start' },
  policyLinkText: { fontSize: 13, color: '#dd8560', fontWeight: '400', letterSpacing: 0.3 },
  relatedBrand: { fontSize: 11, letterSpacing: 1.5, color: '#999', textTransform: 'uppercase', marginBottom: 3 },
  relatedName: { fontSize: 12, color: '#333', lineHeight: 17, marginBottom: 4, fontWeight: '300' },
  relatedPrice: { fontSize: 13, color: '#dd8560', fontWeight: '400' },
});