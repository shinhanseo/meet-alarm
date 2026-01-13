import { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ActivityIndicator,
  Pressable,
  Alert,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Region } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { usePlacesStore } from "../../store/usePlacesStore";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

// (추가) 거리 포맷
const formatDistance = (m?: number) => {
  if (m == null) return "";
  if (m < 1000) return `${m}m`;
  const km = m / 1000;
  return `${km.toFixed(km < 10 ? 1 : 0)}km`;
};

// 선택 경로 표시용 칩
function SegmentChip({ seg }: { seg: any }) {
  const dist = formatDistance(seg.distanceM);
  const walkSuffix = dist ? `(${dist})` : "";

  const mainLabel =
    seg.type === "WALK"
      ? `🚶 도보 ${seg.timeText}${walkSuffix}`
      : seg.type === "BUS"
      ? `🚌 ${seg.route ?? "버스"} ${seg.timeText}`
      : seg.type === "SUBWAY"
      ? `🚇 ${seg.line ?? "지하철"} ${seg.timeText}`
      : `${seg.type} ${seg.timeText}`;

  const subLabel =
    seg.from && seg.to
      ? seg.type === "SUBWAY"
        ? `${seg.from}역 → ${seg.to}역`
        : `${seg.from} → ${seg.to}`
      : "";

  const backgroundColor =
    seg.type === "WALK" ? "#FAFAFA" : seg.color ? `#${seg.color}` : "#E5E7EB";

  const textColor = seg.type === "WALK" ? "#111827" : "#FFFFFF";

  return (
    <View style={{ gap: 4 }}>
      <View style={[styles.chip, { backgroundColor, alignSelf: "flex-start" }]}>
        <Text style={[styles.chipText, { color: textColor }]}>{mainLabel}</Text>
      </View>

      {!!subLabel && (
        <Text style={styles.chipSubText} numberOfLines={1}>
          {subLabel}
        </Text>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { height: screenH } = useWindowDimensions();
  const {
    originPlace,
    destPlace,
    setPlace,
    reset,
    meetingTime,
    meetingDayOffset,
    setMeetingDayOffset,
    selectedRoute,
  } = usePlacesStore();

  const [region, setRegion] = useState<Region | null>(null);

  const bufferMin = 10;

  // 출발시간 카드 높이 측정용
  const [resultCardH, setResultCardH] = useState(0);
  const RESULT_TOP = 50 + 160 + 95; // resultCard의 top과 동일하게 유지
  const GAP = 12;
  const BOTTOM_MARGIN = 10; // 화면 바닥 여백
  const tabBarH = useBottomTabBarHeight();

  // 내일->오늘 전환 감지
  const prevOffsetRef = useRef(meetingDayOffset);

  // 개발모드(StrictMode)로 Alert 2번 뜨는 것 방지 가드
  const alertGuardRef = useRef(false);

  // 타이머 seconds
  const [seconds, setSeconds] = useState<number>(0);

  // ✅ "오늘/내일 + 시/분"을 실제 Date로 합치는 함수 (useMemo보다 위에 있어야 함)
  function buildMeetingDateTime(mt: Date, dayOffset: 0 | 1) {
    const d = new Date();
    d.setHours(mt.getHours(), mt.getMinutes(), 0, 0);
    d.setDate(d.getDate() + dayOffset);
    return d;
  }

  // 출발 추천 시각(ms)
  const departAtMs = useMemo(() => {
    if (!selectedRoute || !meetingTime) return null;

    const meetingAt = buildMeetingDateTime(
      meetingTime,
      meetingDayOffset as 0 | 1
    ).getTime(); // ms
    const travelMs = selectedRoute.summary.totalTimeMin * 60 * 1000; // ms
    const bufferMs = bufferMin * 60 * 1000; // ms

    return meetingAt - travelMs - bufferMs; // ms
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

  // 타이머 표시 텍스트 (mm:ss)
  const timerText = useMemo(() => {
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds % 3600) / 60);
    const ss = seconds % 60;
  
    const two = (n: number) => n.toString().padStart(2, "0");
  
    return `${two(hh)}:${two(mm)}:${two(ss)}`;
  }, [seconds]);

  // 위치 가져오기
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("위치 권한 거부됨");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const r = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(r);

      if (!originPlace) {
        setPlace("origin", {
          name: "현재 위치",
          address: "내 위치",
          lat: r.latitude,
          lng: r.longitude,
        });
      }
    })();
  }, [originPlace, setPlace]);

  // 내일->오늘 바꿀 때, 오늘 시간이 이미 지났으면 경고 + 시간설정 화면 이동
  useEffect(() => {
    const prev = prevOffsetRef.current;
    const curr = meetingDayOffset;

    // 전환이 아니면 가드 풀기
    if (!(prev === 1 && curr === 0)) {
      alertGuardRef.current = false;
      prevOffsetRef.current = curr;
      return;
    }

    if (!meetingTime) {
      prevOffsetRef.current = curr;
      return;
    }

    // StrictMode / 중복 호출 방지
    if (alertGuardRef.current) {
      prevOffsetRef.current = curr;
      return;
    }

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
      alertGuardRef.current = true;
      Alert.alert("이미 지난 시간입니다", "약속 시간을 다시 설정해주세요", [
        {
          text: "확인",
          onPress: () => router.push({ pathname: "/set-time" }),
        },
      ]);
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

  const openSearch = (mode: "origin" | "dest") => {
    router.push({ pathname: "/place-search", params: { mode } });
  };

  const openTimer = () => {
    router.push({ pathname: "/set-time" });
  };

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

  const timeText = useMemo(() => {
    if (!meetingTime) return "";
    return meetingTime.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }, [meetingTime]);

  if (!region) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>내 위치 불러오는 중...</Text>
      </View>
    );
  }

  const readyToShowResult = !!(
    originPlace &&
    destPlace &&
    meetingTime &&
    selectedRoute &&
    departAtMs
  );

  // route 카드가 시작되는 top (출발시간 카드 바로 아래)
  const routeTop = readyToShowResult
    ? RESULT_TOP + resultCardH + GAP
    : (styles.routeSummaryCard.top as number);

  // 화면 바닥까지 남는 높이
  const routeMaxH = useMemo(() => {
    const topNum = typeof routeTop === "number" ? routeTop : 0;
    const h = screenH - topNum - tabBarH - BOTTOM_MARGIN;
    return Math.max(250, h);
  }, [screenH, routeTop, tabBarH]);

  return (
    <View style={styles.container}>
      {/* 상단 입력 카드 */}
      <View style={styles.card}>
        <View style={styles.accent} />

        <View style={{ flex: 1 }}>
          {/* 출발 */}
          <Pressable onPress={() => openSearch("origin")} style={styles.row}>
            <Text style={styles.label}>출발</Text>
            <TextInput
              value={originPlace ? originPlace.name : ""}
              placeholder="출발지를 입력하세요"
              placeholderTextColor="#9AA0A6"
              style={styles.input}
              editable={false}
              pointerEvents="none"
            />
          </Pressable>

          {/* 도착 */}
          <Pressable onPress={() => openSearch("dest")} style={styles.row}>
            <Text style={styles.label}>도착</Text>
            <TextInput
              value={destPlace ? destPlace.name : ""}
              placeholder="목적지를 입력하세요"
              placeholderTextColor="#9AA0A6"
              style={styles.input}
              editable={false}
              pointerEvents="none"
            />
          </Pressable>

          {/* 시간 + 오늘/내일 */}
          <View style={styles.row}>
            <Text style={styles.label}>시간</Text>

            <Pressable onPress={openTimer} style={styles.timePressable}>
              <TextInput
                value={timeText}
                placeholder="약속 시간"
                placeholderTextColor="#9AA0A6"
                style={styles.timeinput}
                editable={false}
                pointerEvents="none"
              />
            </Pressable>

            <View style={styles.segment}>
              <Pressable
                onPress={() => setMeetingDayOffset(0)}
                style={[
                  styles.segmentBtn,
                  meetingDayOffset === 0 && styles.segmentBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    meetingDayOffset === 0 && styles.segmentTextActive,
                  ]}
                >
                  오늘
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setMeetingDayOffset(1)}
                style={[
                  styles.segmentBtn,
                  meetingDayOffset === 1 && styles.segmentBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    meetingDayOffset === 1 && styles.segmentTextActive,
                  ]}
                >
                  내일
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* 초기화 버튼 */}
      <View style={styles.actions}>
        <Pressable onPress={reset} style={styles.resetBtn}>
          <Text style={styles.resetText}>초기화</Text>
        </Pressable>
      </View>

      {/* 경로 탐색 버튼 */}
      <View style={styles.routeSearch}>
        <Pressable onPress={directionSearch} style={styles.routeSearchBtn}>
          <Text style={styles.resetText}>
            {selectedRoute ? "경로 다시 탐색하기" : "경로 탐색하기"}
          </Text>
        </Pressable>
      </View>

      {/* 결과 패널 */}
      {readyToShowResult && (
        <View
          style={styles.resultCard}
          onLayout={(e) => setResultCardH(e.nativeEvent.layout.height)}
        >
          <Text style={styles.resultTitle}>출발 추천 시간</Text>
          <Text style={styles.resultBig}>
            {meetingDayOffset === 0 ? "오늘 " : "내일 "}
            {departTimeText}
          </Text>

          {/* 타이머 표시 */}
          <Text style={styles.resultSub}>출발까지 {timerText} 남음</Text>
        </View>
      )}

      {/* 선택한 경로 요약 */}
      {selectedRoute && (
        <View
          style={[
            styles.routeSummaryCard,
            readyToShowResult && {
              top: RESULT_TOP + resultCardH + GAP,
              bottom: undefined,
            },
            { maxHeight: routeMaxH },
          ]}
        >
          <View style={styles.routeSummaryHeader}>
            <Text style={styles.routeSummaryTitle}>선택한 경로</Text>
            <Pressable onPress={directionSearch}>
              <Text style={styles.routeSummaryLink}>경로 변경</Text>
            </Pressable>
          </View>

          <Text style={styles.routeSummaryMeta}>
            {selectedRoute.summary.totalTimeText} · 환승{" "}
            {selectedRoute.summary.transferCount}회 · 도보{" "}
            {selectedRoute.summary.totalWalkTimeText}
          </Text>

          <ScrollView
            style={{ marginTop: 12 }}
            contentContainerStyle={{ gap: 10 }}
            showsVerticalScrollIndicator={false}
          >
            {selectedRoute.segments?.map((seg, i) => (
              <SegmentChip key={`seg-${i}`} seg={seg} />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8F7" },

  card: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    flexDirection: "row",
    backgroundColor: "#CBF3BB",
    borderRadius: 18,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },

  accent: {
    width: 6,
    borderRadius: 6,
    backgroundColor: "#F0F8A4",
    marginRight: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },

  label: { fontSize: 16, fontWeight: "600", color: "#1F2937" },

  input: {
    flex: 1,
    height: 44,
    backgroundColor: "#F1F5F1",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111827",
  },

  timePressable: { flex: 1 },

  timeinput: {
    height: 44,
    backgroundColor: "#F1F5F1",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111827",
    minWidth: 90,
  },

  segment: {
    flexDirection: "row",
    backgroundColor: "#F1F5F1",
    borderRadius: 12,
    padding: 3,
  },

  segmentBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  segmentBtnActive: {
    backgroundColor: "#75B06F",
  },

  segmentText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1F2937",
  },

  segmentTextActive: {
    color: "#FFFFFF",
  },

  actions: {
    position: "absolute",
    top: 50 + 160 + 50,
    left: 10,
    right: 10,
    alignItems: "flex-start",
  },

  resetBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#F0F8A4",
  },

  resetText: { fontSize: 13, fontWeight: "700", color: "#111827" },

  routeSearch: {
    position: "absolute",
    top: 50 + 160 + 50,
    left: 10,
    right: 20,
    alignItems: "flex-end",
  },

  routeSearchBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#F0F8A4",
  },

  // 출발시간 카드
  resultCard: {
    position: "absolute",
    left: 10,
    right: 10,
    top: 50 + 160 + 95,
    backgroundColor: "#DFF3E7",
    borderRadius: 18,
    padding: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  resultTitle: { fontSize: 13, fontWeight: "900", color: "#6B7280" },
  resultBig: {
    marginTop: 6,
    fontSize: 30,
    fontWeight: "900",
    color: "#111827",
  },
  resultSub: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
  },
  resultHint: { marginTop: 6, fontSize: 12, color: "#9AA0A6" },

  // 선택한 경로 카드
  routeSummaryCard: {
    position: "absolute",
    left: 10,
    right: 10,
    top: 50 + 160 + 95 + 120,
    maxHeight: 250,
    backgroundColor: "#F2FAE8",
    borderRadius: 18,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },

  routeSummaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeSummaryTitle: { fontSize: 14, fontWeight: "900", color: "#111827" },
  routeSummaryLink: { fontSize: 12, fontWeight: "900", color: "#2F6B2F" },
  routeSummaryMeta: {
    marginTop: 8,
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "700",
  },

  // 칩 스타일
  chip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipText: { fontSize: 15, color: "#111827" },
  chipSubText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 6,
  },

  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});
