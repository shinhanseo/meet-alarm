import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Application from "expo-application";

export function getInstallMeta() {
  const platform = Platform.OS; // 'ios' | 'android'
  const osVersion = String(Platform.Version);

  const deviceModel =
    Device.modelName ?? Device.modelId ?? Device.deviceName ?? null;

  return { platform, osVersion, deviceModel };
}
