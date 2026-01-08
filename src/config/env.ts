import Constants from "expo-constants";

export const API_BASE_URL =
  (Constants.expoConfig?.extra as any)?.API_BASE_URL ?? "http://192.168.0.30:4000";
