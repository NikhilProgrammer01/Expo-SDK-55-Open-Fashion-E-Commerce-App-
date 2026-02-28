// app/(shop)/_layout.tsx
import { Stack } from 'expo-router';

// No redirect logic here — Stack.Protected in root _layout.tsx
// handles redirecting non-signed-in users away from shop screens
export default function ShopLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}