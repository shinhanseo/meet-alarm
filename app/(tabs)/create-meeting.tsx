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
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { usePlacesStore } from "../../store/usePlacesStore";
import { SegmentChip } from "@/src/components/SegmentChip";

// ---------- helpers ----------
function getLocalYYYYMMDD(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function ymdToDate(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDateLabel(yyyyMMdd: string) {
  const [y, m, d] = yyyyMMdd.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.toLocaleDateString("ko-KR", { weekday: "short" as const });
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}.${mm}.${dd} (${day})`;
}
// ----------------------------

export default function CreateMeetingScreen() {
  const router = useRouter();

  const {
    originPlace,
    destPlace,
    setPlace,
    setPlaceSilent,

    meetingDate,
    setMeetingDate,
    meetingTime: meetingTimeStr,

    selectedRoute,
    setSelectedRoute,
    setDepartureAt,

    confirmMeeting,
  } = usePlacesStore();

  const meetingTime = meetingTimeStr ?? "";

  const [region, setRegion] = useState<Region | null>(null);
  const [showDateModal, setShowDateModal] = useState(false);

  // 날짜 기본값 (null이면 오늘)
  useEffect(() => {
    if (!meetingDate) setMeetingDate(getLocalYYYYMMDD());
  }, [meetingDate, setMeetingDate]);

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
        setPlaceSilent("origin", {
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

  const dateText = useMemo(() => {
    if (!meetingDate) return "";
    return formatDateLabel(meetingDate);
  }, [meetingDate]);

  const progressText = useMemo(() => {
    const done = [
      !!originPlace,
      !!destPlace,
      !!meetingDate,
      !!meetingTimeStr,
      !!selectedRoute
    ].filter(Boolean).length;

    if (done === 0) return "아직 아무것도 설정되지 않았어요.";
    if (done === 1) return "좋아요. 하나만 더 설정해봐요.";
    if (done === 2) return "좋아요. 세 가지만 더 하면 돼요.";
    if (done === 3) return "거의 다 됐어요. 시간만 설정하면 경로를 선택할 수 있어요!";
    if (done === 4) return "정말 다 왔어요. 이제 경로를 선택해 주세요.";
    return "완료! 이제 약속을 저장해주세요";
  }, [originPlace, destPlace, meetingDate, meetingTimeStr, selectedRoute]);

  // 필수 입력 완료(경로 탐색 가능)
  const readyInput = !!(originPlace && destPlace && meetingDate && meetingTimeStr);

  // 저장(확정) 가능 조건: 경로까지 선택
  const readyToSave = !!(readyInput && selectedRoute);

  const routeSummaryText = useMemo(() => {
    if (!selectedRoute) return "";
    const s = selectedRoute.summary;
    return `총 ${s.totalTimeText} · 도보 ${s.totalWalkTimeText} · 환승 ${s.transferCount} · ${s.totalFare.toLocaleString()}원`;
  }, [selectedRoute]);

  const previewSegments = useMemo(() => {
    if (!selectedRoute) return [];
    return selectedRoute.segments.slice(0, 3);
  }, [selectedRoute]);

  const onPressSave = () => {
    if (!readyToSave) return;
    confirmMeeting();
    router.replace("/"); 
  };

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
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>약속 설정</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 입력 카드 */}
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

            {/* 날짜 */}
            <View style={styles.row}>
              <Text style={styles.label}>날짜</Text>

              <Pressable onPress={() => setShowDateModal(true)} style={{ flex: 1 }}>
                <View style={styles.fakeInput}>
                  <Text style={styles.fakeInputText}>
                    {meetingDate ? dateText : "약속 날짜"}
                  </Text>
                </View>
              </Pressable>

              <Pressable onPress={() => setShowDateModal(true)} style={styles.calendarBtn}>
                <Text style={styles.calendarText}>📅</Text>
              </Pressable>
            </View>

            {/* 시간 */}
            <View style={styles.row}>
              <Text style={styles.label}>시간</Text>

              <Pressable onPress={openTimer} style={styles.timePressable}>
                <TextInput
                  value={meetingTime}
                  placeholder="약속 시간"
                  placeholderTextColor={THEME.placeholder}
                  style={styles.timeinput}
                  editable={false}
                  pointerEvents="none"
                />
              </Pressable>
            </View>
          </View>
        </View>

        {/* 경로 선택 카드 */}
        <View style={styles.routeCard}>
          <Text style={styles.routeTitle}>경로 선택</Text>

          {!selectedRoute ? (
            <Pressable
              onPress={directionSearch}
              disabled={!readyInput}
              style={[styles.routeBtn, !readyInput && { opacity: 0.55 }]}
            >
              <Text style={styles.routeBtnText}>
                {readyInput ? "경로 탐색하기" : "필수 입력을 먼저 설정해주세요"}
              </Text>
            </Pressable>
          ) : (
            <>
              <Text style={styles.routeSummaryText}>{routeSummaryText}</Text>

              <View style={{ gap: 10, marginTop: 10 }}>
                {previewSegments.map((seg, idx) => (
                  <SegmentChip key={idx} seg={seg as any} />
                ))}
              </View>

              <View style={styles.routeActions}>
                <Pressable onPress={directionSearch} style={styles.smallBtn}>
                  <Text style={styles.smallBtnText}>경로 변경</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setSelectedRoute(null);
                    setDepartureAt(null);
                  }}
                  style={[styles.smallBtn, styles.smallBtnDanger]}
                >
                  <Text style={[styles.smallBtnText, styles.smallBtnDangerText]}>
                    경로 지우기
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>

        {/* 진행 상태/가이드 */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>진행 상태</Text>

          <View style={styles.progressRow}>
            <View style={[styles.dot, originPlace && styles.dotOn]} />
            <Text style={styles.progressText}>출발지</Text>

            <View style={[styles.dot, destPlace && styles.dotOn]} />
            <Text style={styles.progressText}>도착지</Text>

            <View style={[styles.dot, meetingDate && styles.dotOn]} />
            <Text style={styles.progressText}>날짜</Text>

            <View style={[styles.dot, meetingTimeStr && styles.dotOn]} />
            <Text style={styles.progressText}>시간</Text>

            <View style={[styles.dot, selectedRoute && styles.dotOn]} />
            <Text style={styles.progressText}>경로</Text>
          </View>

          <Text style={styles.infoDesc}>{progressText}</Text>

          {!readyInput && (
            <View>
              <View style={styles.tipBox}>
                <Text style={styles.tipTitle}>팁</Text>
                <Text style={styles.tipText}>
                  출발/도착이 가까우면 경로가 안 뜰 수 있어요. 그럴 땐 도보 이동을 고려해보세요.
                </Text>
              </View>

              <View style={[styles.tipBox, { marginTop: 10 }]}>
                <Text style={styles.tipTitle}>팁</Text>
                <Text style={styles.tipText}>
                  심야 시간에는 대중교통 운행이 제한될 수 있어요. 택시나 자가용 이동을 추천해요.
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* 약속 저장하기 */}
      <View style={styles.bottomBar}>
        <Pressable
          onPress={onPressSave}
          disabled={!readyToSave}
          style={[styles.saveBtn, !readyToSave && { opacity: 0.55 }]}
        >
          <Text style={styles.saveBtnText}>
            {readyToSave ? "약속 저장하기" : "경로까지 선택하면 저장할 수 있어요"}
          </Text>
        </Pressable>

        <Text style={styles.bottomHint}>
          {readyToSave
            ? "저장하면 홈에서 출발 타이머와 알림이 자동으로 설정돼요."
            : selectedRoute
            ? "필수 입력을 확인해 주세요."
            : "경로를 선택하면 저장 버튼이 활성화돼요."}
        </Text>
      </View>

      {/* 날짜 모달 */}
      <DateTimePickerModal
        isVisible={showDateModal}
        mode="date"
        date={meetingDate ? ymdToDate(meetingDate) : new Date()}
        onConfirm={(picked) => {
          setMeetingDate(getLocalYYYYMMDD(picked));
          setShowDateModal(false);
        }}
        onCancel={() => setShowDateModal(false)}
        locale="ko_KR"
        confirmTextIOS="확인"
        cancelTextIOS="취소"
      />
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
  container: { flex: 1, backgroundColor: THEME.bg },

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

  content: {
    paddingHorizontal: 14,
    paddingBottom: 140,
    gap: 12,
  },

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
  label: { fontSize: 16, fontWeight: "800", color: THEME.text },

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

  fakeInput: {
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 14,
    justifyContent: "center",
    backgroundColor: THEME.inputBg,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  fakeInputText: {
    fontSize: 15,
    fontWeight: "600",
    color: THEME.text,
  },

  calendarBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME.orangeSoft,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
  },
  calendarText: { fontSize: 18 },

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

  // route card
  routeCard: {
    backgroundColor: THEME.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    gap: 10,
  },
  routeTitle: { fontSize: 14, fontWeight: "900", color: THEME.text },
  routeBtn: {
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: THEME.orangeSoft,
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
  },
  routeBtnText: { fontSize: 14, fontWeight: "900", color: THEME.orangeDark },
  routeSummaryText: { fontSize: 13, fontWeight: "900", color: THEME.text },
  routeActions: { flexDirection: "row", gap: 10, marginTop: 12 },
  smallBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  smallBtnText: { fontSize: 13, fontWeight: "900", color: THEME.text },
  smallBtnDanger: { borderColor: "#FCA5A5", backgroundColor: "#FEF2F2" },
  smallBtnDangerText: { color: "#B91C1C" },

  // info card
  infoCard: {
    backgroundColor: THEME.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    gap: 10,
  },
  infoTitle: { fontSize: 14, fontWeight: "900", color: THEME.text },
  infoDesc: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.muted,
    lineHeight: 18,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    borderWidth: 1,
    borderColor: THEME.border,
  },
  dotOn: { backgroundColor: THEME.orange, borderColor: THEME.orangeBorder },
  progressText: {
    fontSize: 12,
    fontWeight: "900",
    color: THEME.text,
    marginRight: 10,
  },

  tipBox: {
    backgroundColor: THEME.orangeSoft,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
    gap: 6,
  },
  tipTitle: { fontSize: 12, fontWeight: "900", color: THEME.orangeDark },
  tipText: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.muted,
    lineHeight: 18,
  },

  // bottom bar
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
  saveBtn: {
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
  saveBtnText: { fontSize: 15, fontWeight: "900", color: "#fff" },
  bottomHint: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "800",
    color: THEME.muted,
    textAlign: "center",
  },
});
