import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size ?? 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create-meeting"
        options={{
          title: "약속 만들기",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size ?? 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "설정",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size ?? 28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
