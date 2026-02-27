// app/(shop)/index.tsx
import BrandFooter from '@/components/common/BrandFooter';
import HomeHeader from '@/components/home/HomeHeader';
import { IMAGES } from '@/constants/images';
import { BodoniModa_700Bold_Italic, useFonts } from '@expo-google-fonts/bodoni-moda';
import { FlashList } from '@shopify/flash-list';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // ← added
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // ← added Pressable
const { width } = Dimensions.get('window');

interface Product {
  id: string;
  title: string;
  price: string;
  img: string;
}

const CATEGORIES = ['All', 'Apparel', 'Dress', 'Tshirt', 'Bag'];
const TRENDING_TAGS = ['#2021', '#spring', '#collection', '#fall', '#dress', '#autumncollection', '#openfashion'];

const PRODUCTS: Product[] = [
  { id: '1', title: '21WN reversible angora cardigan', price: '$120', img: IMAGES.newArrival1 },
  { id: '2', title: '21WN reversible angora cardigan', price: '$120', img: IMAGES.newArrival2 },
  { id: '3', title: '21WN reversible angora cardigan', price: '$120', img: IMAGES.newArrival3 },
  { id: '4', title: 'Oblong bag', price: '$120', img: IMAGES.newArrival4 },
];

const JUST_FOR_YOU: Product[] = [
  { id: 'j1', title: 'Harris Tweed Three button Jacket', price: '$120', img: IMAGES.justForYou1 },
  { id: 'j2', title: 'Cashmere Blend Cropped Jacket', price: '$120', img: IMAGES.justForYou2 },
];

export default function ShopIndex() {
  const router = useRouter(); // ← added
  const [loaded, error] = useFonts({
    'Bodoni-BoldItalic': BodoniModa_700Bold_Italic,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  // Shared handler — both grids use the same route
  const goToProduct = (id: string) => {
    router.push({ pathname: '/product/[id]', params: { id } });
  };

  return (
    <View style={styles.container}>
      <HomeHeader />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO SECTION */}
        <View style={styles.heroContainer}>
          <Image source={IMAGES.hero} style={styles.heroImage} contentFit="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.2)']}
            style={styles.heroOverlay}
          >
            <Text style={styles.heroTitle}>
              LUXURY{'\n'}FASHION{'\n'}& ACCESSORIES
            </Text>
            <BlurView intensity={40} tint="dark" style={styles.glassButtonWrapper}>
              <TouchableOpacity style={styles.heroButton}>
                <Text style={styles.heroButtonText}>EXPLORE COLLECTION</Text>
              </TouchableOpacity>
            </BlurView>
          </LinearGradient>
        </View>

        {/* NEW ARRIVALS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NEW ARRIVAL</Text>
          <View style={styles.ornamentContainer}>
            <View style={styles.ornamentLine} />
            <View style={styles.diamond} />
            <View style={styles.ornamentLine} />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {CATEGORIES.map((cat, i) => (
              <TouchableOpacity key={cat} style={styles.catButton}>
                <Text style={[styles.catText, i === 0 && styles.catTextActive]}>{cat}</Text>
                {i === 0 && <View style={styles.activeDot} />}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{ height: 640, width }}>
            <FlashList<Product>
              data={PRODUCTS}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                // FIX: Wrapped in Pressable → navigates to product detail
                <Pressable style={styles.productCard} onPress={() => goToProduct(item.id)}>
                  <Image source={item.img} style={styles.productImage} transition={500} />
                  <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.productPrice}>{item.price}</Text>
                </Pressable>
              )}
            />
          </View>

          <TouchableOpacity style={styles.exploreMore}>
            <Text style={styles.exploreText}>Explore More →</Text>
          </TouchableOpacity>
        </View>

        {/* BRAND STRIP */}
        <View style={styles.brandStrip}>
          <View style={styles.ornamentContainer}>
            <View style={styles.ornamentLine} />
            <View style={styles.diamond} />
            <View style={styles.ornamentLine} />
          </View>
          <View style={styles.brandLogos}>
            <Text style={styles.brandLogoText}>PRADA</Text>
            <Text style={styles.brandLogoText}>BURBERRY</Text>
            <Text style={styles.brandLogoText}>GUCCI</Text>
          </View>
          <View style={styles.ornamentContainer}>
            <View style={styles.ornamentLine} />
            <View style={styles.diamond} />
            <View style={styles.ornamentLine} />
          </View>
        </View>

        {/* COLLECTIONS */}
        <View style={styles.collections}>
          <Text style={styles.sectionTitle}>COLLECTIONS</Text>
          <View style={styles.divider} />
          <View style={styles.collectionItem}>
            <Image source={IMAGES.collectionOct} style={styles.collectionBanner} />
            <Text style={styles.collectionLabel}>October Collection</Text>
          </View>
          <View style={[styles.collectionItem, { marginTop: 20 }]}>
            <Image source={IMAGES.collectionAutumn} style={[styles.collectionBanner, { height: 350 }]} />
            <Text style={styles.collectionLabel}>Autumn Collection</Text>
          </View>
        </View>

        {/* JUST FOR YOU */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>JUST FOR YOU</Text>
          <View style={styles.divider} />
          <View style={{ height: 420, width }}>
            <FlashList<Product>
              horizontal
              data={JUST_FOR_YOU}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                // FIX: Wrapped in Pressable → navigates to product detail
                <Pressable style={[styles.productCard, { width: 260 }]} onPress={() => goToProduct(item.id)}>
                  <Image source={item.img} style={[styles.productImage, { height: 320 }]} transition={500} />
                  <Text style={styles.productTitle}>{item.title}</Text>
                  <Text style={styles.productPrice}>{item.price}</Text>
                </Pressable>
              )}
            />
          </View>
        </View>

        {/* TRENDING TAGS */}
        <View style={[styles.section, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>@TRENDING</Text>
          <View style={styles.trendingContainer}>
            {TRENDING_TAGS.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <BrandFooter showBenefits={true} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroContainer: { width, height: 720 },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.05)', justifyContent: 'center', paddingHorizontal: 30, alignItems: 'center', marginTop: 60 },
  heroTitle: { fontFamily: 'Bodoni-BoldItalic', fontSize: 40, fontWeight: '300', color: '#ffff', letterSpacing: -1, fontStyle: 'italic', textTransform: 'uppercase', textShadowColor: 'rgba(0, 0, 0, 0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10 },
  glassButtonWrapper: { marginTop: 40, borderRadius: 30, overflow: 'hidden', borderColor: 'rgba(255,255,255,0.3)' },
  heroButton: { paddingVertical: 18, paddingHorizontal: 30, backgroundColor: 'rgba(255,255,255,0.2)' },
  heroButtonText: { color: '#fff', fontSize: 14, letterSpacing: 3, fontWeight: '300' },
  section: { marginTop: 50, alignItems: 'center' },
  sectionTitle: { fontSize: 18, letterSpacing: 6, fontWeight: '400', marginBottom: 10, textTransform: 'uppercase' },
  divider: { width: 100, height: 1, backgroundColor: '#eee', marginBottom: 25 },
  catScroll: { marginBottom: 30 },
  catButton: { paddingHorizontal: 15, alignItems: 'center' },
  catText: { fontSize: 14, color: '#999', letterSpacing: 1 },
  catTextActive: { color: '#000', fontWeight: '500' },
  activeDot: { width: 4, height: 4, backgroundColor: '#dd8560', borderRadius: 2, marginTop: 4 },
  productCard: { width: width / 2 - 20, marginHorizontal: 10, marginBottom: 20 },
  productImage: { width: '100%', height: 220 },
  productTitle: { fontSize: 12, marginTop: 12, color: '#333', textAlign: 'center', lineHeight: 18 },
  productPrice: { fontSize: 14, color: '#dd8560', fontWeight: '400', marginTop: 6, textAlign: 'center' },
  exploreMore: { marginVertical: 20 },
  exploreText: { fontSize: 16, color: '#000', fontWeight: '300' },
  brandStrip: { paddingVertical: 40, alignItems: 'center' },
  brandLogos: { flexDirection: 'row', gap: 30, marginVertical: 20 },
  brandLogoText: { fontSize: 14, color: '#999', letterSpacing: 3, fontWeight: '600' },
  collections: { marginTop: 20, alignItems: 'center' },
  collectionItem: { width, alignItems: 'center', position: 'relative' },
  collectionBanner: { width, height: 450 },
  collectionLabel: { position: 'absolute', bottom: 30, fontSize: 24, color: '#fff', fontWeight: '300', fontStyle: 'italic', letterSpacing: 2 },
  trendingContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 20, gap: 10 },
  tag: { backgroundColor: '#f9f9f9', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  tagText: { fontSize: 13, color: '#666' },
  ornamentContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, width: '60%' },
  ornamentLine: { flex: 1, height: 1, backgroundColor: '#DEDEDE' },
  diamond: { width: 8, height: 8, borderWidth: 1, borderColor: '#DEDEDE', transform: [{ rotate: '45deg' }], marginHorizontal: 10 },
});