import { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import MapView, { Region } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { usePlacesStore } from "../../store/usePlacesStore";

export default function HomeScreen() {
  const router = useRouter();
  const { originPlace, destPlace, setPlace, reset, meetingTime, meetingDayOffset, setMeetingDayOffset } = usePlacesStore();
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
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        showsUserLocation
        userInterfaceStyle="light"
      />

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

            {/* 시간 선택 영역(Pressable) */}
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

            {/* 오늘/내일 세그먼트 */}
            <View style={styles.segment}>
              <Pressable
                onPress={() => setMeetingDayOffset(0)}
                style={[styles.segmentBtn, meetingDayOffset === 0 && styles.segmentBtnActive]}
              >
                <Text style={[styles.segmentText, meetingDayOffset === 0 && styles.segmentTextActive]}>
                  오늘
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setMeetingDayOffset(1)}
                style={[styles.segmentBtn, meetingDayOffset === 1 && styles.segmentBtnActive]}
              >
                <Text style={[styles.segmentText, meetingDayOffset === 1 && styles.segmentTextActive]}>
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

      <View style={styles.routeSearch}>
        <Pressable onPress={directionSearch} style={styles.routeSearchBtn}>
          <Text style={styles.resetText}>경로 탐색하기</Text>
        </Pressable>
      </View>
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

  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

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
});
