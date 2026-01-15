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

// "YYYY-MM-DD" + "HH:mm" => Date
function buildMeetingAt(meetingDate: string, meetingTimeHHmm: string) {
  const [y, m, d] = meetingDate.split("-").map(Number);
  const [hh, mm] = meetingTimeHHmm.split(":").map(Number);

  // 방어: 파싱 실패 시 Invalid Date 방지
  if ([y, m, d, hh, mm].some((n) => Number.isNaN(n))) return null;

  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

export default function HomeScreen() {
  const router = useRouter();

  const {
    originPlace,
    destPlace,

    meetingDate, // string | null
    meetingTime: meetingTimeStr, // string | null ("HH:mm")

    selectedRoute,

    departureAt: departureAtStr, // string | null (ISO)
    setDepartureAt,

    reset,
  } = usePlacesStore();

  const bufferMin = 10;

  const departureAt = departureAtStr ? new Date(departureAtStr) : null;

  // 실제 약속 시간(Date)
  const meetingAt = useMemo(() => {
    if (!meetingDate || !meetingTimeStr) return null;
    return buildMeetingAt(meetingDate, meetingTimeStr);
  }, [meetingDate, meetingTimeStr]);

  // 목적지 날씨 상태
  const [destWeather, setDestWeather] = useState<WeatherDto | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [weatherRefreshKey, setWeatherRefreshKey] = useState(0); // 30분, 2시간 이내 갱신용

  const weatherInFlightRef = useRef(false);
  const lastWeatherBumpAtRef = useRef(0);
  const weatherTickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const bumpWeatherRefreshKey = () => {
    const now = Date.now();
    // 30초 이내 연속 갱신 방지 (원하면 60_000으로)
    if (now - lastWeatherBumpAtRef.current < 30_000) return;
    lastWeatherBumpAtRef.current = now;
    setWeatherRefreshKey((k) => k + 1);
  };

  // 목적지 현재 날씨 가져오기 (destPlace 바뀔 때 + refreshKey 바뀔 때)
  useEffect(() => {
    const fetchDestWeather = async () => {
      if (!destPlace) {
        setDestWeather(null);
        setWeatherError(null);
        return;
      }

      // 이미 요청 중이면 추가 요청 막기
      if (weatherInFlightRef.current) return;
      weatherInFlightRef.current = true;

      try {
        setWeatherLoading(true);
        setWeatherError(null);

        const res = await axios.get(`${API_BASE_URL}/api/weather`, {
          params: { lat: destPlace.lat, lon: destPlace.lng },
          timeout: 8000,
        });

        setDestWeather(res.data.weather);
      } catch (e: any) {
        console.error(e);
        setDestWeather(null);
        setWeatherError("날씨 정보를 불러오지 못했어요.");
      } finally {
        weatherInFlightRef.current = false;
        setWeatherLoading(false);
      }
    };

    fetchDestWeather();
  }, [destPlace, weatherRefreshKey]);

  const didRefresh2hRef = useRef(false);
  const didRefresh30mRef = useRef(false);

  useEffect(() => {
    if (!destPlace) return;
    if (!departureAt) return;

    // departureAt 또는 destPlace가 바뀌면 플래그 리셋
    didRefresh2hRef.current = false;
    didRefresh30mRef.current = false;

    // interval 중복 방지
    if (weatherTickIntervalRef.current) {
      clearInterval(weatherTickIntervalRef.current);
      weatherTickIntervalRef.current = null;
    }

    const tick = () => {
      const now = Date.now();
      const diffMs = departureAt.getTime() - now;
      const diffMin = Math.floor(diffMs / 60000);

      if (diffMs <= 0) return;

      if (diffMin <= 120 && !didRefresh2hRef.current) {
        didRefresh2hRef.current = true;
        bumpWeatherRefreshKey(); // setWeatherRefreshKey 대신(쿨다운 적용)
      }

      if (diffMin <= 30 && !didRefresh30mRef.current) {
        didRefresh30mRef.current = true;
        bumpWeatherRefreshKey(); // setWeatherRefreshKey 대신(쿨다운 적용)
      }
    };

    tick();
    weatherTickIntervalRef.current = setInterval(tick, 60_000);

    return () => {
      if (weatherTickIntervalRef.current) {
        clearInterval(weatherTickIntervalRef.current);
        weatherTickIntervalRef.current = null;
      }
    };
  }, [destPlace, departureAt]);

  // 출발 추천 시각(ms) = meetingAt - travel - buffer
  const departAtMs = useMemo(() => {
    if (!selectedRoute || !meetingAt) return null;

    const meetingMs = meetingAt.getTime();
    const travelMs = selectedRoute.summary.totalTimeMin * 60 * 1000;
    const bufferMs = bufferMin * 60 * 1000;

    return meetingMs - travelMs - bufferMs;
  }, [selectedRoute, meetingAt, bufferMin]);

  // departureAt(ISO) store 업데이트
  useEffect(() => {
    if (!departAtMs) {
      if (departureAtStr !== null) setDepartureAt(null);
      return;
    }

    const nextISO = new Date(departAtMs).toISOString();

    if (departureAtStr !== nextISO) {
      setDepartureAt(nextISO);
    }
  }, [departAtMs, departureAtStr, setDepartureAt]);

  // 출발 추천 시각 텍스트
  const departTimeText = useMemo(() => {
    if (!departureAt) return "";
    return departureAt.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }, [departureAt]);

  // 타이머 seconds
  const [seconds, setSeconds] = useState<number>(0);

  // 타이머 표시 텍스트 (hh:mm:ss)
  const timerText = useMemo(() => {
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds % 3600) / 60);
    const ss = seconds % 60;

    const two = (n: number) => n.toString().padStart(2, "0");

    if (hh < 24) return `${two(hh)}:${two(mm)}:${two(ss)}`;

    const day = Math.floor(hh / 24);
    const restHour = hh % 24;
    return `${day}일 ${two(restHour)}:${two(mm)}:${two(ss)}`;
  }, [seconds]);

  // 출발까지 남은 시간 타이머
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
  }, [departureAt]);

  // 입력 체크도 meetingDate 포함
  const directionSearch = () => {
    if (!originPlace || !destPlace || !meetingDate || !meetingTimeStr) {
      Alert.alert(
        "입력이 필요해요",
        `${
          !originPlace
            ? "출발지"
            : !destPlace
            ? "도착지"
            : !meetingDate
            ? "약속 날짜"
            : "약속 시간"
        }를 먼저 설정해주세요.`,
        [{ text: "확인" }]
      );
      return;
    }

    router.push({ pathname: "/direction-search" });
  };

  const readyToShowResult = !!(
    originPlace &&
    destPlace &&
    meetingDate &&
    meetingTimeStr &&
    selectedRoute &&
    departAtMs
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HeaderBar onPressReset={reset} />

        <MeetingSection
          originPlace={originPlace}
          destPlace={destPlace}
          meetingDate={meetingDate}
          meetingTime={meetingTimeStr}
          selectedRoute={selectedRoute}
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
        />

        <WeatherSection
          destPlaceName={destPlace?.name ?? null}
          loading={weatherLoading}
          error={weatherError}
          weather={destWeather}
        />

        <RouteSection
          selectedRoute={selectedRoute}
          onPressChangeRoute={directionSearch}
        />

        <View style={{ height: 12 }} />
      </ScrollView>
    </View>
  );
}
