import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { IMAGES } from '@/constants/images';
import AppHeader from '@/components/common/AppHeader';
import BrandFooter from '@/components/common/BrandFooter';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
const { width } = Dimensions.get('window');

interface BlogPost {
  id: string;
  title: string;
  tags: string[];
  date: string;
  image: string;
}

const BLOG_CATEGORIES = ['Fashion', 'Promo', 'Policy', 'Lookbook', 'Sale'];

const BLOG_POSTS: BlogPost[] = [
  { id: '1', title: '2021 Style Guide: The Biggest Fall Trends', tags: ['#Fashion', '#Tips'], date: '4 days ago', image: IMAGES.blog1 },
  { id: '2', title: '2021 Style Guide: The Biggest Fall Trends', tags: ['#Fashion', '#Tips'], date: '4 days ago', image: IMAGES.blog2 },
  { id: '3', title: '2021 Style Guide: The Biggest Fall Trends', tags: ['#Fashion', '#Tips'], date: '4 days ago', image: IMAGES.blog3 },
  { id: '4', title: '2021 Style Guide: The Biggest Fall Trends', tags: ['#Fashion', '#Tips'], date: '4 days ago', image: IMAGES.blog4 },
];

export default function BlogScreen() {
  const insets = useSafeAreaInsets();
  const headerOffset = insets.top + 60; // Safe area + Header height
 const router = useRouter();
  // PART A: The Header (Everything above the cards)
  const renderHeader = () => (
    <View style={{ paddingTop: headerOffset + 30 }}>
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>BLOG</Text>
        <View style={styles.ornamentContainer}>
          <View style={styles.ornamentLine} />
          <View style={styles.diamond} />
          <View style={styles.ornamentLine} />
        </View>
      </View>

      <View style={styles.categoryWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {BLOG_CATEGORIES.map((cat, i) => (
            <TouchableOpacity key={cat} style={[styles.catChip, i === 0 && styles.catChipActive]}>
              <Text style={[styles.catText, i === 0 && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  // PART B: The Footer (Everything below the cards)
  const renderFooter = () => (
    <View style={styles.listFooter}>
      <TouchableOpacity style={styles.loadMoreBtn}>
        <Text style={styles.loadMoreText}>LOAD MORE</Text>
        <Ionicons name="add-outline" size={24} color="#000" />
      </TouchableOpacity>
      <BrandFooter showBenefits={false} />
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader />
      
      <FlashList<BlogPost>
        data={BLOG_POSTS}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9} 
 onPress={() => router.push({
  pathname: "/blog/[id]",
  params: { id: item.id }
})}
  style={styles.blogCard}>
            <View style={styles.imageWrapper}>
              <Image source={item.image} style={styles.blogImage} contentFit="cover" transition={500} />
              <TouchableOpacity style={styles.bookmarkBtn}>
                <Ionicons name="bookmark-outline" size={22} color="#fff" />
              </TouchableOpacity>
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.imageOverlay}>
                <Text style={styles.blogTitle}>{item.title}</Text>
              </LinearGradient>
            </View>
            <View style={styles.blogCardFooter}>
              <View style={styles.tagRow}>
                {item.tags.map(tag => <Text key={tag} style={styles.tagText}>{tag}</Text>)}
              </View>
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
          </TouchableOpacity >
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  // Title Section
  titleSection: { alignItems: 'center' },
  mainTitle: { fontSize: 20, letterSpacing: 8, fontWeight: '400', color: '#000' },
  ornamentContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 15, width: '40%' },
  ornamentLine: { flex: 1, height: 1, backgroundColor: '#DEDEDE' },
  diamond: { width: 8, height: 8, borderWidth: 1, borderColor: '#DEDEDE', transform: [{ rotate: '45deg' }], marginHorizontal: 10 },

  // Categories
  categoryWrapper: { marginVertical: 20 },
  catScroll: { paddingHorizontal: 20, gap: 10 },
  catChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25, backgroundColor: '#F9F9F9' },
  catChipActive: { backgroundColor: '#eee' },
  catText: { fontSize: 14, color: '#888' },
  catTextActive: { color: '#000', fontWeight: '500' },

  // Blog Card
  blogCard: { marginHorizontal: 20, marginBottom: 35 },
  imageWrapper: { width: '100%', height: 240, borderRadius: 2, overflow: 'hidden', position: 'relative' },
  blogImage: { width: '100%', height: '100%' },
  bookmarkBtn: { position: 'absolute', top: 15, right: 15, zIndex: 10 },
  imageOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', padding: 15 },
  blogTitle: { color: '#fff', fontSize: 18, fontWeight: '600', lineHeight: 26, letterSpacing: 1, textTransform: 'uppercase' },
  
  blogCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingHorizontal: 5 },
  tagRow: { flexDirection: 'row', gap: 10 },
  tagText: { color: '#888', fontSize: 13 },
  dateText: { color: '#bbb', fontSize: 13 },

  // Footer Components
  listFooter: { marginTop: 10 },
  loadMoreBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: '#DEDEDE', 
    marginHorizontal: 50, 
    paddingVertical: 16, 
    marginBottom: 50,
    gap: 12,
    backgroundColor: '#fff' 
  },
  loadMoreText: { fontSize: 16, letterSpacing: 3, fontWeight: '300' }
});