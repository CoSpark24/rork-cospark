import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { useSubscriptionStore } from '@/store/subscription-store';
import Colors from '@/constants/colors';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuthStore();
  const { setUserRegion, checkSubscriptionStatus } = useSubscriptionStore();

  useEffect(() => {
    // Check subscription status on app load
    checkSubscriptionStatus();
    
    // Set user region based on device locale or IP
    // In a real app, you would use geolocation or IP-based detection
    // For demo purposes, we'll use a hardcoded value
    setUserRegion('IN');
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.card,
        },
        headerTintColor: Colors.text,
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}
      initialRouteName="(auth)/splash"
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="subscription" options={{ title: 'Subscription Plans' }} />
      <Stack.Screen name="ai-mentor" options={{ title: 'AI Mentor' }} />
      <Stack.Screen name="nearby-founders" options={{ title: 'Nearby Founders' }} />
      <Stack.Screen name="circles" options={{ title: 'Startup Circles' }} />
      <Stack.Screen name="crowdfunding" options={{ title: 'Crowdfunding' }} />
      <Stack.Screen name="investors" options={{ title: 'Investors' }} />
      <Stack.Screen name="milestones" options={{ title: 'Milestones' }} />
      <Stack.Screen name="idea-validator" options={{ title: 'Idea Validator' }} />
      <Stack.Screen name="business-plans" options={{ title: 'Business Plans' }} />
      <Stack.Screen name="fundraising-checklist" options={{ title: 'Fundraising Checklist' }} />
      <Stack.Screen name="legal-templates" options={{ title: 'Legal Templates' }} />
      <Stack.Screen name="profile/index" options={{ title: 'Profile' }} />
      <Stack.Screen name="profile/edit" options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="pitch-deck/create" options={{ title: 'Create Pitch Deck' }} />
      <Stack.Screen name="pitch-deck/[id]" options={{ title: 'Pitch Deck' }} />
      <Stack.Screen name="business-plan/create" options={{ title: 'Create Business Plan' }} />
      <Stack.Screen name="business-plan/[id]" options={{ title: 'Business Plan' }} />
      <Stack.Screen name="conversation/[id]" options={{ title: 'Conversation' }} />
    </Stack>
  );
}