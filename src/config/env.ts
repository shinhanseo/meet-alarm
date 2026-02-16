import Constants from "expo-constants";

type ExpoConfigExtra = {
  API_BASE_URL?: string;
};

const DEFAULT_API_BASE_URL = "http://3.26.43.127:4000";

export const API_BASE_URL =
  (Constants.expoConfig?.extra as ExpoConfigExtra | undefined)?.API_BASE_URL ?? DEFAULT_API_BASE_URL;
