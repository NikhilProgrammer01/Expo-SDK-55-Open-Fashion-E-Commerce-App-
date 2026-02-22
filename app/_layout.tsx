import { useColorScheme } from '@/hooks/use-color-scheme';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from '@/services/cache'; // Using our cache service
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// Step 4: Ensure your key is in .env
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export const unstable_settings = {
  anchor: '(shop)', // Adjusted to our shop group
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ClerkLoaded>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(shop)" />
            <Stack.Screen name="(auth)" />
          </Stack>
          <StatusBar style="auto" />
        </ClerkLoaded>
      </ClerkProvider>
    </ThemeProvider>
  );
}