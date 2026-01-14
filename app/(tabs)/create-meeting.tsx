import { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Region } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { usePlacesStore } from "../../store/usePlacesStore";

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

  if (!region) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>내 위치 불러오는 중...</Text>
      </View>
    );
  }

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

    <View style={styles.actions}>
        <Pressable onPress={reset} style={styles.resetBtn}>
          <Text style={styles.resetText}>초기화</Text>
        </Pressable>
    </View>

    {/* 경로 탐색 버튼 */}
    <View style={styles.routeSearch}>
      <Pressable onPress={directionSearch} style={styles.routeSearchBtn}>
        <Text style={styles.directionText}>
          경로 탐색하기
        </Text>
      </Pressable>
    </View>
    </View>
  );
}

const THEME = {
  bg: "#FAFAF9",            // 따뜻한 화이트 배경
  card: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  placeholder: "#9AA0A6",
  border: "#E7E5E4",        // stone 계열
  inputBg: "#FFFFFF",

  orange: "#F97316",        // 포인트
  orangeDark: "#EA580C",
  orangeSoft: "#FFF7ED",
  orangeBorder: "#FED7AA",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
  },

  // 로딩
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.bg,
  },

  // 상단 입력 카드(기존 레이아웃 유지)
  card: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    flexDirection: "row",
    backgroundColor: THEME.card,
    borderRadius: 18,
    padding: 16,

    // 기존 elevation/shadow는 유지하되 "뿌연 느낌" 줄이려고 약하게
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },

    borderWidth: 1,
    borderColor: THEME.border,
  },

  // 왼쪽 포인트 바
  accent: {
    width: 6,
    borderRadius: 6,
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
    fontWeight: "700",
    color: THEME.text,
  },

  input: {
    flex: 1,
    height: 44,
    backgroundColor: THEME.inputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: THEME.text,

    borderWidth: 1,
    borderColor: THEME.border,
  },

  timePressable: { flex: 1 },

  timeinput: {
    height: 44,
    backgroundColor: THEME.inputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: THEME.text,
    minWidth: 90,

    borderWidth: 1,
    borderColor: THEME.border,
  },

  // 오늘/내일 세그먼트(기존 구조 유지, 색만 오렌지)
  segment: {
    flexDirection: "row",
    backgroundColor: THEME.orangeSoft,
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
  },

  segmentBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
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

  // 초기화 버튼 위치(기존 유지)
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
    backgroundColor: THEME.orangeSoft,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
  },

  resetText: {
    fontSize: 13,
    fontWeight: "900",
    color: "THEME.orangeDark",
  },

  directionText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#fff",
  },

  // 경로 탐색 버튼 위치(기존 유지)
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
    backgroundColor: THEME.orange,
  },
});


