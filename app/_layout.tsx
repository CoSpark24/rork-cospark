import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "@/store/auth-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";

export const unstable_settings = {
  initialRouteName: "(auth)/splash",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function RootLayoutNav() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="profile/edit" 
              options={{ 
                presentation: "modal",
                headerShown: true,
                title: "Edit Profile",
              }} 
            />
            <Stack.Screen 
              name="pitch-deck/create" 
              options={{ 
                headerShown: true,
                title: "Create Pitch Deck",
              }} 
            />
            <Stack.Screen 
              name="pitch-deck/[id]" 
              options={{ 
                headerShown: true,
                title: "Pitch Deck",
              }} 
            />
            <Stack.Screen 
              name="conversation/[id]" 
              options={{ 
                headerShown: true,
                title: "Conversation",
              }} 
            />
            <Stack.Screen 
              name="ai-mentor" 
              options={{ 
                headerShown: true,
                title: "AI Mentor",
              }} 
            />
            <Stack.Screen 
              name="nearby-founders" 
              options={{ 
                headerShown: true,
                title: "Nearby Founders",
              }} 
            />
            <Stack.Screen 
              name="subscription" 
              options={{ 
                headerShown: true,
                title: "Subscription",
              }} 
            />
            <Stack.Screen 
              name="circles" 
              options={{ 
                headerShown: true,
                title: "Founder Circles",
              }} 
            />
            <Stack.Screen 
              name="circles/[id]" 
              options={{ 
                headerShown: true,
                title: "Circle Chat",
              }} 
            />
            <Stack.Screen 
              name="crowdfunding" 
              options={{ 
                headerShown: true,
                title: "Crowdfunding",
              }} 
            />
            <Stack.Screen 
              name="crowdfunding/[id]" 
              options={{ 
                headerShown: true,
                title: "Campaign Details",
              }} 
            />
            <Stack.Screen 
              name="investors" 
              options={{ 
                headerShown: true,
                title: "Investors",
              }} 
            />
            <Stack.Screen 
              name="milestones" 
              options={{ 
                headerShown: true,
                title: "Startup Journey",
              }} 
            />
            <Stack.Screen 
              name="idea-validator" 
              options={{ 
                headerShown: true,
                title: "AI Idea Validator",
              }} 
            />
            <Stack.Screen 
              name="feed/create" 
              options={{ 
                headerShown: true,
                title: "Create Post",
              }} 
            />
            <Stack.Screen 
              name="events/create" 
              options={{ 
                headerShown: true,
                title: "Create Event",
              }} 
            />
            <Stack.Screen 
              name="events/[id]" 
              options={{ 
                headerShown: true,
                title: "Event Details",
              }} 
            />
          </>
        ) : (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
      </Stack>
    </>
  );
}