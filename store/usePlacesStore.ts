import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";

import { cancelAlarm } from "@/src/lib/notifications";

type Place = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

type Mode = "origin" | "dest";

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

  meetingDate: string | null; // "YYYY-MM-DD"
  meetingTime: string | null; // 예: "19:30"

  selectedRoute: RouteItem | null;
  departureAt: string | null;

  scheduledDepartureNotifId: string | null;
  setScheduledDepartureNotifId: (id: string | null) => void;

  setPlace: (mode: Mode, place: Place) => void;

  setMeetingDate: (date: string | null) => void;
  setMeetingTime: (time: string | null) => void;

  setSelectedRoute: (route: RouteItem | null) => void;
  clearSelectedRoute: () => void;

  setDepartureAt: (d: string | null) => void;

  reset: () => void;
};

export const usePlacesStore = create<PlacesState>()(
  persist(
    (set, get) => ({
      originPlace: null,
      destPlace: null,

      meetingDate: new Date().toISOString().slice(0, 10),
      meetingTime: null,

      selectedRoute: null,
      departureAt: null,

      scheduledDepartureNotifId: null,
      setScheduledDepartureNotifId: (id) =>
        set((state) => ({ ...state, scheduledDepartureNotifId: id })),

      setPlace: (mode, place) =>
        set((state) => ({
          ...state,
          originPlace: mode === "origin" ? place : state.originPlace,
          destPlace: mode === "dest" ? place : state.destPlace,
        })),

      setMeetingDate: (date) => set((state) => ({ ...state, meetingDate: date })),
      setMeetingTime: (time) => set((state) => ({ ...state, meetingTime: time })),

      setSelectedRoute: (route) => set((state) => ({ ...state, selectedRoute: route })),
      clearSelectedRoute: () => set((state) => ({ ...state, selectedRoute: null })),

      setDepartureAt: (d) => set((state) => ({ ...state, departureAt: d })),

      reset: () => {
        const { scheduledDepartureNotifId } = get();

        if (scheduledDepartureNotifId) {
          cancelAlarm(scheduledDepartureNotifId).catch((e) =>
            console.error("cancelScheduledAlarm failed", e)
          );
        }

        set({
          originPlace: null,
          destPlace: null,
          meetingDate: new Date().toISOString().slice(0, 10),
          meetingTime: null,
          selectedRoute: null,
          departureAt: null,
          scheduledDepartureNotifId: null, 
        });
      },
    }),
    {
      name: "places-store-v2",
      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        originPlace: state.originPlace,
        destPlace: state.destPlace,
        meetingDate: state.meetingDate,
        meetingTime: state.meetingTime,
        selectedRoute: state.selectedRoute,
        departureAt: state.departureAt,
        scheduledDepartureNotifId: state.scheduledDepartureNotifId,
      }),
    }
  )
);
