import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";
import { cancelAlarm, scheduleAlarmAt } from "@/src/lib/notifications";
import { calculateDepartureAt } from "@/src/utils/calculateDepartureAt";

type Place = { name: string; address: string; lat: number; lng: number };
type Mode = "origin" | "dest";

type UpdatePayload = {
  originPlace: Place | null;
  destPlace: Place | null;
  meetingDate: string | null;
  meetingTime: string | null;
  selectedRoute: any | null;
  meetingTitle: string;
};

export type Appointment = {
  id: string;
  dbId: number | null;
  originPlace: Place | null;
  destPlace: Place | null;
  meetingDate: string | null; // YYYY-MM-DD
  meetingTime: string | null; // HH:mm
  selectedRoute: any | null;
  isConfirmed: boolean;
  scheduledDepartureNotifId: string[];
  meetingTitle: string;
  isCameraVerified: boolean;
};

export type AppointmentDraft = {
  dbId: number | null;
  originPlace: Place | null;
  destPlace: Place | null;
  meetingDate: string | null;
  meetingTime: string | null;
  selectedRoute: any | null;
  meetingTitle: string;
};

type PlacesState = {
  appointments: Appointment[];
  draft: AppointmentDraft | null;
  isScheduling: boolean;

  myHouse: Place | null;
  setMyHouse: (place: Place | null) => void;

  startDraft: () => void;
  resetDraft: () => void;

  setDraftPlace: (mode: Mode, place: Place) => void;
  setDraftPlaceSilent: (mode: Mode, place: Place) => void;
  setDraftMeetingDate: (date: string | null) => void;
  setDraftMeetingTime: (time: string | null) => void;
  setDraftSelectedRoute: (route: any | null) => void;
  clearDraftSelectedRoute: () => void;
  setDraftMeetingTitle: (title: string) => void;

  saveDraft: () => string | null;

  scheduleDepartureAlarm: (id: string) => Promise<void>;
  cancelDepartureAlarm: (id: string) => Promise<void>;

  loadDraftFromAppointment: (id: string) => void;
  updateAppointment: (id: string, data: UpdatePayload) => Promise<string>;

  deleteAppointment: (id: string) => Promise<void>;

  setDbId: (localId: string, dbId: number) => void;

  setCameraVerified: (id: string, verified: boolean) => void;

  resetAll: () => Promise<void>;
};

const todayYMD = () => new Date().toISOString().slice(0, 10);

const makeNewId = () => {
  // @ts-ignore
  if (typeof crypto !== "undefined" && crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const emptyDraft = (): AppointmentDraft => ({
  dbId: null,
  originPlace: null,
  destPlace: null,
  meetingDate: todayYMD(),
  meetingTime: null,
  selectedRoute: null,
  meetingTitle: "",
});

export const usePlacesStore = create<PlacesState>()(
  persist(
    (set, get) => {
      const internalCancelAll = async (id: string) => {
        const app = get().appointments.find((a) => a.id === id);

        const raw = app?.scheduledDepartureNotifId;

        const ids: string[] = Array.isArray(raw) ? raw : raw ? [raw] : [];

        if (ids.length === 0) return;

        await Promise.all(
          ids.map(async (nid) => {
            try {
              await cancelAlarm(nid);
            } catch { }
          })
        );
      };

      return {
        appointments: [],
        draft: null,
        isScheduling: false,

        myHouse: null,
        setMyHouse: (place) =>
          set({
            myHouse: place ? { ...place, name: "우리집" } : null,
          }),

        startDraft: () => set({ draft: emptyDraft() }),
        resetDraft: () => set({ draft: null }),

        setDraftPlace: (mode, place) =>
          set((s) => {
            if (!s.draft) return s;
            return {
              draft: {
                ...s.draft,
                originPlace: mode === "origin" ? place : s.draft.originPlace,
                destPlace: mode === "dest" ? place : s.draft.destPlace,
                selectedRoute: null,
              },
            };
          }),

        setDraftPlaceSilent: (mode, place) =>
          set((s) => {
            if (!s.draft) return s;
            return {
              draft: {
                ...s.draft,
                originPlace: mode === "origin" ? place : s.draft.originPlace,
                destPlace: mode === "dest" ? place : s.draft.destPlace,
              },
            };
          }),

        setDraftMeetingDate: (date) =>
          set((s) => {
            if (!s.draft) return s;
            return {
              draft: {
                ...s.draft,
                meetingDate: date,
                selectedRoute: null,
              },
            };
          }),

        setDraftMeetingTime: (time) =>
          set((s) => {
            if (!s.draft) return s;
            return {
              draft: {
                ...s.draft,
                meetingTime: time,
                selectedRoute: null,
              },
            };
          }),

        setDraftSelectedRoute: (route) =>
          set((s) => {
            if (!s.draft) return s;
            return { draft: { ...s.draft, selectedRoute: route } };
          }),

        clearDraftSelectedRoute: () =>
          set((s) => {
            if (!s.draft) return s;
            return { draft: { ...s.draft, selectedRoute: null } };
          }),

        setDraftMeetingTitle: (title) =>
          set((s) => {
            if (!s.draft) return s;
            return { draft: { ...s.draft, meetingTitle: title } };
          }),

        saveDraft: () => {
          const { draft } = get();
          if (!draft) return null;

          const id = makeNewId();

          const app: Appointment = {
            id,
            dbId: null,
            originPlace: draft.originPlace,
            destPlace: draft.destPlace,
            meetingDate: draft.meetingDate,
            meetingTime: draft.meetingTime,
            selectedRoute: draft.selectedRoute,
            isConfirmed: true,
            scheduledDepartureNotifId: [],
            meetingTitle: draft.meetingTitle.trim(),
            isCameraVerified: false,
          };

          set((s) => ({
            appointments: [...s.appointments, app],
            draft: null,
          }));

          return id;
        },

        // 출발 알림 + 출발 10분 전 알림 (2개 예약)
        scheduleDepartureAlarm: async (id) => {
          const { appointments, isScheduling } = get();
          const app = appointments.find((a) => a.id === id);
          if (!app || !app.destPlace || isScheduling) return;

          const departureAt = calculateDepartureAt(
            app.meetingDate,
            app.meetingTime,
            app.selectedRoute,
            10
          );

          if (!departureAt || departureAt.getTime() <= Date.now()) return;

          const tenMinBefore = new Date(departureAt.getTime() - 10 * 60 * 1000);

          set({ isScheduling: true });
          try {
            await internalCancelAll(id);

            const newIds: string[] = [];

            // (1) 출발 10분 전 알림 (과거면 스킵)
            if (tenMinBefore.getTime() > Date.now()) {
              const nid = await scheduleAlarmAt(tenMinBefore, {
                title: "10분 뒤 출발 준비!",
                body: `${app.destPlace.name} 가려면 10분 뒤에 출발해야되요!`,
              });
              newIds.push(nid);
            }

            // (2) 출발 알림
            const timeText = departureAt.toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });

            const nid2 = await scheduleAlarmAt(departureAt, {
              title: "지금 출발!",
              body: `${app.destPlace.name}에 늦지 않으려면 지금 출발해야 해요! (${timeText})`,
            });
            newIds.push(nid2);

            set((s) => ({
              appointments: s.appointments.map((a) =>
                a.id === id ? { ...a, scheduledDepartureNotifId: newIds } : a
              ),
            }));
          } finally {
            set({ isScheduling: false });
          }
        },

        cancelDepartureAlarm: async (id) => {
          await internalCancelAll(id);
          set((s) => ({
            appointments: s.appointments.map((a) =>
              a.id === id ? { ...a, scheduledDepartureNotifId: [] } : a
            ),
          }));
        },

        setCameraVerified: (id, verified) =>
          set((s) => ({
            appointments: s.appointments.map((a) =>
              a.id === id ? { ...a, isCameraVerified: verified } : a
            ),
          })),

        resetAll: async () => {
          const apps = get().appointments;
          await Promise.all(
            apps.flatMap((a) =>
              (a.scheduledDepartureNotifId ?? []).map(async (nid) => {
                try {
                  await cancelAlarm(nid);
                } catch { }
              })
            )
          );

          set({ appointments: [], draft: null });
        },

        loadDraftFromAppointment: (id) =>
          set((s) => {
            const app = s.appointments.find((a) => a.id === id);
            if (!app) return s;

            return {
              draft: {
                dbId: app.dbId,
                originPlace: app.originPlace,
                destPlace: app.destPlace,
                meetingDate: app.meetingDate,
                meetingTime: app.meetingTime,
                selectedRoute: app.selectedRoute,
                meetingTitle: app.meetingTitle ?? "",
              },
            };
          }),

        setDbId: (localId, dbId) =>
          set((s) => ({
            appointments: s.appointments.map((a) =>
              a.id === localId ? { ...a, dbId } : a
            ),
          })),

        updateAppointment: async (id, data) => {
          await internalCancelAll(id);

          set((s) => ({
            appointments: s.appointments.map((a) =>
              a.id === id
                ? {
                  ...a,
                  originPlace: data.originPlace,
                  destPlace: data.destPlace,
                  meetingDate: data.meetingDate,
                  meetingTime: data.meetingTime,
                  selectedRoute: data.selectedRoute,
                  meetingTitle: data.meetingTitle.trim(),
                  scheduledDepartureNotifId: [], // 
                  isConfirmed: true,
                  isCameraVerified: false,
                }
                : a
            ),
          }));

          get().resetDraft();
          return id;
        },

        deleteAppointment: async (id) => {
          await internalCancelAll(id);
          set((s) => ({
            appointments: s.appointments.filter((a) => a.id !== id),
          }));
        },
      };
    },
    {
      name: "places-store-v7",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        appointments: s.appointments,
        draft: s.draft,
        myHouse: s.myHouse,
      }),
    }
  )
);
