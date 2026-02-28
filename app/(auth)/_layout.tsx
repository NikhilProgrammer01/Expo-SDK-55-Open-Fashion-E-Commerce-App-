// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

// No redirect logic here — Stack.Protected in root _layout.tsx
// handles redirecting signed-in users away from auth screens
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}