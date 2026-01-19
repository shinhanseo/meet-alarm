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
  meetingTime: string | null; // "HH:mm"

  selectedRoute: RouteItem | null;
  departureAt: string | null; // ISO

  isConfirmed: boolean;
  confirmMeeting: () => void;
  unconfirm: () => void;

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

const todayYMD = () => new Date().toISOString().slice(0, 10);

export const usePlacesStore = create<PlacesState>()(
  persist(
    (set, get) => ({
      originPlace: null,
      destPlace: null,

      meetingDate: todayYMD(),
      meetingTime: null,

      selectedRoute: null,
      departureAt: null,

      isConfirmed: false,
      confirmMeeting: () => set((s) => ({ ...s, isConfirmed: true })),
      unconfirm: () => set((s) => ({ ...s, isConfirmed: false })),

      scheduledDepartureNotifId: null,
      setScheduledDepartureNotifId: (id) =>
        set((s) => ({ ...s, scheduledDepartureNotifId: id })),

      setPlace: (mode, place) =>
        set((state) => ({
          ...state,
          originPlace: mode === "origin" ? place : state.originPlace,
          destPlace: mode === "dest" ? place : state.destPlace,

          selectedRoute: null,
          meetingTime : null,
          departureAt: null,
          isConfirmed: false,
          scheduledDepartureNotifId: null,
        })),

      setMeetingDate: (date) =>
        set((state) => ({
          ...state,
          meetingDate: date,
          selectedRoute: null,
          departureAt: null,
          isConfirmed: false,
          scheduledDepartureNotifId: null,
        })),

      setMeetingTime: (time) =>
        set((state) => ({
          ...state,
          meetingTime: time,
          selectedRoute: null,
          departureAt: null,
          isConfirmed: false,
          scheduledDepartureNotifId: null,
        })),

      setSelectedRoute: (route) =>
        set((state) => ({
          ...state,
          selectedRoute: route,
          // 경로 바꾸면 확정은 풀고 “저장” 다시 누르게 하는 게 완성도 좋음
          isConfirmed: false,
        })),

      clearSelectedRoute: () =>
        set((state) => ({
          ...state,
          selectedRoute: null,
          departureAt: null,
          isConfirmed: false,
          scheduledDepartureNotifId: null,
        })),

      setDepartureAt: (d) => set((state) => ({ ...state, departureAt: d })),

      reset: () => {
        const { scheduledDepartureNotifId } = get();
        if (scheduledDepartureNotifId) {
          cancelAlarm(scheduledDepartureNotifId).catch((e) =>
            console.error("cancelAlarm failed", e)
          );
        }

        set({
          originPlace: null,
          destPlace: null,
          meetingDate: todayYMD(),
          meetingTime: null,
          selectedRoute: null,
          departureAt: null,
          isConfirmed: false,
          scheduledDepartureNotifId: null,
        });
      },
    }),
    {
      name: "places-store-v3",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        originPlace: state.originPlace,
        destPlace: state.destPlace,
        meetingDate: state.meetingDate,
        meetingTime: state.meetingTime,
        selectedRoute: state.selectedRoute,
        departureAt: state.departureAt,
        isConfirmed: state.isConfirmed,
        scheduledDepartureNotifId: state.scheduledDepartureNotifId,
      }),
    }
  )
);
