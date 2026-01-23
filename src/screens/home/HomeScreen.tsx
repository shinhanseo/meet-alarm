import { useEffect, useMemo, useState, useRef } from "react";
import { View, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

import { API_BASE_URL } from "@/src/config/env";
import { usePlacesStore } from "@/store/usePlacesStore";
import { styles } from "./styles";

import HeaderBar from "./components/HeaderBar";
import MeetingSection from "./components/MeetingSection";
import TimerSection from "./components/TimerSection";
import RouteSection from "./components/RouteSection";
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

// 날짜/시간 조합 헬퍼
function buildMeetingAt(meetingDate: string, meetingTimeHHmm: string) {
  const [y, m, d] = meetingDate.split("-").map(Number);
  const [hh, mm] = meetingTimeHHmm.split(":").map(Number);
  if ([y, m, d, hh, mm].some((n) => Number.isNaN(n))) return null;
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

export default function HomeScreen() {
  const router = useRouter();

  const {
    originPlace,
    destPlace,
    meetingDate,
    meetingTime: meetingTimeStr,
    selectedRoute,
    departureAt: departureAtStr,
    setDepartureAt,
    scheduleDepartureAlarm,
    isConfirmed,
    reset,
  } = usePlacesStore();

  const bufferMin = 10;
  const departureAt = departureAtStr ? new Date(departureAtStr) : null;

  // 1. 실제 약속 시간 계산
  const meetingAt = useMemo(() => {
    if (!meetingDate || !meetingTimeStr) return null;
    return buildMeetingAt(meetingDate, meetingTimeStr);
  }, [meetingDate, meetingTimeStr]);

  // ---------------------------------------------------------
  // 2. 알람 예약 로직 (중복 방지 강화)
  // ---------------------------------------------------------
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    // 확정 상태가 아니거나 시간이 없으면 예약하지 않음
    if (!departureAtStr || !isConfirmed) {
      lastKeyRef.current = null;
      return;
    }

    // 동일한 시간(정규화됨)이면 중복 호출 차단
    if (lastKeyRef.current === departureAtStr) return;

    lastKeyRef.current = departureAtStr;
    console.log("알람 예약 실행:", departureAtStr);
    scheduleDepartureAlarm();
  }, [departureAtStr, isConfirmed, scheduleDepartureAlarm]);

  // ---------------------------------------------------------
  // 3. 날씨 로직 (단순화: 앱 진입 시 또는 목적지 변경 시 실행)
  // ---------------------------------------------------------
  const [destWeather, setDestWeather] = useState<WeatherDto | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestWeather = async () => {
      if (!destPlace) {
        setDestWeather(null);
        return;
      }
      try {
        setWeatherLoading(true);
        setWeatherError(null);
        const res = await axios.get(`${API_BASE_URL}/api/weather`, {
          params: { lat: destPlace.lat, lon: destPlace.lng },
          timeout: 8000,
        });
        setDestWeather(res.data.weather);
      } catch (e) {
        setWeatherError("날씨 정보를 불러오지 못했어요.");
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchDestWeather();
  }, [destPlace]); // 목적지가 바뀔 때만 새로 호출

  // ---------------------------------------------------------
  // 4. 출발 시각 계산 및 스토어 업데이트 (00초 정규화)
  // ---------------------------------------------------------
  const departAtMs = useMemo(() => {
    if (!selectedRoute || !meetingAt) return null;
    const meetingMs = meetingAt.getTime();
    const travelMs = selectedRoute.summary.totalTimeMin * 60 * 1000;
    const bufferMs = bufferMin * 60 * 1000;
    return meetingMs - travelMs - bufferMs;
  }, [selectedRoute, meetingAt, bufferMin]);

  useEffect(() => {
    if (!departAtMs) {
      if (departureAtStr !== null) setDepartureAt(null);
      return;
    }

    const d = new Date(departAtMs);
    d.setSeconds(0, 0); // 00초 정규화로 미세한 오차 방지
    const nextISO = d.toISOString();

    if (departureAtStr !== nextISO) {
      setDepartureAt(nextISO);
    }
  }, [departAtMs, departureAtStr, setDepartureAt]);

  // ---------------------------------------------------------
  // 5. 타이머 및 자동 리셋
  // ---------------------------------------------------------
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    const base = departureAt?.getTime();
    if (!base) { setSeconds(0); return; }

    const update = () => {
      const diff = Math.max(0, Math.floor((base - Date.now()) / 1000));
      setSeconds(diff);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [departureAt]);

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
      hour12: false
    });
  }, [departureAt]);

  const didAutoResetRef = useRef(false);
  useEffect(() => {
    if (!meetingAt) { didAutoResetRef.current = false; return; }

    const checkAndReset = () => {
      if (didAutoResetRef.current) return;
      if (meetingAt.getTime() <= Date.now()) {
        didAutoResetRef.current = true;
        Alert.alert("약속 시간이 지났어요", "이전 약속을 초기화할게요.", [
          { text: "확인", onPress: () => reset() }
        ]);
      }
    };

    checkAndReset();
    const id = setInterval(checkAndReset, 30_000);
    return () => clearInterval(id);
  }, [meetingAt, reset]);

  const directionSearch = () => {
    if (!originPlace || !destPlace || !meetingDate || !meetingTimeStr) {
      Alert.alert("입력이 필요해요", "필수 정보를 먼저 설정해주세요.");
      return;
    }
    router.push({ pathname: "/direction-search" });
  };

  const readyToShowResult = !!(originPlace && destPlace && meetingDate && meetingTimeStr && selectedRoute && departAtMs);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HeaderBar onPressReset={reset} />

        <MeetingSection
          originPlace={originPlace}
          destPlace={destPlace}
          meetingDate={meetingDate}
          meetingTime={meetingTimeStr}
          selectedRoute={selectedRoute}
          isConfirmed={isConfirmed}
          onPressCreate={() => router.push("/create-meeting")}
          onPressEdit={() => router.push("/create-meeting")}
          onPressSearchRoute={directionSearch}
        />

        <TimerSection
          readyToShowResult={readyToShowResult}
          departureAtISO={departureAtStr}
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

        <RouteSection
          selectedRoute={selectedRoute}
          onPressChangeRoute={directionSearch}
          isConfirmed={isConfirmed}
        />
        <View style={{ height: 12 }} />
      </ScrollView>
    </View>
  );
}