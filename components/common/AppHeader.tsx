// components/common/AppHeader.tsx
import DrawerMenu from '@/components/common/DrawerMenu';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AppHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <BlurView intensity={60} tint="light" style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => setMenuOpen(true)}>
            <Ionicons name="menu-outline" size={28} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/')} style={styles.logoContainer}>
            <Text style={styles.logoText}>Open Fashion</Text>
          </TouchableOpacity>

          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.icon}>
              <Ionicons name="search-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity>
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
  container: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 },
  content: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  logoContainer: { flex: 1, alignItems: 'center' },
  logoText: { fontSize: 20, fontWeight: '300', letterSpacing: 2, textTransform: 'uppercase' },
  rightIcons: { flexDirection: 'row' },
  icon: { marginRight: 15 },
});