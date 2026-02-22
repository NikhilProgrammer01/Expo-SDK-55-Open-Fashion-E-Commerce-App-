import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Clerk recommendation for faster browser warming
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onSignInPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        if (setActive) {
          await setActive({ session: createdSessionId });
          router.replace('/');
        }
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, [startOAuthFlow, router]);

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?q=80&w=765' }} 
      style={styles.background}
    >
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.brandTitle}>LUXE</Text>
            <Text style={styles.brandSubtitle}>Elevate your style.</Text>
          </View>

          <BlurView intensity={30} style={styles.formContainer}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            
            <TouchableOpacity style={styles.button} onPress={onSignInPress}>
              <Text style={styles.buttonText}>Continue with Google</Text>
            </TouchableOpacity>
            
            <Text style={styles.disclaimer}>
              By continuing, you agree to our Terms of Service.
            </Text>
          </BlurView>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  gradient: { flex: 1 },
  container: { flex: 1, justifyContent: 'flex-end', padding: 24, paddingBottom: 80 },
  headerContainer: { marginBottom: 40 },
  brandTitle: { fontSize: 48, fontWeight: '800', color: '#fff', letterSpacing: 4 },
  brandSubtitle: { fontSize: 18, color: '#fff', opacity: 0.8 },
  formContainer: {
    padding: 30,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  welcomeText: { color: '#fff', fontSize: 20, fontWeight: '600', marginBottom: 24 },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#fff',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { fontSize: 16, fontWeight: '700', color: '#000' },
  disclaimer: { color: '#fff', opacity: 0.5, fontSize: 12, marginTop: 20, textAlign: 'center' }
});