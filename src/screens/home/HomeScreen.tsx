import { useEffect, useMemo, useState } from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

import { API_BASE_URL } from "@/src/config/env";
import { usePlacesStore } from "@/store/usePlacesStore";
import { calculateDepartureAt } from "@/src/utils/calculateDepartureAt";
import { styles } from "./styles";

import HeaderBar from "./components/HeaderBar";
import MeetingSection from "./components/MeetingSection";
import TimerSection from "./components/TimerSection";
import HomeRouteSection from "./components/HomeRouteSection";
import WeatherSection from "./components/WeatherSection";

type WeatherDto = {
  name: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  main: string;
  description: string;
  icon: string;
  dt: number;
};

function buildMeetingAt(meetingDate: string, meetingTimeHHmm: string) {
  if (!meetingDate || !meetingTimeHHmm) return null;
  const [y, m, d] = meetingDate.split("-").map(Number);
  const [hh, mm] = meetingTimeHHmm.split(":").map(Number);
  if ([y, m, d, hh, mm].some((n) => Number.isNaN(n))) return null;
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

function pickNearestFuture(appointments: any[] = []) {
  const now = Date.now();

  const future = (appointments ?? [])
    .map((a) => {
      const meetingAt = a.meetingDate && a.meetingTime ? buildMeetingAt(a.meetingDate, a.meetingTime) : null;
      const ms = meetingAt ? meetingAt.getTime() : null;
      return { app: a, meetingAt, ms };
    })
    .filter((x) => x.ms != null && (x.ms as number) > now)
    .sort((a, b) => (a.ms as number) - (b.ms as number));

  return future[0] ?? null;
}

export default function HomeScreen() {
  const router = useRouter();
  const { appointments, deleteAppointment } = usePlacesStore();

  const bufferMin = 10;

  // 1) 가장 가까운 "미래" 약속 1개만 뽑기
  const nearest = useMemo(() => {
    const apps = Array.isArray(appointments) ? appointments : [];
    return pickNearestFuture(apps);
  }, [appointments]);

  const app = nearest?.app ?? null;
  const meetingAt = nearest?.meetingAt ?? null;

  const originPlace = app?.originPlace ?? null;
  const destPlace = app?.destPlace ?? null;
  const meetingDate = app?.meetingDate ?? null;
  const meetingTimeStr = app?.meetingTime ?? null;
  const selectedRoute = app?.selectedRoute ?? null;
  const isConfirmed = app?.isConfirmed ?? false;

  // 2) departureAt은 유틸 함수로 계산
  const departureAt = useMemo(() => {
    return calculateDepartureAt(meetingDate, meetingTimeStr, selectedRoute, bufferMin);
  }, [meetingDate, meetingTimeStr, selectedRoute, bufferMin]);

  // 3) 타이머
  const [seconds, setSeconds] = useState<number>(0);
  useEffect(() => {
    const base = departureAt?.getTime();
    if (!base) {
      setSeconds(0);
      return;
    }

    const update = () => {
      const diff = Math.max(0, Math.floor((base - Date.now()) / 1000));
      setSeconds(diff);
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [departureAt?.getTime()]);

  const timerText = useMemo(() => {
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds % 3600) / 60);
    const ss = seconds % 60;
    const two = (n: number) => n.toString().padStart(2, "0");
    if (hh < 24) return `${two(hh)}:${two(mm)}:${two(ss)}`;
    return `${Math.floor(hh / 24)}일 ${two(hh % 24)}:${two(mm)}:${two(ss)}`;
  }, [seconds]);

  const departTimeText = useMemo(() => {
    if (!departureAt) return "";
    return departureAt.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }, [departureAt?.getTime()]);

  const readyToShowResult = !!(
    app &&
    originPlace &&
    destPlace &&
    meetingDate &&
    meetingTimeStr &&
    selectedRoute &&
    meetingAt &&
    departureAt
  );

  // 4) 날씨 (destPlace 바뀔 때만 호출)
  const [destWeather, setDestWeather] = useState<WeatherDto | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchDestWeather = async () => {
      if (!destPlace) {
        setDestWeather(null);
        setWeatherError(null);
        setWeatherLoading(false);
        return;
      }

      try {
        setWeatherLoading(true);
        setWeatherError(null);

        const res = await axios.get(`${API_BASE_URL}/api/weather`, {
          params: { lat: destPlace.lat, lon: destPlace.lng },
          timeout: 8000,
        });

        if (cancelled) return;
        setDestWeather(res.data.weather ?? null);
      } catch (e) {
        if (cancelled) return;
        setWeatherError("날씨 정보를 불러오지 못했어요.");
      } finally {
        if (cancelled) return;
        setWeatherLoading(false);
      }
    };

    fetchDestWeather();
    return () => {
      cancelled = true;
    };
  }, [destPlace?.lat, destPlace?.lng]);

  // 5) 약속 없음 화면
  if (!app) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <HeaderBar onPressReset={() => { }} />

          <MeetingSection
            originPlace={null}
            destPlace={null}
            meetingDate={null}
            meetingTime={null}
            selectedRoute={null}
            isConfirmed={false}
            onPressCreate={() => router.push("/create-meeting")}
            onPressEdit={() => router.push("/create-meeting")}
            onPressSearchRoute={() => router.push("/create-meeting")}
          />
        </ScrollView>
      </View>
    );
  }

  // 6) 약속 있는 화면 (읽기 전용)
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HeaderBar onPressReset={() => {
          if (app?.id) {
            deleteAppointment(app.id);
          }
        }} />

        <MeetingSection
          originPlace={originPlace}
          destPlace={destPlace}
          meetingDate={meetingDate}
          meetingTime={meetingTimeStr}
          selectedRoute={selectedRoute}
          isConfirmed={isConfirmed}
          onPressCreate={() => router.push("/create-meeting")}
          onPressEdit={() => router.push("/create-meeting")}
          onPressSearchRoute={() => {
            router.push("/create-meeting");
          }}
        />

        <TimerSection
          readyToShowResult={readyToShowResult}
          departureAtISO={departureAt ? departureAt.toISOString() : null}
          departTimeText={departTimeText}
          seconds={seconds}
          timerText={timerText}
          isConfirmed={isConfirmed}
        />

        <WeatherSection
          destPlaceName={destPlace?.name ?? null}
          loading={weatherLoading}
          error={weatherError}
          weather={destWeather}
          isConfirmed={isConfirmed}
        />

        <HomeRouteSection
          selectedRoute={selectedRoute}
          isConfirmed={isConfirmed}
        />

        <View style={{ height: 12 }} />
      </ScrollView>
    </View>
  );
}