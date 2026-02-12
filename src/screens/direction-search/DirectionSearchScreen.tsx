import { useEffect, useMemo, useState } from "react";
import {
  View,
  FlatList,
  Pressable,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { usePlacesStore } from "@/store/usePlacesStore";
import { API_BASE_URL } from "@/src/config/env";
import { useLocalSearchParams, useRouter } from "expo-router";

import { SegmentChip } from "@/src/components/SegmentChip";

import { getOrCreateInstallId } from "@/src/lib/installId";

import { styles } from "./styles";

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

const formatWon = (n: number) => `${Number(n || 0).toLocaleString("ko-KR")}원`;

export default function DirectionSearchScreen() {
  const router = useRouter();
  const { type, editId } = useLocalSearchParams<{
    type: "create" | "update";
    editId?: string;
  }>();
  const { draft, setDraftSelectedRoute } = usePlacesStore();
  const originPlace = draft?.originPlace ?? null;
  const destPlace = draft?.destPlace ?? null;

  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const directionSearch = async () => {
      try {
        const installId = await getOrCreateInstallId();
        const res = await axios.post(`${API_BASE_URL}/api/direction/find`, {
          startX: originPlace!.lng,
          startY: originPlace!.lat,
          endX: destPlace!.lng,
          endY: destPlace!.lat,
        }, {
          headers: {
            "x-install-id": installId,
          }
        });

        setRoutes(res.data.routes ?? []);
        setSelectedIndex(0);
      } catch (e: any) {
        if (e?.response?.status === 404) {
          Alert.alert(
            "경로를 찾을 수 없어요",
            "출발지와 목적지가 너무 가까워서 경로가 제공되지 않을 수 있어요.\n도보로 이동해보세요.",
            [{ text: "확인" }]
          );
          setRoutes([]);
          setSelectedIndex(0);
          return;
        }

        Alert.alert("오류", "잠시 오류가 생겼네요, 다시 탐색해보세요", [{ text: "확인" }]);
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
        <Text style={{ marginTop: 10, backgroundColor: "#fff" }}>경로 탐색 중...</Text>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {originPlace.name ?? "출발"} → {destPlace.name ?? "도착"}
        </Text>

        {selectedRoute ? (
          <>
            <View style={styles.headerRow}>
              <Text style={styles.bigTime}>{selectedRoute.summary.totalTimeText}</Text>
              <Text style={styles.meta}>
                · {formatWon(selectedRoute.summary.totalFare)} · 환승{" "}
                {selectedRoute.summary.transferCount}회
              </Text>
            </View>

            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  도보 {selectedRoute.summary.totalWalkTimeText}
                </Text>
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
              <View style={styles.cardTop}>
                <Text style={[styles.cardTitle, active && styles.cardTitleActive]}>
                  {index + 1}번 경로
                </Text>
                <Text style={[styles.cardTime, active && styles.cardTimeActive]}>
                  {item.summary.totalTimeText}
                </Text>
              </View>

              <Text style={styles.cardMeta}>
                {formatWon(item.summary.totalFare)} · 환승 {item.summary.transferCount}회 ·
                도보 {item.summary.totalWalkTimeText}
              </Text>

              <View style={styles.chipsWrap}>
                {item.segments?.map((seg, i) => (
                  <SegmentChip key={`${index}-${i}`} seg={seg} />
                ))}
              </View>
            </Pressable>
          );
        }}
      />

      <View style={styles.bottomBar}>
        <Pressable
          style={[styles.primaryBtn, !selectedRoute && { opacity: 0.5 }]}
          disabled={!selectedRoute}
          onPress={() => {
            if (!selectedRoute) return;
            setDraftSelectedRoute(selectedRoute);
            if (type === "update") {
              router.back();
              return;
            }

            router.replace("/create-meeting");
          }}
        >
          <Text style={styles.primaryBtnText}>이 경로 선택</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}


