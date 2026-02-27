// components/home/HomeHeader.tsx
import DrawerMenu from '@/components/common/DrawerMenu';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeHeader() {
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <BlurView
        intensity={Platform.OS === 'ios' ? 60 : 80}
        tint="extraLight"
        experimentalBlurMethod="dimezisBlurView"
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            backgroundColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
          },
        ]}
      >
        <View style={styles.content}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setMenuOpen(true)}>
            <Ionicons name="menu-outline" size={28} color="#000" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Open Fashion</Text>
          </View>

          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.icon} activeOpacity={0.7}>
              <Ionicons name="search-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons name="bag-handle-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>

      <DrawerMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    elevation: 0,
  },
  content: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  logoContainer: { flex: 1, alignItems: 'center' },
  logoText: { fontSize: 20, fontWeight: '400', letterSpacing: 4, textTransform: 'uppercase', color: '#000' },
  rightIcons: { flexDirection: 'row' },
  icon: { marginRight: 15 },
});