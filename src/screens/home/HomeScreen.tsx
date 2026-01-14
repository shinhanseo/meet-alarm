import { useEffect, useMemo, useState, useRef } from "react";
import { View, Alert, ScrollView, ActivityIndicator, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

import { API_BASE_URL } from "@/src/config/env";
import { usePlacesStore } from "@/store/usePlacesStore";
import { styles } from "./styles";
import { THEME } from "./theme";

import HeaderBar from "./components/HeaderBar";
import MeetingSection from "./components/MeetingSection";
import TimerSection from "./components/TimerSection";
import RouteSection from "./components/RouteSection";

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

export default function HomeScreen() {
  const router = useRouter();
  const { originPlace, destPlace, meetingTime, meetingDayOffset, selectedRoute } = usePlacesStore();

  const bufferMin = 10;

  // 내일->오늘 전환 감지
  const prevOffsetRef = useRef(meetingDayOffset);

  // 타이머 seconds
  const [seconds, setSeconds] = useState<number>(0);

  // 목적지 날씨 상태
  const [destWeather, setDestWeather] = useState<WeatherDto | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // "오늘/내일 + 시/분"을 실제 Date로 합치는 함수
  function buildMeetingDateTime(mt: Date, dayOffset: 0 | 1) {
    const d = new Date();
    d.setHours(mt.getHours(), mt.getMinutes(), 0, 0);
    d.setDate(d.getDate() + dayOffset);
    return d;
  }

  // 목적지 현재 날씨 가져오기 (destPlace 바뀔 때)
  useEffect(() => {
    const fetchDestWeather = async () => {
      if (!destPlace) {
        setDestWeather(null);
        setWeatherError(null);
        return;
      }

      try {
        setWeatherLoading(true);
        setWeatherError(null);

        const res = await axios.get(`${API_BASE_URL}/api/weather`, {
          params: {
            lat: destPlace.lat,
            lon: destPlace.lng, // 프론트 lng -> 서버 lon
          },
          timeout: 8000,
        });

        // 서버 응답: { weather: WeatherDto }
        setDestWeather(res.data.weather);
      } catch (e: any) {
        console.error(e);
        setDestWeather(null);
        setWeatherError("날씨 정보를 불러오지 못했어요.");
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchDestWeather();
  }, [destPlace]);

  const isBadWeather =
    destWeather?.main === "Rain" ||
    destWeather?.main === "Snow" ||
    destWeather?.main === "Thunderstorm";

  // 출발 추천 시각(ms)
  const departAtMs = useMemo(() => {
    if (!selectedRoute || !meetingTime) return null;

    const meetingAt = buildMeetingDateTime(meetingTime, meetingDayOffset as 0 | 1).getTime();
    const travelMs = selectedRoute.summary.totalTimeMin * 60 * 1000;
    const bufferMs = bufferMin * 60 * 1000;

    return meetingAt - travelMs - bufferMs;
  }, [selectedRoute, meetingTime, meetingDayOffset, bufferMin]);

  // 출발 추천 시각 텍스트
  const departTimeText = useMemo(() => {
    if (!departAtMs) return "";
    return new Date(departAtMs).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }, [departAtMs]);

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

  // 내일->오늘 바꿀 때, 오늘 시간이 이미 지났으면 경고 + 시간설정 화면 이동
  useEffect(() => {
    const prev = prevOffsetRef.current;
    const curr = meetingDayOffset;

    if (prev === 1 && curr === 0 && meetingTime) {
      const now = new Date();
      const todayAt = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        meetingTime.getHours(),
        meetingTime.getMinutes(),
        0,
        0
      );

      if (todayAt.getTime() < Date.now()) {
        Alert.alert("이미 지난 시간이에요", "시간을 다시 설정해주세요.");
        router.push("/set-time");
      }
    }

    prevOffsetRef.current = curr;
  }, [meetingDayOffset, meetingTime, router]);

  // 출발까지 남은 시간 타이머
  useEffect(() => {
    if (!departAtMs) {
      setSeconds(0);
      return;
    }

    const update = () => {
      const diff = Math.max(0, Math.floor((departAtMs - Date.now()) / 1000));
      setSeconds(diff);
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [departAtMs]);

  const directionSearch = () => {
    if (!originPlace || !destPlace || !meetingTime) {
      Alert.alert(
        "입력이 필요해요",
        `${!originPlace ? "출발지" : !destPlace ? "도착지" : "약속 시간"}를 먼저 설정해주세요.`,
        [{ text: "확인" }]
      );
      return;
    }

    router.push({ pathname: "/direction-search" });
  };

  const readyToShowResult = !!(originPlace && destPlace && meetingTime && selectedRoute && departAtMs);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HeaderBar onPressCreate={() => router.push("/create-meeting")} />

        <MeetingSection
          originPlace={originPlace}
          destPlace={destPlace}
          meetingTime={meetingTime}
          meetingDayOffset={meetingDayOffset}
          selectedRoute={selectedRoute}
          onPressCreate={() => router.push("/create-meeting")}
          onPressEdit={() => router.push("/create-meeting")}
          onPressSearchRoute={directionSearch}
        />

        {/* 목적지 날씨 카드 */}
        <Text style={styles.sectionLabel}>목적지 날씨</Text>
        <View style={styles.routeCard}>
          {!destPlace && (
            <Text style={styles.routeMeta}>목적지를 설정하면 날씨를 보여줄게요.</Text>
          )}

          {destPlace && weatherLoading && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <ActivityIndicator />
              <Text style={styles.routeMeta}>불러오는 중...</Text>
            </View>
          )}

          {destPlace && !weatherLoading && weatherError && (
            <Text style={styles.routeMeta}>{weatherError}</Text>
          )}

          {destPlace && !weatherLoading && !weatherError && destWeather && (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.routeTitle}>
                  {destPlace.name} · {destWeather.description}
                </Text>

                <Text style={[styles.departTime, { marginTop: 8 }]}>
                  {Math.round(destWeather.temp)}°C{" "}
                  <Text style={{ fontSize: 12, fontWeight: "800", color: THEME.muted }}>
                    체감 {Math.round(destWeather.feelsLike)}°C
                  </Text>
                </Text>

                <Text style={styles.routeMeta}>
                  습도 {destWeather.humidity}% · 바람 {destWeather.windSpeed}m/s
                </Text>

                {isBadWeather && (
                  <View style={[styles.badge, { marginTop: 10, alignSelf: "flex-start" }]}>
                    <Text style={[styles.badgeText, styles.badgeDanger]}>우산 챙기기 추천</Text>
                  </View>
                )}
              </View>

              {!!destWeather.icon && (
                <Image
                  source={{ uri: `https://openweathermap.org/img/wn/${destWeather.icon}@2x.png` }}
                  style={{ width: 56, height: 56 }}
                />
              )}
            </View>
          )}
        </View>

        <TimerSection
          readyToShowResult={readyToShowResult}
          meetingDayOffset={meetingDayOffset}
          departTimeText={departTimeText}
          seconds={seconds}
          timerText={timerText}
        />

        <RouteSection selectedRoute={selectedRoute} onPressChangeRoute={directionSearch} />

        <View style={{ height: 12 }} />
      </ScrollView>
    </View>
  );
}
