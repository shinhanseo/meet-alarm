import { useState, useEffect } from "react";
import { View, StyleSheet, Text, TextInput, ActivityIndicator} from "react-native";
import MapView, { Region }from "react-native-maps";
import * as Location from "expo-location";

export default function HomeScreen() {
  type Place = {
    name : string;
    address : string;
    lat : number;
    lng : number;
  }
  
  const [region, setRegion] = useState<Region | null>(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("위치 권한 거부됨");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

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
        {/* 그린 포인트 바 */}
        <View style={styles.accent} />

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>어디로 이동하시나요?</Text>

          {/* 출발 */}
          <View style={styles.row}>
            <TextInput
              value={origin}
              onChangeText={setOrigin}
              placeholder="출발지를 입력하세요"
              placeholderTextColor="#9AA0A6"
              style={styles.input}
            />
          </View>

          {/* 도착 */}
          <View style={styles.row}>
            <TextInput
              value={destination}
              onChangeText={setDestination}
              placeholder="목적지를 입력하세요"
              placeholderTextColor="#9AA0A6"
              style={styles.input}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8F7", // 지도 깔리면 사실상 안 보임
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
});
