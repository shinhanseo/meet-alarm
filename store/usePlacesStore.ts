import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";
import { cancelAlarm, scheduleAlarmAt } from "@/src/lib/notifications";

type Place = { name: string; address: string; lat: number; lng: number };
type Mode = "origin" | "dest";

// 기존 타입 정의들 (Segment, RouteItem 등)은 그대로 사용하시면 됩니다.

type PlacesState = {
  originPlace: Place | null;
  destPlace: Place | null;
  meetingDate: string | null;
  meetingTime: string | null;
  selectedRoute: any | null;
  departureAt: string | null;
  isConfirmed: boolean;
  scheduledDepartureNotifId: string | null;
  isScheduling: boolean; // 중복 예약 방지 잠금 플래그

  // 액션들
  confirmMeeting: () => void;
  unconfirm: () => void;
  setScheduledDepartureNotifId: (id: string | null) => void;
  setPlace: (mode: Mode, place: Place) => void;
  setPlaceSilent: (mode: Mode, place: Place) => void;
  setMeetingDate: (date: string | null) => void;
  setMeetingTime: (time: string | null) => void;
  setSelectedRoute: (route: any | null) => void;
  clearSelectedRoute: () => void;
  setDepartureAt: (d: string | null) => void;
  scheduleDepartureAlarm: () => Promise<void>;
  reset: () => void;
};

const todayYMD = () => new Date().toISOString().slice(0, 10);

export const usePlacesStore = create<PlacesState>()(
  persist(
    (set, get) => {
      // 내부 헬퍼: 실제 알람 취소 기능 (상태값 변경은 호출한 곳에서 처리)
      const internalCancel = async () => {
        const { scheduledDepartureNotifId } = get();
        if (scheduledDepartureNotifId) {
          try {
            await cancelAlarm(scheduledDepartureNotifId);
            console.log("기존 예약 취소 : ", scheduledDepartureNotifId);
          } catch (e) {
            console.error("알람 취소 실패:", e);
          }
        }
      };

      return {
        originPlace: null,
        destPlace: null,
        meetingDate: todayYMD(),
        meetingTime: null,
        selectedRoute: null,
        departureAt: null,
        isConfirmed: false,
        scheduledDepartureNotifId: null,
        isScheduling: false,

        confirmMeeting: () => set({ isConfirmed: true }),
        unconfirm: () => set({ isConfirmed: false }),

        setScheduledDepartureNotifId: (id) => set({ scheduledDepartureNotifId: id }),

        // 알람 예약 로직 
        scheduleDepartureAlarm: async () => {
          const { departureAt, scheduledDepartureNotifId, isScheduling } = get();
          if (isScheduling || !departureAt) return;

          const departureDate = new Date(departureAt);
          if (departureDate.getTime() <= Date.now() + 3000) return;

          set({ isScheduling: true });
          try {
            if (scheduledDepartureNotifId) {
              await internalCancel();
            }
            const newId = await scheduleAlarmAt(departureDate, {
              title: "지금 출발!",
              body: "지각하지 않으려면 지금 출발해야 해요!",
            });
            console.log("알람 예약 성공:", newId);
            set({ scheduledDepartureNotifId: newId });
          } catch (error) {
            console.error("알람 예약 오류:", error);
          } finally {
            set({ isScheduling: false });
          }
        },

        setPlace: (mode, place) => {
          internalCancel(); // 장소 바뀌면 기존 알람 취소
          set((state) => ({
            ...state,
            originPlace: mode === "origin" ? place : state.originPlace,
            destPlace: mode === "dest" ? place : state.destPlace,
            selectedRoute: null,
            departureAt: null,
            isConfirmed: false,
            scheduledDepartureNotifId: null,
          }));
        },

        setPlaceSilent: (mode, place) =>
          set((state) => ({
            ...state,
            originPlace: mode === "origin" ? place : state.originPlace,
            destPlace: mode === "dest" ? place : state.destPlace,
          })),

        setMeetingDate: (date) => {
          internalCancel();
          set({
            meetingDate: date,
            selectedRoute: null,
            departureAt: null,
            isConfirmed: false,
            scheduledDepartureNotifId: null,
          });
        },

        setMeetingTime: (time) => {
          internalCancel();
          set({
            meetingTime: time,
            selectedRoute: null,
            departureAt: null,
            isConfirmed: false,
            scheduledDepartureNotifId: null,
          });
        },

        setSelectedRoute: (route) =>
          set({ selectedRoute: route, isConfirmed: false }),

        clearSelectedRoute: () => {
          internalCancel();
          set({
            selectedRoute: null,
            departureAt: null,
            isConfirmed: false,
            scheduledDepartureNotifId: null,
          });
        },

        setDepartureAt: (d) => {
          if (!d) {
            set({ departureAt: null });
            return;
          }
          const date = new Date(d);
          date.setSeconds(0, 0); // 00초 000ms로 고정
          set({ departureAt: date.toISOString() });
        },

        reset: () => {
          internalCancel();
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
      };
    },
    {
      name: "places-store-v4",
      storage: createJSONStorage(() => AsyncStorage),
      // 필요한 데이터만 저장하려면 partialize 유지
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