import { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

import { usePlacesStore } from "@/store/usePlacesStore";
import { API_BASE_URL } from "@/src/config/env";
import { getOrCreateInstallId } from "@/src/lib/installId";

type Place = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export default function PlaceSearchScreen() {
  const router = useRouter();
  const { mode, scope, type, editId } = useLocalSearchParams<{ mode: "origin" | "dest"; scope: "draft" | "house"; type: "create" | "update"; editId?: string; }>();

  const { setDraftPlace, setMyHouse } = usePlacesStore();

  const isHouse = scope === "house";
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      const query = q.trim();
      if (!query) {
        setItems([]);
        return;
      }
      search(query);
    }, 250);

    return () => clearTimeout(t);
  }, [q]);

  const search = async (query: string) => {
    try {
      setLoading(true);
      const installId = await getOrCreateInstallId();

      const res = await axios.get(`${API_BASE_URL}/api/places/search`, {
        params: { q: query },
        timeout: 5000,
        headers: {
          "x-install-id": installId,
        }
      });

      setItems(res.data?.places ?? []);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const selectPlace = (place: Place) => {
    if (!mode) {
      router.back();
      return;
    }

    if (isHouse) {
      setMyHouse(place);
      router.back();
      return;
    }

    setDraftPlace(mode, place);

    if (type == "update") {
      router.back();
      return;
    }

    router.replace("/create-meeting");
  };

  const goMapPick = () => {
    if (!mode) return;
    router.replace({
      pathname: "/map-pick",
      params: { mode, scope, type, editId },
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>
            {isHouse
              ? "우리집 등록"
              : mode === "origin"
                ? "출발지 검색"
                : "목적지 검색"}
          </Text>

          <Pressable
            onPress={goMapPick}
            hitSlop={10}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="지도에서 위치 선택"
          >
            <Ionicons name="map-outline" size={22} color="#111827" />
          </Pressable>
        </View>

        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="장소명 또는 주소로 검색해보세요!"
          style={styles.input}
          autoFocus
        />

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8 }}>검색 중...</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item, idx) => item.name + idx}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable style={styles.item} onPress={() => selectPlace(item)}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemSub}>{item.address}</Text>
              </Pressable>
            )}
            ListEmptyComponent={
              q.trim() ? (
                <Text style={styles.empty}>검색 결과가 없어요.</Text>
              ) : (
                <Text style={styles.empty}>장소명 또는 주소로 검색해보세요!</Text>
              )
            }
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  header: { fontSize: 18, fontWeight: "800" },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFB",
    marginBottom: 10,
  },

  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
  itemSub: { marginTop: 4, fontSize: 12, color: "#6B7280" },

  empty: { paddingVertical: 18, textAlign: "center", color: "#6B7280" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
