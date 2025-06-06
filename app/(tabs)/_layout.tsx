import React from "react";
import { Tabs } from "expo-router";
import { Home, Users, FileText, User, MessageSquare, Calendar, TrendingUp, Lightbulb, Briefcase } from "lucide-react-native";
import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          borderTopColor: Colors.border,
        },
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="match"
        options={{
          title: "Find Co-Founders",
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
          tabBarLabel: "Match",
        }}
      />
      <Tabs.Screen
        name="toolkit"
        options={{
          title: "Startup Toolkit",
          tabBarIcon: ({ color }) => <Briefcase size={24} color={color} />,
          tabBarLabel: "Toolkit",
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "Founder Feed",
          tabBarIcon: ({ color }) => <TrendingUp size={24} color={color} />,
          tabBarLabel: "Feed",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
          tabBarLabel: "Profile",
        }}
      />
    </Tabs>
  );
}