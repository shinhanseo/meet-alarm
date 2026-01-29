import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useEffect } from "react";
import axios from "axios";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { API_BASE_URL } from "@/src/config/env";
import { getOrCreateInstallId } from "@/src/lib/installId";
import { getInstallMeta } from "@/src/lib/installMeta";

async function pingInstallOnce() {
  const installId = await getOrCreateInstallId();
  const meta = getInstallMeta();

  await axios.post(`${API_BASE_URL}/api/save/install`, {
    installId,
    platform: meta.platform,
    osVersion: meta.osVersion,
    deviceModel: meta.deviceModel,
  });
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    pingInstallOnce().catch((e) => {
      const status = e?.response?.status;
      const data = e?.response?.data;
      console.log("[install ping failed]", status ?? "", data ?? e?.message ?? e);
    });
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
