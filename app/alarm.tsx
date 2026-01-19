import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function AlarmScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.big}>⏰ 알람!</Text>

      <Pressable style={styles.btn} onPress={() => router.replace("/")}>
        <Text style={styles.btnText}>닫기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  big: { fontSize: 28, fontWeight: "800" },
  btn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1 },
  btnText: { fontSize: 16, fontWeight: "700" },
});
