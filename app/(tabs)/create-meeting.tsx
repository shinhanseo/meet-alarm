import { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Region } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { usePlacesStore } from "../../store/usePlacesStore";
import axios from "axios";
import { API_BASE_URL } from "@/src/config/env";

export default function CreateMeetingScreen() {
  const router = useRouter();

  const {
    originPlace,
    destPlace,
    setPlace,
    reset,
    meetingTime,
    meetingDayOffset,
    setMeetingDayOffset,
  } = usePlacesStore();

  const [region, setRegion] = useState<Region | null>(null);

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

  const progressText = useMemo(() => {
    const done = [!!originPlace, !!destPlace, !!meetingTime].filter(Boolean).length;
    if (done === 0) return "아직 아무것도 설정되지 않았어요.";
    if (done === 1) return "좋아요. 하나만 더 설정해봐요.";
    if (done === 2) return "거의 다 됐어요. 마지막으로 시간만 설정하면 돼요.";
    return "완료! 이제 경로를 탐색할 수 있어요.";
  }, [originPlace, destPlace, meetingTime]);

  const ready = !!(originPlace && destPlace && meetingTime);

  if (!region) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>내 위치 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>약속 설정</Text>
        <Pressable onPress={reset} style={styles.resetBtnTop}>
          <Text style={styles.resetTextTop}>초기화</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 입력 카드 (기본틀 유지: 출발/도착/시간 + 오늘/내일) */}
        <View style={styles.card}>
          <View style={styles.accent} />

          <View style={{ flex: 1 }}>
            {/* 출발 */}
            <Pressable onPress={() => openSearch("origin")} style={styles.row}>
              <Text style={styles.label}>출발</Text>
              <TextInput
                value={originPlace ? originPlace.name : ""}
                placeholder="출발지를 입력하세요"
                placeholderTextColor={THEME.placeholder}
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
                placeholderTextColor={THEME.placeholder}
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
                  placeholderTextColor={THEME.placeholder}
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

        {/* 상태/가이드 섹션 */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>진행 상태</Text>

          <View style={styles.progressRow}>
            <View style={[styles.dot, originPlace && styles.dotOn]} />
            <Text style={styles.progressText}>출발지</Text>

            <View style={[styles.dot, destPlace && styles.dotOn]} />
            <Text style={styles.progressText}>도착지</Text>

            <View style={[styles.dot, meetingTime && styles.dotOn]} />
            <Text style={styles.progressText}>시간</Text>
          </View>

          <Text style={styles.infoDesc}>{progressText}</Text>

          {!ready && (
            <View style={styles.tipBox}>
              <Text style={styles.tipTitle}>팁</Text>
              <Text style={styles.tipText}>
                출발/도착이 가까우면 경로가 안 뜰 수 있어요. 그럴 땐 도보 이동을
                고려해보세요.
              </Text>
            </View>
          )}
        </View>

        {/* 빈 공간 채움용(ScrollView라 자연스럽게 아래로 내려감) */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* 하단 고정 버튼(기본틀: 경로 탐색하기 버튼) */}
      <View style={styles.bottomBar}>
        <Pressable
          onPress={directionSearch}
          style={[styles.routeSearchBtn, !ready && { opacity: 0.55 }]}
        >
          <Text style={styles.directionText}>경로 탐색하기</Text>
        </Pressable>
        <Text style={styles.bottomHint}>
          {ready ? "경로를 선택하면 홈에서 타이머가 보여요." : "필수 입력을 먼저 설정해주세요."}
        </Text>
      </View>
    </View>
  );
}

const THEME = {
  bg: "#FAFAF9",
  card: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  placeholder: "#9AA0A6",
  border: "#E7E5E4",
  inputBg: "#FFFFFF",

  orange: "#F97316",
  orangeDark: "#EA580C",
  orangeSoft: "#FFF7ED",
  orangeBorder: "#FED7AA",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.bg,
  },
  loadingText: { marginTop: 8, color: THEME.muted, fontWeight: "800" },

  header: {
    paddingTop: 54,
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 22, fontWeight: "900", color: THEME.text },

  resetBtnTop: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
  },
  resetTextTop: {
    fontSize: 13,
    fontWeight: "900",
    color: THEME.orangeDark,
  },

  content: {
    paddingHorizontal: 14,
    paddingBottom: 140, // bottomBar 공간
    gap: 12,
  },

  // 입력 카드(기본틀)
  card: {
    flexDirection: "row",
    backgroundColor: THEME.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },

  accent: {
    width: 7,
    borderRadius: 10,
    backgroundColor: THEME.orange,
    marginRight: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },

  label: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.text,
  },

  input: {
    flex: 1,
    height: 46,
    backgroundColor: THEME.inputBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    color: THEME.text,
    borderWidth: 1,
    borderColor: THEME.border,
  },

  timePressable: { flex: 1 },

  timeinput: {
    height: 46,
    backgroundColor: THEME.inputBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    color: THEME.text,
    minWidth: 90,
    borderWidth: 1,
    borderColor: THEME.border,
  },

  segment: {
    flexDirection: "row",
    backgroundColor: THEME.orangeSoft,
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
  },

  segmentBtn: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  segmentBtnActive: {
    backgroundColor: THEME.orange,
  },

  segmentText: {
    fontSize: 13,
    fontWeight: "900",
    color: THEME.orangeDark,
  },

  segmentTextActive: {
    color: "#FFFFFF",
  },

  // 중간 정보 카드(화면 채우기)
  infoCard: {
    backgroundColor: THEME.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    gap: 10,
  },
  infoTitle: { fontSize: 14, fontWeight: "900", color: THEME.text },
  infoDesc: { fontSize: 13, fontWeight: "800", color: THEME.muted, lineHeight: 18 },

  progressRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    borderWidth: 1,
    borderColor: THEME.border,
  },
  dotOn: { backgroundColor: THEME.orange, borderColor: THEME.orangeBorder },
  progressText: { fontSize: 12, fontWeight: "900", color: THEME.text, marginRight: 10 },

  tipBox: {
    backgroundColor: THEME.orangeSoft,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
    gap: 6,
  },
  tipTitle: { fontSize: 12, fontWeight: "900", color: THEME.orangeDark },
  tipText: { fontSize: 12, fontWeight: "800", color: THEME.muted, lineHeight: 18 },

  // 하단 고정
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 22,
    backgroundColor: THEME.bg,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
  },

  routeSearchBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: THEME.orange,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },

  directionText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#fff",
  },

  bottomHint: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "800",
    color: THEME.muted,
    textAlign: "center",
  },
});
