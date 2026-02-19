import { View, Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Region } from "react-native-maps";
import * as Location from "expo-location";
import { useState, useEffect, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "@/src/config/env";
import axios from "axios";
import { usePlacesStore } from "@/src/store/usePlacesStore";
import { getOrCreateInstallId } from "@/src/lib/installId";
import { styles } from "./styles";

type Place = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export default function MapPickScreen() {
  const router = useRouter();
  const { mode, scope, type, editId } = useLocalSearchParams<{
    mode: "origin" | "dest";
    scope: "draft" | "house";
    type: "create" | "update";
    editId?: string;
  }>();

  const isHouse = scope === "house";

  const [region, setRegion] = useState<Region | null>(null);

  const [address, setAddress] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [buildingName, setBuildingName] = useState<string>("");

  const [addrLoading, setAddrLoading] = useState(false);
  const [addrError, setAddrError] = useState<string>("");

  const { setDraftPlace, setMyHouse } = usePlacesStore();

  const requestSeq = useRef(0);

  const actionText = isHouse
    ? "우리집 등록"
    : mode === "origin"
      ? "출발지로 설정"
      : "목적지로 설정";

  const hasResolvedText = !!(buildingName || name || address);

  const displayLocationText = hasResolvedText
    ? buildingName || name || address
    : addrLoading
      ? "주소 불러오는 중..."
      : addrError
        ? "주소를 불러오지 못했어요"
        : "주소 불러오는 중...";

  const reverseGeocode = async (lat: number, lng: number) => {
    const seq = ++requestSeq.current;

    try {
      setAddrLoading(true);
      setAddrError("");
      const installId = await getOrCreateInstallId();

      const res = await axios.get(`${API_BASE_URL}/api/places/map-pick`, {
        params: { lat, lng },
        timeout: 10_000,
        headers: {
          "x-install-id": installId,
        }
      });

      if (seq !== requestSeq.current) return;

      const addr = res.data?.place?.address ?? "";
      const placeName = res.data?.place?.name ?? "";
      const bname = res.data?.place?.buildingName ?? "";

      setAddress(addr);
      setName(placeName);
      setBuildingName(bname);
    } catch (e) {
      if (seq !== requestSeq.current) return;
      setAddrError("주소를 불러오지 못했어요");
      setAddress("");
      setName("");
      setBuildingName("");
    } finally {
      if (seq === requestSeq.current) setAddrLoading(false);
    }
  };

  const selectPlace = (place: Place) => {
    if (isHouse) {
      setMyHouse(place);
      router.replace("/setting");
      return;
    }

    if (!mode) {
      router.back();
      return;
    }

    setDraftPlace(mode, place);
    if (type === "update") {
      if (!editId) {
        router.replace("/appointments-list");
        return;
      }

      router.back();
      return;
    }

    router.replace("/create-meeting");
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({});
      const r: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(r);
      reverseGeocode(r.latitude, r.longitude);
    })();
  }, []);

  if (!region) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator />
        <Text style={{ marginTop: 10 }}>내 위치 불러오는 중...</Text>

        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>뒤로</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={region}
        showsUserLocation
        userInterfaceStyle="light"
        onRegionChangeComplete={(r) => {
          setRegion(r);
          reverseGeocode(r.latitude, r.longitude);
        }}
      />

      <View style={styles.centerPin} pointerEvents="none">
        <Ionicons name="location-sharp" size={36} color="#F97316" />
      </View>

      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>뒤로</Text>
      </Pressable>

      <View style={styles.bottomContainer} pointerEvents="box-none">
        <View style={styles.coordBox} pointerEvents="none">
          <Text>{displayLocationText}</Text>
          {!!addrError && <Text style={{ marginTop: 6 }}>{addrError}</Text>}
        </View>

        <Pressable
          style={[styles.confirmBtn, addrLoading && { opacity: 0.6 }]}
          disabled={addrLoading}
          onPress={() =>
            selectPlace({
              name: buildingName || name || address || "선택한 위치",
              address: address || "주소 정보 없음",
              lat: region.latitude,
              lng: region.longitude,
            })
          }
        >
          <Text style={styles.confirmText}>{actionText}</Text>
        </Pressable>
      </View>
    </View>
  );
}
