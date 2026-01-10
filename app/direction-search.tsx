import { useEffect, useMemo, useState } from "react";
import {
  View,
  FlatList,
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { usePlacesStore } from "../store/usePlacesStore";
import { API_BASE_URL } from "@/src/config/env";

type Segment = {
  type: "WALK" | "BUS" | "SUBWAY" | string;
  timeMin: number;
  timeText: string;
  from?: string; // 출발지
  to?: string;  // 목적지
  distanceM : number; // WALK일 때 미터 표시용
  route?: string; // 버스 번호 ex) 광역 8106, 일반 52
  line?: string;  // 지하철 노선 ex) 7호선, 서해선, 2호선
  stops?: number; // 지나가는 정거장
  color?: string;
};

type RouteItem = {
  summary: {  // 경로 전체 정보
    totalTimeMin: number; // 전체 시간(분)
    totalTimeText: string; // 텍스트 출력용 ex) 1시간 27분
    totalWalkTimeMin: number; // 전체 도보 시간
    totalWalkTimeText: string; // 텍스트 출력용
    totalFare: number;  // 총 요금
    transferCount: number; // 환승 횟수
  };
  segments: Segment[]; // 경로 ex) 도보 10분(703m) -> 수도권 7호선 5분 -> 도본 5분(387m)
};

const formatWon = (n: number) => `${Number(n || 0).toLocaleString("ko-KR")}원`; // ex) 1870 -> 1,870원 

const formatDistance = (m?: number) => { // km -> m로 변환
  if (m == null) return "";
  if (m < 1000) return `${m}m`;
  const km = m / 1000;
  return `${km.toFixed(km < 10 ? 1 : 0)}km`; // 1.2km / 12km
};

function SegmentChip({ seg }: { seg: Segment }) { // 경로 표시에 사용되는 텍스트 
  const dist = formatDistance(seg.distanceM);
  const walkSuffix = dist ? `(${dist})` : "";

  const label =
    seg.type === "WALK" // ex) 도보 10분(703m)
      ? `🚶 도보 ${seg.timeText}${walkSuffix}`
      : seg.type === "BUS"  // ex) 일반 52 14분
      ? `🚌 ${seg.route ?? "버스"} ${seg.timeText}`
      : seg.type === "SUBWAY" // 수도권 7호선 5분
      ? `🚇 ${seg.line ?? "지하철"} ${seg.timeText}`
      : `${seg.type} ${seg.timeText}`;
  
  const backgroundColor =
    seg.type === "WALK"
      ? "#FAFAFA"
      : seg.color
      ? `#${seg.color}`
      : "#E5E7EB";
    

  return (
    <View style={[styles.chip, { backgroundColor }]}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}


export default function DirectionSearchScreen() {
  const { originPlace, destPlace } = usePlacesStore();
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState<RouteItem[]>([]); // 경로에 대한 정보
  const [selectedIndex, setSelectedIndex] = useState(0); // 선택된 라우터 기본으로 1번 경로로 지정

  useEffect(() => {
    const directionSearch = async () => {
      try {
        const res = await axios.post(`${API_BASE_URL}/api/direction/find`, {
          startX: originPlace!.lng,
          startY: originPlace!.lat,
          endX: destPlace!.lng,
          endY: destPlace!.lat,
        });

        setRoutes(res.data.routes ?? []);
        setSelectedIndex(0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (originPlace && destPlace) directionSearch();
    else setLoading(false);
  }, [originPlace, destPlace]);

  const selectedRoute = useMemo(() => routes[selectedIndex], [routes, selectedIndex]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 10, backgroundColor : "#fff" }}>경로 탐색 중...</Text>
      </View>
    );
  }

  if (!originPlace || !destPlace) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerTitle}>출발지/도착지를 먼저 선택하세요</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 요약 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {originPlace.name ?? "출발"} → {destPlace.name ?? "도착"}
        </Text>

        {selectedRoute ? (
          <>
            <View style={styles.headerRow}>
              <Text style={styles.bigTime}>{selectedRoute.summary.totalTimeText}</Text>
              <Text style={styles.meta}>
                · {formatWon(selectedRoute.summary.totalFare)} · 환승 {selectedRoute.summary.transferCount}회
              </Text>
            </View>

            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>도보 {selectedRoute.summary.totalWalkTimeText}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>경로 {routes.length}개</Text>
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.meta}>경로가 없습니다.</Text>
        )}
      </View>

      {/* 경로 리스트 */}
      <FlatList
        data={routes}
        keyExtractor={(_, idx) => String(idx)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>경로가 없습니다.</Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const active = index === selectedIndex;

          return (
            <Pressable
              onPress={() => setSelectedIndex(index)}
              style={[styles.card, active && styles.cardActive]}
            >
              {/* 카드 헤더 */}
              <View style={styles.cardTop}>
                <Text style={[styles.cardTitle, active && styles.cardTitleActive]}>
                  {index + 1}번 경로
                </Text>
                <Text style={[styles.cardTime, active && styles.cardTimeActive]}>
                  {item.summary.totalTimeText}
                </Text>
              </View>

              {/* 메타 */}
              <Text style={styles.cardMeta}>
                {formatWon(item.summary.totalFare)} · 환승 {item.summary.transferCount}회 · 도보 {item.summary.totalWalkTimeText}
              </Text>

              {/* 구간 칩들 */}
              <View style={styles.chipsWrap}>
                {item.segments?.map((seg, i) => (
                  <SegmentChip key={`${index}-${i}`} seg={seg} />
                ))}
              </View>
            </Pressable>
          );
        }}
      />

      {/* 하단 버튼 */}
      <View style={styles.bottomBar}>
        <Pressable
          style={[styles.primaryBtn, !selectedRoute && { opacity: 0.5 }]}
          disabled={!selectedRoute}
          onPress={() => {
            console.log("선택한 경로:", selectedRoute); 
          }}
        >
          <Text style={styles.primaryBtnText}>이 경로 선택</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff"},

  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F3",
  },
  headerTitle: { fontSize: 14, color: "#111827", marginBottom: 6 },
  headerRow: { flexDirection: "row", alignItems: "baseline" },
  bigTime: { fontSize: 26, fontWeight: "800", color: "#111827" },
  meta: { fontSize: 13, color: "#6B7280", marginLeft: 8 },

  badgeRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  badge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: { fontSize: 12, color: "#374151", fontWeight: "600" },

  listContent: { padding: 16, gap: 12, paddingBottom: 110 },

  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#fff",
  },
  cardActive: { borderColor: "#75B06F", backgroundColor: "#EEF6EE" },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 15, fontWeight: "800", color: "#111827" },
  cardTitleActive: { color: "#2F6B2F" },
  cardTime: { fontSize: 15, fontWeight: "800", color: "#111827" },
  cardTimeActive: { color: "#2F6B2F" },

  cardMeta: { marginTop: 6, fontSize: 13, color: "#6B7280" },

  chipsWrap: { flexDirection: "column", flexWrap: "wrap", gap: 8, marginTop: 12 },
  chip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipText: { fontSize: 15, color: "#111827" },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: "#EEF0F3",
    backgroundColor: "#fff",
  },
  primaryBtn: {
    backgroundColor: "#F0F8A4",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#000", fontSize: 15, fontWeight: "800"},

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16, backgroundColor : "#fff"},
  centerTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
});
