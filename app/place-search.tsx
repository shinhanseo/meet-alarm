import { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import axios from "axios";
import { usePlacesStore } from "../store/usePlacesStore";
import { API_BASE_URL } from "@/src/config/env";

type Place = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

const BASE_URL = "http://192.168.0.30:4000";

export default function PlaceSearchScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: "origin" | "dest" }>();
  const { setPlace } = usePlacesStore();

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

      const res = await axios.get(`${API_BASE_URL}/api/places/search`, {
        params: { q: query },
        timeout: 5000,
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

    setPlace(mode, place);
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.header}>
          {mode === "origin" ? "출발지 검색" : "목적지 검색"}
        </Text>

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
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16, backgroundColor: "#fff" },
  header: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFB",
    marginBottom: 10,
  },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  itemTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
  itemSub: { marginTop: 4, fontSize: 12, color: "#6B7280" },
  empty: { paddingVertical: 18, textAlign: "center", color: "#6B7280" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
