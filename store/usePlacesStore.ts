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
  meetingTime: Date | null;

  setPlace: (mode: Mode, place: Place) => void;
  setMeetingTime: (time: Date) => void;
  reset: () => void;
};

export const usePlacesStore = create<PlacesState>((set) => ({
  originPlace: null,
  destPlace: null,
  meetingTime: null,

  setPlace: (mode, place) =>
    set((state) => ({
      ...state,
      originPlace: mode === "origin" ? place : state.originPlace,
      destPlace: mode === "dest" ? place : state.destPlace,
    })),

  setMeetingTime: (time) =>
    set((state) => ({
      ...state,
      meetingTime: time,
    })),

  reset: () =>
    set({
      originPlace: null,
      destPlace: null,
      meetingTime: null,
    }),
}));
