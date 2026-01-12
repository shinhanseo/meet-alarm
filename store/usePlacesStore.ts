import { create } from "zustand";

type Place = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

type Mode = "origin" | "dest";
type DayOffset = 0 | 1; // 0=오늘, 1=내일

type PlacesState = {
  originPlace: Place | null;
  destPlace: Place | null;

  meetingTime: Date | null;     // 시/분만 의미있게 쓸 거면 그대로 OK
  meetingDayOffset: DayOffset; 

  setPlace: (mode: Mode, place: Place) => void;

  setMeetingTime: (time: Date) => void;
  setMeetingDayOffset: (offset: DayOffset) => void;

  reset: () => void;
};

export const usePlacesStore = create<PlacesState>((set) => ({
  originPlace: null,
  destPlace: null,

  meetingTime: null,
  meetingDayOffset: 0,

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

  setMeetingDayOffset: (offset) =>
    set((state) => ({
      ...state,
      meetingDayOffset: offset,
    })),

  reset: () =>
    set({
      originPlace: null,
      destPlace: null,
      meetingTime: null,
      meetingDayOffset: 0,
    }),
}));
