import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { IMAGES } from '@/constants/images';
import HomeHeader from '@/components/home/HomeHeader';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, BodoniModa_700Bold_Italic } from '@expo-google-fonts/bodoni-moda';
import * as SplashScreen from 'expo-splash-screen';
import BrandFooter from '@/components/common/BrandFooter';
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
  return (
    <View style={styles.container}>
      <HomeHeader />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO SECTION */}
        <View style={styles.heroContainer}>
          <Image source={IMAGES.hero} style={styles.heroImage} contentFit="cover" />
          
          {/* We replace the View overlay with a LinearGradient for better text punch */}
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
            {/* Custom Ornament Divider */}
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

          {/* FlashList v2 - estimatedItemSize removed */}
          <View style={{ height: 640, width: width }}>
             <FlashList<Product>
                data={PRODUCTS}
                numColumns={2}
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.productCard}>
                    <Image source={item.img} style={styles.productImage} transition={500} />
                    <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.productPrice}>{item.price}</Text>
                  </View>
                )}
             />
          </View>
          
          <TouchableOpacity style={styles.exploreMore}>
             <Text style={styles.exploreText}>Explore More →</Text>
          </TouchableOpacity>
        </View>

        {/* BRAND STRIP */}
        <View style={styles.brandStrip}>
              {/* Custom Ornament Divider */}
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
              {/* Custom Ornament Divider */}
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

        {/* JUST FOR YOU - FlashList v2 Horizontal */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>JUST FOR YOU</Text>
            <View style={styles.divider} />
            <View style={{ height: 420, width: width }}>
                <FlashList<Product> 
                    horizontal
                    data={JUST_FOR_YOU}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={[styles.productCard, { width: 260 }]}>
                            <Image source={item.img} style={[styles.productImage, { height: 320 }]} transition={500} />
                            <Text style={styles.productTitle}>{item.title}</Text>
                            <Text style={styles.productPrice}>{item.price}</Text>
                        </View>
                    )}
                />
            </View>
        </View>

        {/* TRENDING TAGS */}
          <View style={[styles.section, { marginTop: 20 }]}>
            <Text style={styles.sectionTitle}>@TRENDING</Text>
            <View style={styles.trendingContainer}>
                {TRENDING_TAGS.map(tag => (
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
  heroContainer: { width: width, height: 720 },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.05)', justifyContent: 'center', paddingHorizontal: 30, 
    alignItems: 'center',  marginTop: 60   },
  heroTitle: {  fontFamily: 'Bodoni-BoldItalic', fontSize: 40, fontWeight: '300',  color: '#ffff', letterSpacing: -1, fontStyle: 'italic', textTransform: 'uppercase', textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10, },
  glassButtonWrapper: { marginTop: 40, borderRadius: 30, overflow: 'hidden',borderColor: 'rgba(255,255,255,0.3)',  },
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
  exploreMore: { marginVertical: 20, },
  exploreText: { fontSize: 16, color: '#000', fontWeight: '300' },
  brandStrip: { paddingVertical: 40, alignItems: 'center' },
  brandDivider: { width: 100, height: 1, backgroundColor: '#eee' },
  brandLogos: { flexDirection: 'row', gap: 30, marginVertical: 20 },
  brandLogoText: { fontSize: 14, color: '#999', letterSpacing: 3, fontWeight: '600' },
  collections: { marginTop: 20, alignItems: 'center' },
  collectionItem: { width: width, alignItems: 'center', position: 'relative' },
  collectionBanner: { width: width, height: 450 },
  collectionLabel: { position: 'absolute', bottom: 30, fontSize: 24, color: '#fff', fontWeight: '300', fontStyle: 'italic', letterSpacing: 2 },
  trendingContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 20, gap: 10 },
  tag: { backgroundColor: '#f9f9f9', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  tagText: { fontSize: 13, color: '#666' },
  footer: { padding: 40, alignItems: 'center', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f1f1' },
  footerBrandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  footerLogo: { fontSize: 20, letterSpacing: 4, fontWeight: '300' },
  footerDescription: { textAlign: 'center', color: '#666', lineHeight: 24, marginBottom: 30, fontSize: 14 },
  footerInfoSection: { alignItems: 'center', marginBottom: 30 },
  footerContact: { fontSize: 15, color: '#333', marginBottom: 8 },
  footerLinks: { flexDirection: 'row', gap: 30, marginTop: 40, marginBottom: 30 },
  linkText: { fontSize: 16, color: '#000' },
  copyright: { color: '#999', fontSize: 12, marginTop: 20 },
    brandFooter: {
    backgroundColor: '#F9F9F9', // Matches the off-white background in the image
    paddingVertical: 50,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  footerHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
   footerBrandLogo: {
   fontSize: 25,              // Matches sectionTitle
    letterSpacing: 6,         // Matches sectionTitle for consistency
    fontWeight: '400',         // Matches sectionTitle
    textTransform: 'uppercase',
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  footerBrandDescription: {
    textAlign: 'center',
    color: '#555',
    lineHeight: 24,
    fontSize: 15,
    paddingHorizontal: 10,
  },
   ornamentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '60%',
  },
  ornamentLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DEDEDE',
  },
  diamond: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 10,
  },
   benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
  },
  benefitItem: {
    width: '45%',
    alignItems: 'center',
    marginBottom: 40,
  },
  benefitText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 13,
    marginTop: 12,
    lineHeight: 18,
  },
  
  // Flourish Style
  flourishContainer: {
    marginTop: 10,
    opacity: 0.5,
  },
  followGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    marginTop: 20,
    justifyContent: 'center',
  },
  followItem: {
    width: (width - 40) / 2, // 2 columns
    height: 220,
    padding: 5,
    position: 'relative',
  },
  followImage: {
    width: '100%',
    height: '100%',
  },
  handleText: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  contactFooter: {
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 10,
  },
  contactDetails: {
    alignItems: 'center',
    marginVertical: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 32,
    fontWeight: '300',
  },
  bottomNavLinks: {
    flexDirection: 'row',
    gap: 50,
    marginTop: 20,
    marginBottom: 40,
  },
  bottomNavLinkText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
  },
  copyrightWrapper: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
  },
  copyrightText: {
    fontSize: 12,
    color: '#888',
  },
});