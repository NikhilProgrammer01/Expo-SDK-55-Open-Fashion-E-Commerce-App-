//app/(auth)/_layout.tsx
import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  // If the user is already signed in, redirect them to the home page
  if (isSignedIn) {
    return <Redirect href={'/'} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}