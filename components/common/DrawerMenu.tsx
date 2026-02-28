// components/common/DrawerMenu.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    LayoutChangeEvent,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.82;

const TABS = ['WOMEN', 'MAN', 'KIDS'] as const;
type Tab = typeof TABS[number];

const MENU_ITEMS: Record<Tab, { label: string; sub?: string[] }[]> = {
  WOMEN: [
    { label: 'New' },
    { label: 'Apparel', sub: ['Outer', 'Dress', 'Blouse/Shirt', 'T-Shirt', 'Knitwear', 'Skirt', 'Pants', 'Denim', 'Kids'] },
    { label: 'Bag', sub: ['Tote', 'Crossbody', 'Clutch', 'Backpack'] },
    { label: 'Shoes', sub: ['Heels', 'Flats', 'Sneakers', 'Boots'] },
    { label: 'Beauty', sub: ['Skincare', 'Fragrance', 'Makeup'] },
    { label: 'Accessories', sub: ['Jewelry', 'Scarves', 'Hats', 'Belts'] },
  ],
  MAN: [
    { label: 'New' },
    { label: 'Apparel', sub: ['Shirts', 'Trousers', 'Jackets', 'Knitwear', 'T-Shirts'] },
    { label: 'Bag', sub: ['Briefcase', 'Backpack', 'Tote'] },
    { label: 'Shoes', sub: ['Formal', 'Sneakers', 'Boots', 'Loafers'] },
    { label: 'Accessories', sub: ['Watches', 'Belts', 'Scarves'] },
  ],
  KIDS: [
    { label: 'New' },
    { label: 'Girls', sub: ['Dresses', 'Tops', 'Bottoms', 'Outerwear'] },
    { label: 'Boys', sub: ['Shirts', 'Shorts', 'Trousers', 'Outerwear'] },
    { label: 'Shoes' },
    { label: 'Accessories' },
  ],
};

// ─── MenuItem ─────────────────────────────────────────────────────────────────
function MenuItem({ label, sub, onSubPress }: { label: string; sub?: string[]; onSubPress?: (item: string) => void }) {
  const [open, setOpen] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;
  const SUB_ITEM_HEIGHT = 48;
  const expandedHeight = (sub?.length ?? 0) * SUB_ITEM_HEIGHT;

  const toggle = () => {
    const toValue = open ? 0 : 1;
    Animated.parallel([
      Animated.timing(rotation, { toValue, duration: 200, useNativeDriver: true }),
      Animated.timing(heightAnim, { toValue: open ? 0 : expandedHeight, duration: 220, useNativeDriver: false }),
    ]).start();
    setOpen((p) => !p);
  };

  const rotate = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <View style={menuStyles.itemWrapper}>
      <TouchableOpacity style={menuStyles.itemRow} onPress={sub ? toggle : undefined} activeOpacity={0.6}>
        <Text style={menuStyles.itemLabel}>{label}</Text>
        {sub && (
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="chevron-down-outline" size={16} color="#888" />
          </Animated.View>
        )}
      </TouchableOpacity>
      {sub && (
        <Animated.View style={[menuStyles.subList, { height: heightAnim, overflow: 'hidden' }]}>
          {sub.map((s) => (
            <TouchableOpacity key={s} style={menuStyles.subItem} onPress={() => onSubPress?.(s)} activeOpacity={0.6}>
              <Text style={menuStyles.subLabel}>{s}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
      <View style={menuStyles.separator} />
    </View>
  );
}

// ─── DrawerMenu ───────────────────────────────────────────────────────────────
interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const [activeTab, setActiveTab] = useState<Tab>('WOMEN');
  const [modalMounted, setModalMounted] = useState(false);

  // Track the x position and width of each tab via onLayout
  const tabLayouts = useRef<{ x: number; width: number }[]>([]);
  // Animated value for the indicator's translateX and width
  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;

  const TAB_INDEX: Record<Tab, number> = { WOMEN: 0, MAN: 1, KIDS: 2 };

  const animateIndicatorTo = (tab: Tab) => {
    const idx = TAB_INDEX[tab];
    const layout = tabLayouts.current[idx];
    if (!layout) return;
    Animated.parallel([
      Animated.spring(indicatorX, { toValue: layout.x, useNativeDriver: false, bounciness: 0, speed: 20 }),
      Animated.spring(indicatorWidth, { toValue: layout.width, useNativeDriver: false, bounciness: 0, speed: 20 }),
    ]).start();
  };

  const onTabLayout = (e: LayoutChangeEvent, idx: number) => {
    const { x, width: w } = e.nativeEvent.layout;
    tabLayouts.current[idx] = { x, width: w };
    // Once we have the first tab layout, initialize indicator position
    if (idx === 0 && TAB_INDEX[activeTab] === 0) {
      indicatorX.setValue(x);
      indicatorWidth.setValue(w);
    }
  };

  const handleTabPress = (tab: Tab) => {
    setActiveTab(tab);
    animateIndicatorTo(tab);
  };

  useEffect(() => {
    if (visible) {
      setModalMounted(true);
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(backdropAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
      }, 10);
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -DRAWER_WIDTH, duration: 260, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 0, duration: 240, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) setModalMounted(false);
      });
    }
  }, [visible]);

  return (
    <Modal transparent visible={modalMounted} animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      {/* Drawer Panel */}
      <Animated.View style={[styles.drawer, { paddingTop: insets.top, transform: [{ translateX: slideAnim }] }]}>
        {/* Close */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close-outline" size={26} color="#333" />
        </TouchableOpacity>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          {/* Static grey base line */}
          <View style={styles.tabUnderline} />

          {/* Animated sliding indicator (line + dot together) */}
          <Animated.View
            style={[
              styles.indicatorTrack,
              { left: indicatorX, width: indicatorWidth },
            ]}
          >
            <View style={styles.indicatorLine} />
            <View style={styles.indicatorDot} />
          </Animated.View>

          {/* Tab buttons */}
          {TABS.map((tab, idx) => (
            <TouchableOpacity
              key={tab}
              onPress={() => handleTabPress(tab)}
              onLayout={(e) => onTabLayout(e, idx)}
              style={styles.tabItem}
            >
              <Animated.Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Animated.Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Menu Items */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.menuScroll}>
          {MENU_ITEMS[activeTab].map((item) => (
            <MenuItem
              key={item.label}
              label={item.label}
              sub={item.sub}
              onSubPress={(sub) => {
  onClose();
  const slug = sub.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-');
  router.push({ pathname: '/category/[slug]', params: { slug, tab: activeTab } });
}}
            />
          ))}

          <View style={styles.footerInfo}>
            <TouchableOpacity style={styles.footerRow}>
              <Ionicons name="call-outline" size={18} color="#555" />
              <Text style={styles.footerText}>(786) 713-8616</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerRow}>
              <Ionicons name="location-outline" size={18} color="#555" />
              <Text style={styles.footerText}>Store locator</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ornamentContainer}>
            <View style={styles.ornamentLine} />
            <View style={styles.ornamentDiamond} />
            <View style={styles.ornamentLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-twitter" size={22} color="#222" /></TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-instagram" size={22} color="#222" /></TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-youtube" size={22} color="#222" /></TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  drawer: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: DRAWER_WIDTH,
    backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 20,
  },
  closeBtn: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, alignSelf: 'flex-start' },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 12,
    position: 'relative',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: '#EFEFEF',
  },
  // Sliding indicator — sits above the grey line
  indicatorTrack: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  indicatorLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#dd8560',
  },
  indicatorDot: {
    width: 7,
    height: 7,
    backgroundColor: '#dd8560',
    borderRadius: 0,
    transform: [{ rotate: '45deg' }],
    marginBottom: -3,
  },
  tabItem: { flex: 1, paddingBottom: 16, alignItems: 'center', zIndex: 1 },
  tabText: { fontSize: 13, letterSpacing: 2, color: '#aaa', fontWeight: '400' },
  tabTextActive: { color: '#111', fontWeight: '500' },

  menuScroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  footerInfo: { marginTop: 28, gap: 16 },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  footerText: { fontSize: 14, color: '#444', fontWeight: '300' },
  ornamentContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 28, width: '55%', alignSelf: 'center' },
  ornamentLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  ornamentDiamond: { width: 7, height: 7, borderWidth: 1, borderColor: '#CECECE', transform: [{ rotate: '45deg' }], marginHorizontal: 10 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 28 },
  socialBtn: { padding: 4 },
});

const menuStyles = StyleSheet.create({
  itemWrapper: {},
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18 },
  itemLabel: { fontSize: 16, color: '#222', fontWeight: '300', letterSpacing: 0.5 },
  separator: { height: 1, backgroundColor: '#F2F2F2' },
  subList: {},
  subItem: { height: 48, justifyContent: 'center', paddingLeft: 12 },
  subLabel: { fontSize: 14, color: '#555', fontWeight: '300', letterSpacing: 0.3 },
});