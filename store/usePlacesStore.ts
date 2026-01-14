import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";

type Place = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

type Mode = "origin" | "dest";
type DayOffset = 0 | 1; // 0=오늘, 1=내일

// 경로 저장에 필요한 타입
type Segment = {
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

type RouteItem = {
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

  meetingTime: string | null;
  meetingDayOffset: DayOffset;

  selectedRoute: RouteItem | null;
   
  departureAt: string | null;

  setPlace: (mode: Mode, place: Place) => void;

  setMeetingTime: (time: string) => void;
  setMeetingDayOffset: (offset: DayOffset) => void;

  setSelectedRoute: (route: RouteItem | null) => void;
  clearSelectedRoute: () => void;

  setDepartureAt: (d: string | null) => void;

  reset: () => void;
};

export const usePlacesStore = create<PlacesState>()(
  persist(
    (set) => ({
      originPlace: null,
      destPlace: null,

      meetingTime: null,
      meetingDayOffset: 0,

      selectedRoute: null,
      departureAt: null,

      setPlace: (mode, place) =>
        set((state) => ({
          ...state,
          originPlace: mode === "origin" ? place : state.originPlace,
          destPlace: mode === "dest" ? place : state.destPlace,
        })),

      setMeetingTime: (time) => set((state) => ({ ...state, meetingTime: time })),
      setMeetingDayOffset: (offset) =>
        set((state) => ({ ...state, meetingDayOffset: offset })),

      setSelectedRoute: (route) =>
        set((state) => ({ ...state, selectedRoute: route })),
      clearSelectedRoute: () => set((state) => ({ ...state, selectedRoute: null })),

      setDepartureAt: (d) => set((state) => ({ ...state, departureAt: d })),

      reset: () =>
        set({
          originPlace: null,
          destPlace: null,
          meetingTime: null,
          meetingDayOffset: 0,
          selectedRoute: null,
          departureAt: null,
        }),
    }),
    {
      name: "places-store-v1", // AsyncStorage key 이름
      storage: createJSONStorage(() => AsyncStorage),

      // 스토어에 있는 변수 모두 asyncStorage에 저장
      partialize: (state) => ({
        originPlace: state.originPlace,
        destPlace: state.destPlace,
        meetingTime: state.meetingTime,
        meetingDayOffset: state.meetingDayOffset,
        selectedRoute: state.selectedRoute,
        departureAt: state.departureAt,
      }),
    }
  )
);