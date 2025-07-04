import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function AuthLayout() {
  return (
    <Stack
      initialRouteName="splash"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Stack.Screen name="splash" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}