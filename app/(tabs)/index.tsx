import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, TextInput, ActivityIndicator, Pressable } from "react-native";
import MapView, { Region } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { usePlacesStore } from "../../store/usePlacesStore";

export default function HomeScreen() {
  const router = useRouter();
  const { originPlace, destPlace, setPlace, reset, meetingTime} = usePlacesStore();
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

      // zustand 스토어에 출발지가 아직 없을 때만 현재 위치로 설정
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
    router.push({
      pathname: "/place-search",
      params: { mode },
    });
  };

  const openTimer = () => {
    router.push({
      pathname : "/set-time",
    });
  }

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
      {/* 지도 (배경) */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        showsUserLocation
        userInterfaceStyle="light"
      />

      {/* 출발지, 목적지 입력하는 카드 섹션 */}
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
              editable={false} // 직접 타이핑 X
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

          <Pressable onPress={() => openTimer()} style={styles.row}>
            <Text style={styles.label}>시간</Text>
            <TextInput 
              value={
                meetingTime
                  ? meetingTime.toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""
              }
              placeholder="약속 시간을 입력하세요"
              placeholderTextColor="#9AA0A6"
              style={styles.input}
              editable={false}
              pointerEvents="none"
            />
          </Pressable>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable onPress={reset} style={styles.resetBtn}>
          <Text style={styles.resetText}>초기화</Text>
        </Pressable>
      </View>
      <View style={styles.routeSearch}>
        <Pressable style={styles.routeSearchBtn}>
          <Text style={styles.resetText}> 경로 탐색하기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8F7",
  },

  card: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,

    flexDirection: "row",
    backgroundColor: "#75B06F",
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

  title: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
    color: "#1F2937",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },

  input: {
    flex: 1,
    height: 44,
    backgroundColor: "#F1F5F1",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111827",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  actions: {
    position: "absolute",
    top: 50 + 160 + 50, // 카드 top + 카드 height + 간격
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
  
  resetText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },

  routeSearch : {
    position: "absolute",
    top: 50 + 160 + 50, // 카드 top + 카드 height + 간격
    left: 10,
    right: 20,
    alignItems: "flex-end",
  },

  routeSearchBtn : {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#F0F8A4",
  },
});
