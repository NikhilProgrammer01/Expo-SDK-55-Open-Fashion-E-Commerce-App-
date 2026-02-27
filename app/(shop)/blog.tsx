//app/(shop)/blog.tsx
import AppHeader from '@/components/common/AppHeader';
import BrandFooter from '@/components/common/BrandFooter';
import { IMAGES } from '@/constants/images';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const headerOffset = insets.top + 60;
  const { signOut } = useAuth();
  const router = useRouter();
  // PART A: The Header (Centered via paddingHorizontal in FlashList)
  const renderHeader = () => (
    <View style={{ paddingTop: headerOffset + 30 }}>
      <View style={styles.titleSection}>
        <TouchableOpacity 
          onPress={() => signOut()} 
          style={styles.logoutBtn}
        >
          <Ionicons name="log-out-outline" size={22} color="#888" />
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>

        <Text style={styles.mainTitle}>BLOG</Text>
        <View style={styles.ornamentContainer}>
          <View style={styles.ornamentLine} />
          <View style={styles.diamond} />
          <View style={styles.ornamentLine} />
        </View>
      </View>

      <View style={styles.categoryWrapper}>
        {/* Chips handle their own horizontal scroll but are now aligned to the card edge */}
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

  // PART B: The Footer
  const renderFooter = () => (
    <View style={styles.listFooter}>
      <TouchableOpacity style={styles.loadMoreBtn}>
        <Text style={styles.loadMoreText}>LOAD MORE</Text>
        <Ionicons name="add-outline" size={24} color="#000" />
      </TouchableOpacity>
      {/* BrandFooter needs to break out of the 20px padding to go full width */}
      <View style={{ marginHorizontal: -20 }}>
         <BrandFooter showBenefits={false} />
      </View>
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
        ItemSeparatorComponent={() => <View style={{ height:20 }} />}
        // FIX: The core centering logic moves to the list container
        contentContainerStyle={styles.listContainer}
  renderItem={({ item }) => (
  <Pressable
    style={styles.blogCard}
    onPress={() => {
      router.push({ pathname: "/blog/[id]", params: { id: item.id } });
    }}
  >
    <View style={styles.imageWrapper} pointerEvents="box-none">
      <Image source={item.image} style={styles.blogImage} contentFit="cover" transition={500} />
      <TouchableOpacity style={styles.bookmarkBtn} onPress={(e) => e.stopPropagation()}>
        <Ionicons name="bookmark-outline" size={22} color="#fff" />
      </TouchableOpacity>
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.imageOverlay}>
        <Text style={styles.blogTitle}>{item.title}</Text>
      </LinearGradient>
    </View>

    <View style={styles.blogCardFooter}>
      <View style={styles.tagRow}>
        {item.tags.map(tag => (
          <Text key={tag} style={styles.tagText}>{tag}</Text>
        ))}
      </View>
      <Text style={styles.dateText}>{item.date}</Text>
    </View>
  </Pressable>
)}

      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  // FlashList Global Container
  listContainer: {
    paddingHorizontal: 20, // Forces all items (Cards, Header, Button) to stay centered
  },

  // Title Section
  titleSection: { alignItems: 'center', position: 'relative' },
  logoutBtn: {
    position: 'absolute',
    right: 0,
    top: -10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  logoutText: {
    fontSize: 10,
    color: '#888',
    letterSpacing: 1
  },
  mainTitle: { fontSize: 20, letterSpacing: 8, fontWeight: '400', color: '#000' },
  ornamentContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 15, width: '40%', alignSelf: 'center' },
  ornamentLine: { flex: 1, height: 1, backgroundColor: '#DEDEDE' },
  diamond: { width: 8, height: 8, borderWidth: 1, borderColor: '#DEDEDE', transform: [{ rotate: '45deg' }], marginHorizontal: 10 },

  // Categories
  categoryWrapper: { marginVertical: 20 },
  catScroll: { gap: 10 }, // Horizontal margin removed here because listContainer handles it
  catChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25, backgroundColor: '#F9F9F9' },
  catChipActive: { backgroundColor: '#eee' },
  catText: { fontSize: 14, color: '#888' },
  catTextActive: { color: '#000', fontWeight: '500' },

  // Blog Card - SIMPLIFIED
  blogCard: { 
    width: '100%',       // Fills exactly (width - 40) because of listContainer padding
    marginBottom: 35,
    backgroundColor: '#fff',
  },
  imageWrapper: { 
    width: '100%', 
    height: 240, 
    borderRadius: 4, 
    overflow: 'hidden', 
    position: 'relative' 
  },
  blogImage: { width: '100%', height: '100%' },
  bookmarkBtn: { position: 'absolute', top: 15, right: 15, zIndex: 20 },
  imageOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', padding: 20 },
  blogTitle: { color: '#fff', fontSize: 18, fontWeight: '600', lineHeight: 26, letterSpacing: 1, textTransform: 'uppercase' },
  
  blogCardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 12 
  },
  tagRow: { flexDirection: 'row', gap: 12 },
  tagText: { color: '#888', fontSize: 13 },
  dateText: { color: '#bbb', fontSize: 13 },

  // Footer
  listFooter: { marginTop: 10 },
  loadMoreBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: '#DEDEDE', 
    paddingVertical: 16, 
    marginBottom: 50,
    gap: 12
  },
  loadMoreText: { fontSize: 16, letterSpacing: 3, fontWeight: '300' }
});