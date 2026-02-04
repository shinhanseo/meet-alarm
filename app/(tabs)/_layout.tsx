import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { initNotifications } from "@/src/lib/notifications";

export default function TabLayout() {
  const router = useRouter();

  useEffect(() => {
    // 알림 권한 요청 + Android 채널 설정
    (async () => {
      try {
        await initNotifications();
      } catch (e) {
        console.warn("알람 권한 요청 실패:", e);
      }
    })();

    // 알림 클릭했을 때 화면으로 이동
    const sub = Notifications.addNotificationResponseReceivedListener(
      (res) => {
        const data = res.notification.request.content.data as any;
        if (data?.type === "ALARM") {
          router.push("/");
        }
      }
    );

    return () => sub.remove();
  }, [router]);

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: "#ffffff",
      },
      tabBarActiveTintColor: "#F97316",   // 활성 아이콘 색
      tabBarInactiveTintColor: "#9CA3AF", // 비활성 아이콘 색
    }}>
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
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size ?? 28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="appointments-list"
        options={{
          title: "약속 목록",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size ?? 28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
