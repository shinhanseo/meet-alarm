// src/lib/installId.ts
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";

const INSTALL_ID_KEY = "INSTALL_ID";

export async function getOrCreateInstallId(): Promise<string> {
  const existing = await SecureStore.getItemAsync(INSTALL_ID_KEY);
  if (existing) {
    return existing;
  }

  const newId = Crypto.randomUUID();

  await SecureStore.setItemAsync(INSTALL_ID_KEY, newId);

  return newId;
}
