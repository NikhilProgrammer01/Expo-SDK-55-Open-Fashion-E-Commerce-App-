import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { IMAGES } from '@/constants/images';
import AppHeader from '@/components/common/AppHeader';
import BrandFooter from '@/components/common/BrandFooter';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CAROUSEL_ITEM_WIDTH = width - 40;

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
   const [activeIndex, setActiveIndex] = useState(0);
  const insets = useSafeAreaInsets();

  // Handle dot update logic
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (activeIndex !== roundIndex) {
      setActiveIndex(roundIndex);
    }
  };

  // In a real app, you'd fetch by ID. Here we use a high-end template.
  return (
    <View style={styles.container}>
      <AppHeader />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom }}>
        {/* HERO IMAGE */}
        <Image source={IMAGES.blog1} style={[styles.heroImage, { marginTop: insets.top + 60 }]} contentFit="cover" />

        <View style={styles.content}>
          {/* ARTICLE TITLE */}
          <Text style={styles.articleTitle}>
            2021 Style Guide: The Biggest Fall Trends
          </Text>

          {/* INTRO TEXT WITH DROP CAP */}
          <View style={styles.textBlock}>
            <Text style={styles.bodyText}>
              <Text style={styles.dropCap}>Y</Text>ou guys know how much I love mixing high and low-end — it’s the best way to get the most bang for your buck while still elevating your wardrobe. The same goes for handbags! And honestly they are probably the best pieces to mix and match.
            </Text>
          </View>

           <View style={styles.carouselContainer}>
            <ScrollView 
              horizontal 
              // pagingEnabled can be unreliable on some Android versions, 
              // so we use snapToInterval for pixel-perfection
              snapToInterval={width} 
              snapToAlignment="center"
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              scrollEventThrottle={16}
              disableIntervalMomentum={true} // Prevents "skipping" slides
            >
              {/* SLIDE 1 */}
              <View style={styles.slideWrapper}>
                <Image source={IMAGES.newArrival4} style={styles.carouselImage} transition={500} />
              </View>

              {/* SLIDE 2 */}
              <View style={styles.slideWrapper}>
                <Image source={IMAGES.justForYou1} style={styles.carouselImage} transition={500} />
              </View>

              {/* SLIDE 3 */}
              <View style={styles.slideWrapper}>
                <Image source={IMAGES.newArrival2} style={styles.carouselImage} transition={500} />
              </View>
            </ScrollView>

            {/* DYNAMIC DOTS */}
            <View style={styles.pagination}>
              {[0, 1, 2].map((i) => (
                <View 
                  key={i} 
                  style={[
                    styles.dot, 
                    activeIndex === i && styles.activeDot
                  ]} 
                />
              ))}
            </View>
          </View>


          {/* SECONDARY TEXT */}
          <View style={styles.textBlock}>
            <Text style={styles.bodyText}>
              I found this <Text style={styles.highlightText}>Saint Laurent canvas handbag</Text> this summer and immediately fell in love. The neutral fabrics are so beautiful and I like how this handbag can also carry into fall. The mini Fendi bucket bag with the sheer fabric is so fun and such a statement bag.
            </Text>
          </View>

          {/* META INFO */}
          <View style={styles.metaSection}>
            <Text style={styles.metaText}>Posted by OpenFashion | 3 Days ago</Text>
            <View style={styles.tagRow}>
                <View style={styles.tag}><Text style={styles.tagText}>#Fashion</Text></View>
                <View style={styles.tag}><Text style={styles.tagText}>#Tips</Text></View>
            </View>
          </View>
        </View>

        <BrandFooter showBenefits={false} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroImage: { width: width, height: 450 },
  content: { padding: 20 },
  articleTitle: {
    fontFamily: 'Bodoni-BoldItalic', // Consistent with Home Hero
    fontSize: 28,
    lineHeight: 38,
    color: '#000',
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 20,
    letterSpacing: 1,
  },
  textBlock: { marginBottom: 25 },
  bodyText: {
    fontSize: 16,
    lineHeight: 30, // Airy for luxury reading
    color: '#333',
    fontWeight: '300',
    textAlign: 'left',
  },
  dropCap: {
    fontSize: 55,
    fontFamily: 'Bodoni-BoldItalic',
    color: '#000',
    lineHeight: 60,
  },
  highlightText: {
    color: '#dd8560', // The Open Fashion accent color
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  carouselContainer: { 
    marginVertical: 30, // Increased spacing for editorial feel
    width: width,       // Container takes full screen width
    alignItems: 'center',
    left: -20,          // This "offsets" the 20px padding from the parent 'content' view
  },
  slideWrapper: {
    width: width,       // Each slide is EXACTLY the screen width
    justifyContent: 'center',
    alignItems: 'center',
  },

carouselImage: { 
    width: width - 40,  // The image stays smaller to show the white background margins
    height: 500,        // Slightly taller for luxury impact
    borderRadius: 2,
    backgroundColor: '#f5f5f5', // Placeholder color while loading
  },
    pagination: { flexDirection: 'row', gap: 8, marginTop: 15 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#eee', borderWidth: 1, borderColor: '#ccc' },
activeDot: { 
    backgroundColor: '#000', // Solid black for active
    width: 8, 
    height: 8, 
    transform: [{ rotate: '45deg' }], // Diamond shape
    borderRadius: 0, 
  },  
  metaSection: { marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  metaText: { fontSize: 14, color: '#888', marginBottom: 15 },
  tagRow: { flexDirection: 'row', gap: 10 },
  tag: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F9F9F9' },
  tagText: { fontSize: 12, color: '#555' }
});