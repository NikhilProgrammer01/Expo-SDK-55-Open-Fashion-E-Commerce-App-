import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';

export default function ShopLayout() {
  const { isSignedIn } = useAuth();

  // If user is not signed in, force them to login
  if (!isSignedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}