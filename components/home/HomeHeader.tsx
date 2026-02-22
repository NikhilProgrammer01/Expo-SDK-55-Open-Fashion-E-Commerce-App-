import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeHeader() {
  const insets = useSafeAreaInsets();

  return (
    <BlurView intensity={60} tint="light" style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <TouchableOpacity><Ionicons name="menu-outline" size={28} color="#000" /></TouchableOpacity>
        
        <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Open Fashion</Text>
        </View>

        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.icon}><Ionicons name="search-outline" size={24} color="#000" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="bag-handle-outline" size={24} color="#000" /></TouchableOpacity>
        </View>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 },
  content: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  logoContainer: { flex: 1, alignItems: 'center' },
  logoText: { fontSize: 20, fontWeight: '300', letterSpacing: 2, textTransform: 'uppercase' },
  rightIcons: { flexDirection: 'row' },
  icon: { marginRight: 15 }
});