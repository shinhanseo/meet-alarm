import { create } from "zustand";

type NetworkState = {
  offline: boolean;
  type: string;
  setStatus: (offline: boolean, type: string) => void;
};

export const useNetworkStore = create<NetworkState>((set) => ({
  offline: false,
  type: "unknown",
  setStatus: (offline, type) => set({ offline, type }),
}));