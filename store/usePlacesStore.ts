import { create } from "zustand";

type Place = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

type Mode = "origin" | "dest";

type PlacesState = {
  originPlace: Place | null;
  destPlace: Place | null;
  setPlace: (mode: Mode, place: Place) => void;
  reset: () => void;
};

export const usePlacesStore = create<PlacesState>((set) => ({
  originPlace: null,
  destPlace: null,
  setPlace: (mode, place) =>
    set((state) => ({
      ...state,
      originPlace: mode === "origin" ? place : state.originPlace,
      destPlace: mode === "dest" ? place : state.destPlace,
    })),
  reset: () =>
    set({
      originPlace: null,
      destPlace: null,
    }),
}));


