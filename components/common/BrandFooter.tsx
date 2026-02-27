//components/common/BrandFooter.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function BrandFooter({ showBenefits = true }: { showBenefits?: boolean }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {showBenefits && (
        <View style={styles.brandBenefits}>
          <View style={styles.footerHeader}>
            <Text style={styles.footerBrandLogo}>Open Fashion</Text>
            <Text style={styles.footerBrandDescription}>
              Making a luxurious lifestyle accessible for a generous group of women is our daily drive.
            </Text>
          </View>

          <View style={styles.ornamentContainer}>
            <View style={styles.ornamentLine} />
            <View style={styles.diamond} />
            <View style={styles.ornamentLine} />
          </View>

          <View style={styles.benefitsGrid}>
            <View style={styles.benefitItem}>
              <Ionicons name="prism-outline" size={32} color="#555" />
              <Text style={styles.benefitText}>Fast shipping. Free on orders over $25.</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="leaf-outline" size={32} color="#555" />
              <Text style={styles.benefitText}>Sustainable process from start to finish.</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="diamond-outline" size={32} color="#555" />
              <Text style={styles.benefitText}>Unique designs and high-quality materials.</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="heart-outline" size={32} color="#555" />
              <Text style={styles.benefitText}>Fast shipping. Free on orders over $25.</Text>
            </View>
          </View>

          <View style={styles.flourishContainer}>
            <Ionicons name="infinite-outline" size={40} color="#ccc" />
          </View>
        </View>
      )}

      <View style={styles.contactFooter}>
        <View style={styles.socialRow}>
          <TouchableOpacity><Ionicons name="logo-twitter" size={24} color="#000" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="logo-instagram" size={24} color="#000" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="logo-youtube" size={24} color="#000" /></TouchableOpacity>
        </View>

        <View style={[styles.ornamentContainer, { width: '40%' }]}>
          <View style={styles.ornamentLine} />
          <View style={styles.diamond} />
          <View style={styles.ornamentLine} />
        </View>

        <View style={styles.contactDetails}>
          <Text style={styles.contactText}>support@openui.design</Text>
          <Text style={styles.contactText}>+60 825 876</Text>
          <Text style={styles.contactText}>08:00 - 22:00 - Everyday</Text>
        </View>

        <View style={[styles.ornamentContainer, { width: '40%' }]}>
          <View style={styles.ornamentLine} />
          <View style={styles.diamond} />
          <View style={styles.ornamentLine} />
        </View>

        <View style={styles.bottomNavLinks}>
          <TouchableOpacity><Text style={styles.bottomNavLinkText}>About</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.bottomNavLinkText}>Contact</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/blog')}><Text style={styles.bottomNavLinkText}>Blog</Text></TouchableOpacity>
        </View>

        <View style={styles.copyrightWrapper}>
          <Text style={styles.copyrightText}>Copyright© OpenUI All Rights Reserved.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  brandBenefits: { backgroundColor: '#F9F9F9', paddingVertical: 50, paddingHorizontal: 30, alignItems: 'center' },
  footerHeader: { alignItems: 'center', marginBottom: 30 },
  footerBrandLogo: { fontSize: 18, letterSpacing: 6, fontWeight: '400', textTransform: 'uppercase', color: '#000', marginBottom: 15 },
  footerBrandDescription: { textAlign: 'center', color: '#555', lineHeight: 24, fontSize: 15 },
  ornamentContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, width: '60%' },
  ornamentLine: { flex: 1, height: 1, backgroundColor: '#DEDEDE' },
  diamond: { width: 8, height: 8, borderWidth: 1, borderColor: '#DEDEDE', transform: [{ rotate: '45deg' }], marginHorizontal: 10 },
  benefitsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', marginTop: 30 },
  benefitItem: { width: '45%', alignItems: 'center', marginBottom: 40 },
  benefitText: { textAlign: 'center', color: '#333', fontSize: 13, marginTop: 12 },
  flourishContainer: { marginTop: 10, opacity: 0.5 },
  contactFooter: { paddingVertical: 40, alignItems: 'center', backgroundColor: '#fff' },
  socialRow: { flexDirection: 'row', gap: 30, marginBottom: 10 },
  contactDetails: { alignItems: 'center', marginVertical: 10 },
  contactText: { fontSize: 16, color: '#333', lineHeight: 32, fontWeight: '300' },
  bottomNavLinks: { flexDirection: 'row', gap: 50, marginTop: 20, marginBottom: 40 },
  bottomNavLinkText: { fontSize: 16, color: '#000', fontWeight: '400' },
  copyrightWrapper: { width: width, paddingVertical: 15, backgroundColor: '#F9F9F9', alignItems: 'center' },
  copyrightText: { fontSize: 12, color: '#888' },
});