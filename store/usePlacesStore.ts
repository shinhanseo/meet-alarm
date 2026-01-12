import { create } from "zustand";

type Place = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

type Mode = "origin" | "dest";
type DayOffset = 0 | 1; // 0=오늘, 1=내일

// 경로 저장에 필요한 타입
export type Segment = {
  type: "WALK" | "BUS" | "SUBWAY" | string;
  timeMin: number;
  timeText: string;
  from?: string;
  to?: string;
  distanceM: number;
  route?: string;
  line?: string;
  stops?: number;
  color?: string;
};

export type RouteItem = {
  summary: {
    totalTimeMin: number;
    totalTimeText: string;
    totalWalkTimeMin: number;
    totalWalkTimeText: string;
    totalFare: number;
    transferCount: number;
  };
  segments: Segment[];
};

type PlacesState = {
  originPlace: Place | null;
  destPlace: Place | null;

  meetingTime: Date | null;
  meetingDayOffset: DayOffset;

  selectedRoute: RouteItem | null;

  setPlace: (mode: Mode, place: Place) => void;

  setMeetingTime: (time: Date) => void;
  setMeetingDayOffset: (offset: DayOffset) => void;

  setSelectedRoute: (route: RouteItem | null) => void;
  clearSelectedRoute: () => void;

  reset: () => void;
};

export const usePlacesStore = create<PlacesState>((set) => ({
  originPlace: null,
  destPlace: null,

  meetingTime: null,
  meetingDayOffset: 0,

  selectedRoute: null,

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

  setSelectedRoute: (route) =>
    set((state) => ({
      ...state,
      selectedRoute: route,
    })),

  clearSelectedRoute: () =>
    set((state) => ({
      ...state,
      selectedRoute: null,
    })),

  reset: () =>
    set({
      originPlace: null,
      destPlace: null,
      meetingTime: null,
      meetingDayOffset: 0,
    }),
}));
