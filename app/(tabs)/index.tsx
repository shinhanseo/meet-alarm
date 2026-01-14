import { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { usePlacesStore } from "@/store/usePlacesStore";
import { SegmentChip } from "@/src/components/SegmentChip";

export default function HomeScreen() {
  const router = useRouter();
  const {
    originPlace,
    destPlace,
    meetingTime,
    meetingDayOffset,
    selectedRoute,
  } = usePlacesStore();

  const bufferMin = 10;

  // 내일->오늘 전환 감지
  const prevOffsetRef = useRef(meetingDayOffset);

  // 타이머 seconds
  const [seconds, setSeconds] = useState<number>(0);

  // "오늘/내일 + 시/분"을 실제 Date로 합치는 함수
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
    ).getTime();
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

    if (hh < 24) {
      return `${two(hh)}:${two(mm)}:${two(ss)}`;
    } else {
      const day = Math.floor(hh / 24);
      const restHour = hh % 24;
      return `${day}일 ${two(restHour)}:${two(mm)}:${two(ss)}`;
    }
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
  }, [meetingDayOffset, meetingTime]);

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

  const readyToShowResult = !!(
    originPlace &&
    destPlace &&
    meetingTime &&
    selectedRoute &&
    departAtMs
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>지금이니</Text>
          <Pressable
            onPress={() => router.push("/create-meeting")}
            style={styles.headerBtn}
          >
            <Text style={styles.headerBtnText}>약속 설정</Text>
          </Pressable>
        </View>

        {/* 상태 카드 */}
        {!originPlace || !destPlace || !meetingTime ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>아직 약속이 없어요</Text>
            <Text style={styles.emptySub}>
              출발지·도착지·시간을 설정하면 출발 추천 시간과 타이머가 보여요.
            </Text>

            <Pressable
              onPress={() => router.push("/create-meeting")}
              style={styles.primaryBtn}
            >
              <Text style={styles.primaryBtnText}>약속 설정하러 가기</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.meetingCard}>
            <Text style={styles.sectionLabel}>다음 약속</Text>

            <View style={styles.placeRow}>
              <Text style={styles.placeText} numberOfLines={1}>
                {originPlace?.name ?? ""}
              </Text>
              <Text style={styles.arrow}>→</Text>
              <Text style={styles.placeText} numberOfLines={1}>
                {destPlace?.name ?? ""}
              </Text>
            </View>

            <Text style={styles.meetingMeta}>
              {meetingDayOffset === 0 ? "오늘" : "내일"} ·{" "}
              {meetingTime?.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </Text>

            <View style={styles.meetingActions}>
              <Pressable
                onPress={() => router.push("/create-meeting")}
                style={styles.ghostBtn}
              >
                <Text style={styles.ghostBtnText}>약속 수정</Text>
              </Pressable>

              <Pressable onPress={directionSearch} style={styles.primaryBtnSmall}>
                <Text style={styles.primaryBtnSmallText}>
                  {selectedRoute ? "경로 다시 탐색" : "경로 탐색"}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* 출발 추천 + 타이머 */}
        <View style={styles.timerCard}>
          <Text style={styles.sectionLabel}>출발 추천</Text>

          {readyToShowResult ? (
            <>
              <View style={styles.departRow}>
                <Text style={styles.departTime}>
                  {meetingDayOffset === 0 ? "오늘 " : "내일 "}
                  {departTimeText}
                </Text>

                <View style={[styles.badge, seconds <= 300 && { backgroundColor: THEME.dangerSoft, borderColor: "#FECACA" }]}>
                  <Text style={[styles.badgeText, seconds <= 300 && styles.badgeDanger]}>
                    {seconds <= 300 ? "5분 이내" : "여유 있음"}
                  </Text>
                </View>
              </View>

              <View style={styles.countdownBox}>
                <Text
                  style={[
                    styles.countdownText,
                    seconds <= 300 && styles.countdownDanger,
                  ]}
                >
                  {timerText}
                </Text>
                <Text style={styles.countdownSub}>출발까지 남은 시간</Text>
              </View>
            </>
          ) : (
            <View style={styles.hintBox}>
              <Text style={styles.hintText}>
                경로를 선택하면 출발 추천 시간과 타이머가 보여요.
              </Text>
            </View>
          )}
        </View>

        {/* 선택 경로 */}
        {selectedRoute ? (
          <View style={styles.routeCard}>
            <View style={styles.routeHeader}>
              <Text style={styles.routeTitle}>선택한 경로</Text>
              <Pressable onPress={directionSearch} style={styles.routeLinkBtn}>
                <Text style={styles.routeLinkText}>경로 변경</Text>
              </Pressable>
            </View>

            <Text style={styles.routeMeta}>
              {selectedRoute.summary.totalTimeText} · 환승{" "}
              {selectedRoute.summary.transferCount}회 · 도보{" "}
              {selectedRoute.summary.totalWalkTimeText}
            </Text>

            <View style={{ marginTop: 12, gap: 10 }}>
              {selectedRoute.segments?.map((seg: any, i: number) => (
                <SegmentChip key={`seg-${i}`} seg={seg} />
              ))}
            </View>
          </View>
        ) : null}

        <View style={{ height: 12 }} />
      </ScrollView>
    </View>
  );
}

const THEME = {
  bg: "#FAFAF9",          // 거의 흰 배경(따뜻한 톤)
  card: "#FFFFFF",        // 카드 흰색
  text: "#111827",        // 진한 텍스트
  muted: "#6B7280",       // 보조 텍스트
  border: "#E7E5E4",      // 따뜻한 회색 테두리(stone)

  orange: "#F97316",      // 포인트 오렌지(500)
  orangeDark: "#EA580C",  // 눌림/강조(600)
  orangeSoft: "#FFF7ED",  // 오렌지 연한 배경
  orangeBorder: "#FED7AA",// 오렌지 연한 테두리

  danger: "#DC2626",
  dangerSoft: "#FEF2F2",
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  content: { paddingHorizontal: 14, paddingTop: 36, paddingBottom: 24, gap: 12 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  headerTitle: { fontSize: 22, fontWeight: "900", color: THEME.text },

  // 기존: 검정 버튼 -> 오렌지
  headerBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: THEME.orange,
  },
  headerBtnText: { color: "#fff", fontWeight: "900", fontSize: 13 },

  sectionLabel: { fontSize: 12, fontWeight: "900", color: THEME.muted },

  // emptyCard: 흰 카드 + 따뜻한 테두리
  emptyCard: {
    backgroundColor: THEME.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    gap: 10,
  },
  emptyTitle: { fontSize: 18, fontWeight: "900", color: THEME.text },
  emptySub: { fontSize: 13, color: THEME.muted, fontWeight: "700", lineHeight: 18 },

  // meetingCard: 기존 연두 -> 흰 카드 + 오렌지 소프트 배경 살짝
  meetingCard: {
    backgroundColor: THEME.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
    gap: 10,
  },
  placeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  placeText: { flex: 1, fontSize: 16, fontWeight: "900", color: THEME.text },
  arrow: { fontSize: 16, fontWeight: "900", color: THEME.orange },
  meetingMeta: { fontSize: 12, fontWeight: "800", color: THEME.muted },

  meetingActions: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },

  // ghostBtn: 기존 반투명 흰 -> 오렌지 연한 배경
  ghostBtn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: THEME.orangeSoft,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
    flex: 1,
    alignItems: "center",
  },
  ghostBtnText: { fontSize: 13, fontWeight: "900", color: THEME.orangeDark },

  // primaryBtn: 기존 검정 -> 오렌지
  primaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: THEME.orange,
    alignItems: "center",
  },
  primaryBtnText: { fontSize: 14, fontWeight: "900", color: "#fff" },

  primaryBtnSmall: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: THEME.orange,
    flex: 1,
    alignItems: "center",
  },
  primaryBtnSmallText: { fontSize: 13, fontWeight: "900", color: "#fff" },

  // timerCard: 기존 초록 배경 -> 흰 카드 + 오렌지 포인트
  timerCard: {
    backgroundColor: THEME.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    gap: 12,
  },
  departRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  departTime: { fontSize: 22, fontWeight: "900", color: THEME.text },

  // badge: 상태 라벨
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: THEME.orangeSoft,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
  },
  badgeText: { fontSize: 12, fontWeight: "900", color: THEME.orangeDark },
  badgeDanger: { color: THEME.danger },

  // countdownBox: 타이머 박스는 연한 오렌지 배경으로
  countdownBox: {
    backgroundColor: THEME.orangeSoft,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
  },
  countdownText: { fontSize: 32, fontWeight: "900", color: "#000" },
  countdownDanger: { color: THEME.danger },
  countdownSub: { fontSize: 12, fontWeight: "800", color: THEME.muted },

  hintBox: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  hintText: { fontSize: 13, fontWeight: "800", color: THEME.muted, lineHeight: 18 },

  routeCard: {
    backgroundColor: THEME.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  routeTitle: { fontSize: 14, fontWeight: "900", color: THEME.text },
  routeLinkBtn: { paddingVertical: 6, paddingHorizontal: 8 },
  routeLinkText: { fontSize: 12, fontWeight: "900", color: THEME.orangeDark },
  routeMeta: { marginTop: 8, fontSize: 12, color: THEME.muted, fontWeight: "700" },
});

